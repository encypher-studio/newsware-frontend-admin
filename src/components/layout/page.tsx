import { PropsWithChildren } from "react";
import { Outlet } from "react-router-dom";
import Sidebar, { ISidebarOption } from "./sidebar/sidebar";

interface IProps {
    sidebarOptions: ISidebarOption[]
}

export default function Layout({ sidebarOptions }: PropsWithChildren<IProps>) {
    return (
        <div className="px-6 items-start grid gap-6 lg:gap-10 grid-cols-[auto_1fr]">
            <Sidebar options={sidebarOptions} />
            <main className="py-6 overflow-hidden">
                <div className="mx-auto w-full min-w-0">
                    <Outlet />
                </div>
            </main>
        </div>
    )
}
