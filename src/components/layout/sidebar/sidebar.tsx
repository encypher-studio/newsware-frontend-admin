import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { AuthContext } from "@/lib/context/auth"
import { APP_ROUTES, RouteOption } from "@/lib/routes/routes"
import { DropdownMenuSeparator } from "@radix-ui/react-dropdown-menu"
import { CaretSortIcon, DoubleArrowLeftIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import path from "path"
import { useContext, useState } from "react"
import { Link, useLocation } from "react-router-dom"

export default function Sidebar() {
    const location = useLocation()
    const [open, setOpen] = useState(true)
    const { logOut } = useContext(AuthContext)

    const getOptions = (routes: { [path: string]: RouteOption }, prefixPath: string): React.ReactNode[] => {
        let indentation = prefixPath.split("/").length
        if (prefixPath === "") {
            indentation = 0
        }

        const nodes = []
        for (const optionPath in routes) {
            const option = routes[optionPath]

            const content = []
            if (option.options) {
                content.push(...getOptions(option.options, path.join(prefixPath, optionPath)))
            }

            nodes.push(<Collapsible key={option.title} className="grid grid-flow-row auto-rows-max text-sm" defaultOpen={location.pathname.startsWith(path.join("/", prefixPath, optionPath))}>
                <CollapsibleTrigger asChild>
                    <Link
                        key={optionPath}
                        className={(" pl-" + indentation * 2)
                            + (prefixPath === "" ? " pt-2" : " text-muted-foreground")
                            + (location.pathname.startsWith(path.join("/", prefixPath, optionPath)) ? "font-medium text-foreground" : "")
                            + " group flex w-full items-center rounded-md border border-transparent py-1 hover:underline"
                        }
                        to={
                            option.forceExact ? optionPath :
                                optionPath.startsWith("http") || option.component ? path.join(prefixPath, optionPath) : location.pathname
                        }
                        target={option.targetBlank ? "_blank" : ""}>
                        {option.title} {option.options ? <CaretSortIcon className="h-4 w-4" /> : <></>}
                    </Link>
                </CollapsibleTrigger>
                <CollapsibleContent>
                    {content.map((node) => node)}
                </CollapsibleContent>
            </Collapsible >)
        }

        return nodes
    }

    return (
        <>
            <aside
                className={" top-0 sticky z-30 h-[calc(100vh-3.5rem)]"}
            >
                <HamburgerMenuIcon
                    className={
                        (open ? "hidden" : "block")
                        + " absolute top-5 left-0 cursor-pointer"
                    }
                    onClick={() => setOpen(!open)}
                />
                <div className={
                    (open ? "block" : "hidden")
                    + " relative overflow-hidden h-full py-6 pr-6"
                }>
                    <div className="h-full w-full rounded-[inherit]">
                        <DoubleArrowLeftIcon className="absolute top-5 right-0 cursor-pointer" onClick={() => setOpen(!open)} />
                        <div className="min-width: 100%; display: table;">
                            <div className="w-full">
                                {
                                    getOptions(APP_ROUTES, "").map((node) => node)
                                }
                                <Link
                                    to={"#"}
                                    className="mt-10 text-muted-foreground group flex w-full items-center rounded-md border border-transparent py-1 hover:underline"
                                    onClick={() => logOut()}>Logout</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </aside >
        </>
    )
}
