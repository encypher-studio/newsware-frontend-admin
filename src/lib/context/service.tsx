import React, { PropsWithChildren, useContext } from "react"
import { ApiService } from "../services/api.service"
import { AuthContext } from "./auth"

interface IServiceContext {
    apiService: ApiService
}

export const ServiceContext = React.createContext<IServiceContext>({
    apiService: new ApiService("")
})

export function ServiceProvider({ children }: PropsWithChildren) {
    const { user } = useContext(AuthContext)

    const apiService = new ApiService(user ? user.apiKey : "")

    return <ServiceContext.Provider value={{
        apiService
    }}>
        {children}
    </ServiceContext.Provider>
}