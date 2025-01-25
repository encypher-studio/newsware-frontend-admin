import { Codes } from "@/components/codes/page"
import { Sources } from "@/components/sources/page"
import { Users } from "@/components/users/page"
import { IEnvironment, RouteOption } from "@newsware/ui"
import { Navigate, Outlet } from "react-router-dom"
import { DataProvider } from "../context/data"
import { ServiceProvider } from "../context/service"
import { AppPaths } from "./paths"

export const appRoutes = (_: IEnvironment): RouteOption[] => [
  {
    title: "",
    element: (
      <ServiceProvider>
        <DataProvider>
          <Outlet />
        </DataProvider>
      </ServiceProvider>
    ),
    children: [
      {
        title: "Home",
        path: AppPaths.HOME,
        element: <Navigate to={AppPaths.USERS} />,
        excludeFromSidebar: true,
      },
      {
        title: "Users",
        path: AppPaths.USERS,
        element: <Users />,
      },
      {
        title: "Codes",
        path: AppPaths.CODES,
        element: <Codes />,
      },
      {
        title: "Sources",
        path: AppPaths.SOURCES,
        element: <Sources />,
      },
    ],
  },
]
