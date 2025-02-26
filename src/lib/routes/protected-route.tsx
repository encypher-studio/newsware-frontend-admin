
import { Navigate, Outlet } from "react-router-dom";
import { AppPaths } from "./paths";
import { useAuthContext } from "@newsware/ui";

export const ProtectedRoute = () => {
    const { user } = useAuthContext()

    if (!user) {
        return <Navigate to={AppPaths.SIGN_IN} />
    }

    return <Outlet />
}