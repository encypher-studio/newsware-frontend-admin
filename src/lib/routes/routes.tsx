import { CategoryCodes } from "@/components/category-codes/page"
import Layout from "@/components/layout/page"
import { SignIn } from "@/components/sign-in/page"
import { Sources } from "@/components/sources/page"
import { Users } from "@/components/users/page"
import { Navigate, Outlet, RouteObject, useRouteError } from "react-router-dom"
import { AppPaths } from "./paths"
import { ProtectedRoute } from "./protected-route"
import { sidebarOptions } from "./sidebar-options"

export const appRoutes: RouteObject[] = [
    {
        errorElement: <ErrorBoundary />,
        children: [
            {
                element: <div className="py-6 px-6"><Outlet /></div>,
                children: [
                    {
                        element: <SignIn />,
                        path: AppPaths.SIGN_IN,
                    }
                ]
            },
            {
                element: <ProtectedRoute />,
                children: [
                    {
                        element: <Layout sidebarOptions={sidebarOptions} />,
                        children: [
                            {
                                path: AppPaths.HOME,
                                element: <Navigate to={AppPaths.USERS} />,
                            },
                            {
                                path: AppPaths.USERS,
                                element: <Users />,
                            },
                            {
                                path: AppPaths.CATEGORY_CODES,
                                element: <CategoryCodes />,
                            },
                            {
                                path: AppPaths.SOURCES,
                                element: <Sources />,
                            }
                        ]
                    }
                ]
            }
        ]
    }
]

function ErrorBoundary() {
    let error = useRouteError() as any

    return error
        ? <>
            <div>Something went wrong </div>
            <div> {
                error.data
                    ? error.data
                    : error.message
                        ? error.message
                        : ""
            }</div>
        </> : <Outlet />
}