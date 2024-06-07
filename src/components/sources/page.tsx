import { ServiceContext } from "@/lib/context/service";
import { DataTable } from "@/lib/data-table/data-table";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef } from "@tanstack/react-table";
import { SourceDetails } from "newsware";
import { useContext, useEffect, useMemo, useState } from "react";
import Section from "../section/section";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { useToast } from "../ui/use-toast";
import { EditSourceDialog } from "./edit-source-dialog";

export function Sources() {
    const [sources, setSources] = useState<SourceDetails[]>([])
    const { apiService } = useContext(ServiceContext)
    const [selectedSource, setSelectedSource] = useState<SourceDetails>({ code: "", name: "", description: "" })
    const { toast } = useToast()
    const sourceColumns = useMemo<ColumnDef<SourceDetails>[]>(() => ([
        {
            accessorKey: "code",
            header: "Code",
        },
        {
            accessorKey: "name",
            header: "Name",
        },
        {
            accessorKey: "description",
            header: "Description",
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
                            <DialogTrigger asChild onClick={() => setSelectedSource(source)}>
                                <DropdownMenuItem>Edit</DropdownMenuItem>
                            </DialogTrigger>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]), [])

    useEffect(() => {
        apiService.api.getSources().then(setSources).catch((e: any) => toast({ title: e.message, variant: "destructive" }))
    }, [])

    const onSourceChanged = (source: SourceDetails) => {
        setSources((prev) => {
            const index = prev.findIndex((c) => c.code === source.code)
            const newSources = [...prev]
            newSources[index] = source
            return newSources
        })
    }

    return (
        <EditSourceDialog source={selectedSource} onSourceChanged={onSourceChanged}>
            <Section title="Sources">
                <DataTable columns={sourceColumns} data={sources}
                    headerOptions={
                        <EditSourceDialog source={selectedSource} onSourceChanged={onSourceChanged} />
                    }
                />
            </Section>
        </EditSourceDialog >
    )
} 