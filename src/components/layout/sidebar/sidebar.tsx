import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { useAuthContext } from "@/lib/context/auth"
import { CaretSortIcon, DoubleArrowLeftIcon, HamburgerMenuIcon } from "@radix-ui/react-icons"
import path from "path"
import { useState } from "react"
import { Link, useLocation } from "react-router-dom"

export interface ISidebarOption {
    title: string
    path: string
    children?: ISidebarOption[]
    targetBlank?: boolean
    forceExact?: boolean
}

interface IProps {
    options: ISidebarOption[]
}

export default function Sidebar({ options }: IProps) {
    const location = useLocation()
    const [open, setOpen] = useState(true)
    const { signOut } = useAuthContext()

    const buildOptions = (options: ISidebarOption[], prefixPath: string): React.ReactNode[] => {
        let indentation = prefixPath.split("/").length
        if (prefixPath === "") {
            indentation = 0
        }

        const nodes = []
        for (const option of options) {
            const content = []
            if (option.children) {
                content.push(...buildOptions(option.children, path.join(prefixPath, option.path)))
            }

            nodes.push(<Collapsible key={option.title} className="grid grid-flow-row auto-rows-max text-sm" defaultOpen={location.pathname.startsWith(path.join("/", prefixPath, option.path))}>
                <CollapsibleTrigger asChild>
                    <Link
                        key={option.path}
                        className={(" pl-" + indentation * 2)
                            + (prefixPath === "" ? " pt-2" : " text-muted-foreground")
                            + (location.pathname.startsWith(path.join("/", prefixPath, option.path)) ? "font-medium text-foreground" : "")
                            + " group flex w-full items-center rounded-md border border-transparent py-1 hover:underline"
                        }
                        to={
                            option.forceExact ? option.path :
                                option.path.startsWith("http") ? location.pathname : path.join(prefixPath, option.path)
                        }
                        target={option.targetBlank ? "_blank" : ""}>
                        {option.title} {option.children ? <CaretSortIcon className="h-4 w-4" /> : <></>}
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
                                    buildOptions(options, "").map((node) => node)
                                }
                                <Link
                                    to={"#"}
                                    className="mt-10 text-muted-foreground group flex w-full items-center rounded-md border border-transparent py-1 hover:underline"
                                    onClick={() => signOut()}>Sign out</Link>
                            </div>
                        </div>
                    </div>
                </div>
            </aside >
        </>
    )
}
