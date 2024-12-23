import { ISidebarOption } from "@/components/layout/sidebar/sidebar";
import { AppPaths } from "./paths";

export const sidebarOptions: ISidebarOption[] = [
  {
    title: "Users",
    path: AppPaths.USERS,
  },
  {
    title: "Codes",
    path: AppPaths.CODES,
  },
  {
    title: "Sources",
    path: AppPaths.SOURCES,
  },
];
