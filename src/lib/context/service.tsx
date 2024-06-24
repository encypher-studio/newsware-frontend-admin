import React, { PropsWithChildren, useContext, useMemo } from "react"
import { ApiService } from "../services/api.service"
import { useAuthContext } from "./auth"

interface IServiceContext {
    apiService: ApiService
}

export const ServiceContext = React.createContext<IServiceContext | null>(null)

export function ServiceProvider({ children }: PropsWithChildren) {
    const { firebaseToken } = useAuthContext()
    const apiService = useMemo<ApiService>(() => {
        return new ApiService(firebaseToken)
    }, [firebaseToken])

    return <ServiceContext.Provider value={{
        apiService
    }}>
        {children}
    </ServiceContext.Provider>
}
export const useServiceContext = () => {
    const context = useContext(ServiceContext);

    if (!context) {
        throw new Error(
            "useServiceContext has to be used within <ServiceProvider>"
        );
    }

    return context
}