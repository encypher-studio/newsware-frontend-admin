import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AuthContext } from "@/lib/context/auth"
import { ServiceContext } from "@/lib/context/service"
import { User } from "@/lib/models/user"
import { SelectDropdown } from "@/lib/select-dropdown/select-dropdown"
import { useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../../lib/context/data"
import { Switch } from "../ui/switch"
import { ToastAction } from "../ui/toast"
import { useToast } from "../ui/use-toast"

interface IProps {
    user?: User
    onUserChanged: (user: User, isDelete?: boolean) => void
}

export function SaveUserDialog({ user, onUserChanged }: IProps) {
    const [name, setName] = useState(user?.name ?? '')
    const [email, setEmail] = useState(user?.email ?? '')
    const [_user, _setUser] = useState(user)
    const refDialogTrigger = useRef<HTMLButtonElement>(null)
    const { user: loggedUser } = useContext(AuthContext)
    const { toast } = useToast()
    const { apiService } = useContext(ServiceContext)
    const { sources, roles } = useContext(DataContext)
    const [selectedSources, setSelectedSources] = useState<string[]>(user?.sources?.map(source => source.code) ?? [])
    const [sourcesOptions, setSourcesOptions] = useState<{ label: string, value: string }[]>([])
    const [rolesOptions, setRolesOptions] = useState<{ label: string, value: string }[]>([])
    const [selectedRoles, setSelectedRoles] = useState<string[]>(user?.roles?.map(role => role.id) ?? [])

    useEffect(() => {
        setSourcesOptions(sources.map(source => ({ label: source.name ? source.name : source.code, value: source.code })))
    }, [sources])

    useEffect(() => {
        setRolesOptions(roles.map(role => ({ label: role.id, value: role.id })))
    }, [roles])

    const handleSubmit = () => {
        apiService.saveUser({
            id: _user?.id,
            name,
            email,
            sources: selectedSources,
            roles: selectedRoles,
            apiKey: _user?.apiKey ?? ""
        }).then((modifiedUser) => {
            toast({ title: 'User saved' })
            const shouldActivate = !_user
            _setUser(prev => ({ ...modifiedUser, apiKey: prev ? prev.apiKey : "" }))
            if (shouldActivate) {
                onActiveChange(true, modifiedUser)
            }
            refDialogTrigger.current?.click()
        }).catch((e) => {
            toast({ title: `Failed to save user: ${e.message}`, variant: 'destructive' })
        })
    }

    const handleDelete = () => {
        if (!_user) {
            return
        } else if (loggedUser?.id === _user.id) {
            toast({ title: 'You cannot delete yourself', variant: 'destructive' })
            return
        }

        toast({
            title: "Confirm deletion",
            action: <ToastAction altText="Try again" onClick={() => {
                apiService.deleteUser(_user.id)
                    .then(() => {
                        toast({ title: 'User deleted' })
                        onUserChanged(_user, true)
                        refDialogTrigger.current?.click()
                    })
                    .catch((e) => {
                        toast({ title: `Failed to delete user: ${e.message}`, variant: 'destructive' })
                    })
            }}>Confirm</ToastAction>,
        })
    }

    const onActiveChange = (isActive: boolean, scopedUser?: User) => {
        if (!scopedUser) {
            scopedUser = _user
        }

        if (loggedUser?.id === scopedUser?.id && !isActive) {
            toast({ title: 'You cannot deactivate yourself', variant: 'destructive' })
            return
        }

        if (scopedUser) {
            if (isActive) {
                apiService.putApikey(scopedUser.id)
                    .then((apikey) => {
                        toast({ title: 'User activated' })
                        _setUser({ ...scopedUser, apiKey: apikey })
                    })
                    .catch((e) => {
                        toast({ title: `Failed to activate user: ${e.message}`, variant: 'destructive' })
                    })
            } else {
                apiService.deleteApikey(scopedUser.id)
                    .then(() => {
                        toast({ title: 'User deactivated' })
                        _setUser({ ...scopedUser, apiKey: "" })
                    })
                    .catch((e) => {
                        toast({ title: `Failed to deactivate user: ${e.message}`, variant: 'destructive' })
                    })
            }
        }
    }

    useEffect(() => {
        _setUser(user)
    }, [user])

    useEffect(() => {
        setName(_user?.name ?? '')
        setEmail(_user?.email ?? '')
        setSelectedRoles(_user?.roles?.map(role => role.id) ?? [])
        setSelectedSources(_user === undefined
            ? sources.map(source => source.code)
            : _user.sources?.map(source => source.code) ?? [])
        if (_user) {
            onUserChanged(_user)

            if (refDialogTrigger.current) {
                refDialogTrigger.current.click()
            }
        }
    }, [_user, sources])

    return (
        <Dialog>
            <DialogTrigger asChild ref={refDialogTrigger}>
                <div></div>
            </DialogTrigger>
            <Button variant="outline" onClick={e => {
                e.preventDefault()
                _setUser(undefined)
                refDialogTrigger.current?.click()
            }}>New</Button>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>
                        {
                            _user ? 'Edit user' : 'Create new user'
                        }
                    </DialogTitle>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={name} className="col-span-3" onChange={e => setName(e.target.value)} />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input id="email" value={email} className="col-span-3" onChange={e => setEmail(e.target.value)} />
                    </div>
                    <div className="flex justify-center">
                        <SelectDropdown title="Sources" options={sourcesOptions} values={selectedSources} onValuesChange={setSelectedSources} />
                    </div>
                    <div className="flex justify-center">
                        <SelectDropdown disabled={_user?.id === loggedUser?.id} title="Roles" options={rolesOptions} values={selectedRoles} onValuesChange={setSelectedRoles} />
                    </div>
                </div>
                <DialogFooter>
                    {_user &&
                        <div className="flex items-center space-x-2 flex-1">
                            <Switch id="active" checked={!!_user?.apiKey} onCheckedChange={onActiveChange} />
                            <Label htmlFor="active">Active</Label>
                        </div>
                    }
                    {_user &&
                        <Button type="submit" variant={"destructive"} onClick={handleDelete}>Delete</Button>
                    }
                    <Button type="submit" onClick={handleSubmit}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}