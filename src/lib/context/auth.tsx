import { useToast } from '@/components/ui/use-toast';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, GoogleAuthProvider, ParsedToken, getAuth, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { PropsWithChildren, useContext, useEffect, useMemo } from "react";
import { Environment } from '../environment/environment';
import { User } from "../models/user";

interface ISignInParamsEmail {
    type: "email",
    email: string,
    password: string
}

interface ISignInParamsPopup {
    type: "google"
}

interface IAuthContext {
    user?: User,
    firebaseToken: string,
    signIn(params: ISignInParamsEmail | ISignInParamsPopup): Promise<void>
    signOut(): void
    setUser: React.Dispatch<React.SetStateAction<User | undefined>>
    resetPassword(email: string): Promise<void>
}

export const AuthContext = React.createContext<IAuthContext | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = React.useState<User | undefined>(undefined)
    const [firebaseToken, setFirebaseToken] = React.useState<string>("")
    const firebase = useMemo<FirebaseApp>(() => initializeApp(Environment.firebaseOptions), [])
    const firebaseAuth = useMemo<Auth>(() => {
        return getAuth(firebase)
    }, [firebase])
    const { toast } = useToast()

    useEffect(() => {
        firebaseAuth.onAuthStateChanged((firebaseUser) => {
            if (firebaseUser) {
                firebaseUser.getIdTokenResult().then((idTokenResult) => {
                    setFirebaseToken(idTokenResult.token)
                    const userNew = getUserFromClaims(idTokenResult.claims)
                    setUser(userNew)
                })
            } else {
                setUser(undefined)
            }
        })

        // TODO: Remove once Firebase fixes this issue:
        // https://github.com/firebase/firebase-js-sdk/issues/8061
        const originalSetTimeout = window.setTimeout;
        (window as any).setTimeout = function (fn: TimerHandler, delay: number, ...args: any[]) {
            if (delay === 8000) {
                delay = 0
            }
            return originalSetTimeout(fn, delay, ...args)
        }
    }, [])

    const getUserFromClaims = (claims: ParsedToken): User | undefined => {
        if (!claims || !claims.user) {
            throw new Error("Invalid token claims")
        }

        return JSON.parse(atob(claims.user as string)) as User
    }

    const signIn = async (params: ISignInParamsEmail | ISignInParamsPopup) => {
        try {
            if (params.type === "email") {
                await signInWithEmailAndPassword(firebaseAuth, params.email, params.password)
            } else {
                await signInWithPopup(firebaseAuth, new GoogleAuthProvider())
            }
        } catch (error: any) {
            if (error.code === "auth/admin-restricted-operation") {
                toast({
                    description: "Account with that email does not exist",
                    variant: "destructive"
                })
                return
            } else if (error.code === "auth/popup-closed-by-user") {
                return
            }

            toast({
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const signOut = async () => {
        try {
            await firebaseAuth.signOut()
        } catch (error: any) {
            toast({
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const resetPassword = async (email: string) => {
        try {
            await sendPasswordResetEmail(firebaseAuth, email)
            toast({
                description: "Reset password email sent",
            })
        } catch (error: any) {
            toast({
                description: error.message,
                variant: "destructive"
            })
            throw error
        }
    }


    return <AuthContext.Provider value={{
        user,
        signIn,
        signOut,
        firebaseToken,
        setUser,
        resetPassword
    }}>
        {children}
    </AuthContext.Provider>
}

export const useAuthContext = () => {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuthContext has to be used within <AuthProvider>"
        );
    }

    return context
}
