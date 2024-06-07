import { CategoryCodes } from "@/components/category-codes/page"
import { Users } from "@/components/users/page"

export interface RouteOption {
    title: string
    component?: React.ReactNode
    options?: {
        [path: string]: RouteOption
    }
    targetBlank?: boolean
    forceExact?: boolean
}

export const APP_ROUTES = {
    "users": {
        title: "Users",
        component: <Users />,
    },
    "category-codes": {
        title: "Category Codes",
        component: <CategoryCodes />
    },
}
