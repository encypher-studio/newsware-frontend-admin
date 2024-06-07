import { PropsWithChildren } from "react";
import Sidebar from "./sidebar/sidebar";

export default function Layout({ children }: PropsWithChildren) {

    return (
        <div className="px-6 items-start grid gap-6 lg:gap-10 grid-cols-[auto_1fr]">
            <Sidebar />
            <main className="py-6 overflow-hidden">
                <div className="mx-auto w-full min-w-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
