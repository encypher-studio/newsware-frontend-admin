import { useToast } from '@/components/ui/use-toast';
import { FirebaseApp, initializeApp } from 'firebase/app';
import { Auth, GoogleAuthProvider, ParsedToken, getAuth, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import React, { PropsWithChildren, useContext, useEffect, useMemo } from "react";
import { RoleId, User } from "../models/user";

const firebaseConfig = {
    apiKey: "AIzaSyD6ulCmv_WCGw1MIgLnAF8vn1_WWcz2RYg",
    authDomain: "nw-users-auth-staging.firebaseapp.com",
    projectId: "nw-users-auth-staging",
    storageBucket: "nw-users-auth-staging.appspot.com",
    messagingSenderId: "360373770580",
    appId: "1:360373770580:web:fdfa43fa673f5dc84390c1"
};

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
}

export const AuthContext = React.createContext<IAuthContext | null>(null)

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = React.useState<User | undefined>(undefined)
    const [firebaseToken, setFirebaseToken] = React.useState<string>("")
    const firebase = useMemo<FirebaseApp>(() => initializeApp(firebaseConfig), [])
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
                    if (!userNew?.roles?.find(role => role.id === RoleId.RoleAdmin)) {
                        toast({
                            description: "You do not have the required permissions to access this application",
                            variant: "destructive"
                        })
                        setUser(undefined)
                        signOut()
                        return
                    }

                    setUser(userNew)

                })
            } else {
                setUser(undefined)
            }
        })
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
            }
            toast({
                description: error.message,
                variant: "destructive"
            })
        }
    }

    const signOut = async () => {
        console.log("LOG OUT")
        try {
            await firebaseAuth.signOut()
        } catch (error: any) {
            toast({
                description: error.message,
                variant: "destructive"
            })
        }
    }


    return <AuthContext.Provider value={{
        user,
        signIn,
        signOut,
        firebaseToken,
        setUser
    }}>
        {children}
    </AuthContext.Provider>
}

export const useAuthContext = () => {
    const context = useContext(AuthContext)

    if (!context) {
        throw new Error(
            "useAuthContext has to be used within <AuthProvider>"
        );
    }

    return context
}
