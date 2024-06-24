import { useServiceContext } from "@/lib/context/service";
import { DataTable } from "@/lib/data-table/data-table";
import { DataTableColumnHeader } from "@/lib/data-table/data-table-column-header";
import { SorDirection } from "@/lib/models/base";
import { GetUserFilter, User } from "@/lib/models/user";
import { DotsHorizontalIcon } from "@radix-ui/react-icons";
import { ColumnDef, PaginationState, SortingState } from "@tanstack/react-table";
import { RestResponse } from "newsware";
import { useEffect, useMemo, useState } from "react";
import Section from "../section/section";
import { Button } from "../ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "../ui/dropdown-menu";
import { Input } from "../ui/input";
import { useToast } from "../ui/use-toast";
import { SaveUserDialog } from "./save-user-dialog";

export function Users() {
    const [users, setUsers] = useState<User[]>([])
    const { apiService } = useServiceContext()
    const [selectedUser, setSelectedUser] = useState<User | undefined>(undefined)
    const [pagination, setPagination] = useState<PaginationState>({
        pageSize: 10,
        pageIndex: 0,
    })
    const [pageCount, setPageCount] = useState(0)
    const [usersFilter, setUsersFilter] = useState<GetUserFilter>({})
    const [sorting, setSorting] = useState<SortingState>([
        { id: "id", desc: true },
    ])
    const { toast } = useToast()
    const userColumns = useMemo<ColumnDef<User>[]>(() => ([
        {
            accessorKey: "id",
            header: ({ column }) => {
                return (
                    <>
                        <DataTableColumnHeader column={column} title="Id" />
                        <Input type="number" min={0} className="mb-2" placeholder="Search by id" value={usersFilter?.id} onChange={e => setUsersFilter(prev => ({ ...prev, id: Number(e.target.value) ? Number(e.target.value) : undefined }))} />
                    </>
                )
            },
        },
        {
            accessorKey: "name",
            header: ({ column }) => {
                return (
                    <>
                        <DataTableColumnHeader column={column} title="Name" />
                        <Input className="mb-2" placeholder="Search by name" value={usersFilter?.name} onChange={e => setUsersFilter(prev => ({ ...prev, name: e.target.value }))} />
                    </>
                )
            },
        },
        {
            accessorKey: "email",
            header: ({ column }) => {
                return (
                    <>
                        <DataTableColumnHeader column={column} title="Email" />
                        <Input className="mb-2" placeholder="Search by email" value={usersFilter?.email} onChange={e => setUsersFilter(prev => ({ ...prev, email: e.target.value }))} />
                    </>
                )
            },
        },
        {
            accessorKey: "apikey",
            header: "Api Key",
            cell: ({ row }) => {
                const user = row.original
                return user.apiKey ? user.apiKey : <div className="text-destructive">NOT ACTIVE</div>
            }
        },
        {
            id: "actions",
            header: "Actions",
            enableHiding: false,
            cell: ({ row }) => {
                const user = row.original

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
                            {
                                user.apiKey &&
                                <DropdownMenuItem
                                    onClick={() => navigator.clipboard.writeText(user.apiKey)}
                                >
                                    Copy api key
                                </DropdownMenuItem>
                            }
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={() => {
                                setSelectedUser({ ...user })
                            }}>Edit</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )
            },
        },
    ]), [])

    useEffect(() => {
        getUsers()
    }, [])

    useEffect(() => {
        getUsers()
    }, [usersFilter, sorting, pagination])

    const onUserChanged = (user: User, isDelete?: boolean) => {
        setUsers((prev) => {
            if (isDelete) {
                return prev.filter((u) => u.id !== user.id)
            }
            const index = prev.findIndex((u) => u.id === user.id)
            if (index === -1) {
                return [user, ...prev]
            } else {
                const newUsers = [...prev]
                newUsers[index] = user
                return newUsers
            }
        })
    }

    const getUsers = () => {
        apiService.getUsers({
            ...usersFilter,
            pagination: {
                limit: pagination.pageSize,
                page: pagination.pageIndex + 1,
            },
            sort: {
                field: sorting.length ? sorting[0].id : "id",
                direction: sorting.length ?
                    sorting[0].desc
                        ? SorDirection.DESC
                        : SorDirection.ASC
                    : SorDirection.DESC
            },
        })
            .then(handleGetUsers)
            .catch(e => toast({ title: e.message, variant: "destructive" }))
    }

    const handleGetUsers = (response: RestResponse<User[]>) => {
        setUsers(response.data)
        if (response.pagination && response.pagination.total) {
            setPageCount(Math.ceil(response.pagination.total / pagination.pageSize))
        }
    }

    return (
        <Section title="Users">
            <DataTable columns={userColumns} data={users}
                headerOptions={
                    <SaveUserDialog user={selectedUser} onUserChanged={onUserChanged} />
                }
                onSortingChange={setSorting}
                sorting={sorting}
                pagination={pagination}
                onPaginationChange={setPagination}
                pageCount={pageCount}
            />
        </Section>
    )
} 