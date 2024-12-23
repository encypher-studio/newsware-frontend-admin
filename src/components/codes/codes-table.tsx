import {
  Button,
  ColumnDef,
  DataTable,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@newsware/ui"
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { Code, CodeType } from "newsware"
import { useContext } from "react"
import { DataContext } from "../../lib/context/data"

interface IProps {
  codes: Code[]
  headerOptions?: React.ReactNode
}

export function CodesTable({ codes, headerOptions }: IProps) {
  const isGroup = (code: Code) => code?.type === CodeType.GROUP
  const {
    setSelectedGroupCode: setGroupCode,
    selectedGroupCode: groupCode,
    editChildCode,
  } = useContext(DataContext)
  const { setSelectedCode } = useContext(DataContext)

  let codesColumns: ColumnDef<Code>[] = [
    {
      accessorKey: "code",
      header: "Code",
      accessorFn: (row) => `${isGroup(row) ? "" : row.source + "."}${row.code}`,
    },
    {
      accessorKey: "description",
      header: "Description",
      accessorFn: (row) =>
        row.description
          ? row.description
          : row.code.charAt(0).toUpperCase() +
            row.code.split("_").join(" ").slice(1),
    },
    {
      id: "children",
      accessorKey: "children",
      header: "Associated codes",
      accessorFn: (row: Code) =>
        row.children
          ?.map((child) => child.source + "." + child.code)
          .join("\n"),
      enableHiding: isGroup(codes[0]),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const code = row.original

        if (!isGroup(codes[0]) && groupCode !== undefined) {
          const isChild = !!groupCode?.children.find(
            (child) => child.code === code.code
          )
          return (
            <Button
              variant="ghost"
              onClick={() => {
                editChildCode(code, isChild)
              }}
            >
              {isChild ? "Remove from group" : "Add to group"}
            </Button>
          )
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
              <DropdownMenuItem
                onClick={() => {
                  setSelectedCode(code)
                }}
              >
                Edit
              </DropdownMenuItem>
              {groupCode === undefined && (
                <DropdownMenuItem
                  onClick={() => {
                    setGroupCode(code)
                  }}
                >
                  Edit codes
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  if (!isGroup(codes[0])) {
    codesColumns = codesColumns.filter((column) => column.id !== "children")
  }

  return (
    <DataTable
      disableColumnToggling
      columns={codesColumns}
      data={codes}
      headerOptions={headerOptions}
    />
  )
}
