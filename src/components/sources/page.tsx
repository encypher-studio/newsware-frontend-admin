import {DataContext} from "@/lib/context/data"
import {
    Button,
    ColumnDef,
    DataTable,
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@newsware/ui"
import {DotsHorizontalIcon} from "@radix-ui/react-icons"
import {SourceDetails} from "newsware"
import {useContext, useMemo, useState} from "react"
import Section from "../section/section"
import {EditSourceDialog} from "./edit-source-dialog"

export function Sources() {
  const { sources } = useContext(DataContext)
  const [_sources, setSources] = useState<SourceDetails[]>(sources)
  const sourceColumns = useMemo<ColumnDef<SourceDetails>[]>(
    () => [
      {
        accessorKey: "code",
        header: "Code"
      },
      {
        accessorKey: "name",
        header: "Name"
      },
      {
        accessorKey: "description",
        header: "Description"
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const source = row.original

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
                  onClick={() =>
                    setSourceDialog({
                      open: true,
                      source: source
                    })
                  }
                >
                  Edit
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )
        }
      }
    ],
    []
  )

  const [sourceDialog, setSourceDialog] = useState<{
    open: boolean
    source?: SourceDetails
  }>({
    open: false
  })

  const onSourceChanged = (source: SourceDetails) => {
    setSources((prev) => {
      const index = prev.findIndex((c) => c.code === source.code)
      const newSources = [...prev]
      newSources[index] = source
      return newSources
    })
  }

  return (
    <>
      {sourceDialog.source && (
        <EditSourceDialog
          source={sourceDialog.source}
          onOpenChange={() =>
            setSourceDialog((prev) => ({
              ...prev,
              open: false,
              source: undefined
            }))
          }
          onSourceChanged={onSourceChanged}
          open={sourceDialog.open}
        />
      )}

      <Section title="Sources">
        <DataTable columns={sourceColumns} data={_sources} />
      </Section>
    </>
  )
}
