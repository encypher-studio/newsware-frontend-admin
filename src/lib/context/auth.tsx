import { PropsWithChildren, createContext, useEffect, useState } from "react"
import { RoleId, User } from "../models/user"
import { ApiService } from "../services/api.service"
import { useToast } from "@/components/ui/use-toast"

type AuthState = {
    user?: User
    logIn: (apiKey: string) => void
    logOut: () => void
    isLoggedIn: () => boolean
}
export const AuthContext = createContext<AuthState>({
    user: undefined,
    logIn: () => null,
    logOut: () => null,
    isLoggedIn: () => false
})

export function AuthProvider({ children }: PropsWithChildren) {
    const [user, setUser] = useState<User | undefined>(undefined)
    const apiService = new ApiService("")
    const { toast } = useToast()

    useEffect(() => {
        const user = localStorage.getItem('user')
        if (user && user != "undefined") {
            logIn((JSON.parse(user) as User).apiKey)
        }
    }, [])

    const logIn = async (apiKey: string) => {
        const user = await apiService.getUserByApiKey(apiKey)
        if (!isAdmin(user)) {
            toast({ title: 'Only admins can sign in', variant: 'destructive' })
            return
        }
        setUser(await apiService.getUserByApiKey(apiKey))
        localStorage.setItem('user', JSON.stringify(user))
    }

    const isLoggedIn = () => {
        return !!user
    }

    const logOut = async () => {
        localStorage.removeItem('user');
        setUser(undefined)
    }

    const isAdmin = (user: User) => {
        if (!user.roles) return false

        for (const role of user.roles) {
            if (role.id === RoleId.RoleAdmin) return true;
        }

        return false;
    }


    return (
        <AuthContext.Provider value={{ user, logIn, logOut, isLoggedIn }}>
            {children}
        </AuthContext.Provider>
    )
}