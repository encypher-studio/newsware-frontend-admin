import { DataTable } from "@/lib/data-table/data-table";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { CategoryCode } from "newsware";
import { useContext, useMemo } from "react";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { CategoryCodesContext } from "./category-codes-context";

interface IProps {
    categoryCodes: CategoryCode[]
    headerOptions?: React.ReactNode
}

export function CategoryCodesTable({ categoryCodes, headerOptions }: IProps) {
    const isGroup = (categoryCode: CategoryCode) => categoryCode.source === "group"
    const { setSelectedGroupCode: setGroupCategoryCode, selectedGroupCode: groupCategoryCode, editChildCode } = useContext(CategoryCodesContext)
    const { setSelectedCategoryCode } = useContext(CategoryCodesContext)


    let categoryCodesColumns: ColumnDef<CategoryCode>[] = [
        {
            accessorKey: "code",
            header: "Code",
            accessorFn: (row) => `${isGroup(row) ? "" : row.source + "."}${row.code}`,
        },
        {
            accessorKey: "description",
            header: "Description",
            accessorFn: (row) => row.description ? row.description : row.code.charAt(0).toUpperCase() + row.code.split("_").join(" ").slice(1)
        },
        {
            id: "children",
            accessorKey: "children",
            header: "Associated codes",
            accessorFn: (row: CategoryCode) => row.children?.map((child) => child.source + "." + child.code).join("\n"),
            enableHiding: isGroup(categoryCodes[0]),
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const categoryCode = row.original

                if (!isGroup(categoryCodes[0]) && groupCategoryCode !== undefined) {
                    const isChild = !!groupCategoryCode?.children.find((child) => child.code === categoryCode.code)
                    return <Button variant="ghost" onClick={() => {
                        editChildCode(categoryCode, isChild)
                    }}>
                        {
                            isChild ? "Remove from group" : "Add to group"
                        }
                    </Button>
                }

                return (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <DotsHorizontalIcon className="h-4 w-4" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setSelectedCategoryCode(categoryCode)
                            }}>Edit</DropdownMenuItem>
                            {groupCategoryCode === undefined &&
                                <DropdownMenuItem onClick={() => {
                                    setGroupCategoryCode(categoryCode)
                                }}>
                                    Edit codes
                                </DropdownMenuItem>
                            }
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]


    if (!isGroup(categoryCodes[0])) {
        categoryCodesColumns = categoryCodesColumns.filter((column) => column.id !== "children")
    }

    return (
        <DataTable disableColumnToggling columns={categoryCodesColumns} data={categoryCodes} headerOptions={headerOptions} />
    )
} 