
import { Navigate, Outlet } from "react-router-dom";
import { useAuthContext } from "../context/auth";
import { AppPaths } from "./paths";

export const ProtectedRoute = () => {
    const { user } = useAuthContext()

    if (!user) {
        return <Navigate to={AppPaths.SIGN_IN} />
    }

    return <Outlet />
}