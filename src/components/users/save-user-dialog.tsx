import { useServiceContext } from "@/lib/context/service"
import { User } from "@/lib/models/user"
import { SelectDropdown } from "@/lib/select-dropdown/select-dropdown"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Dropdown,
  Input,
  Label,
  SelectOption,
  Switch,
  useAuthContext
} from "@newsware/ui"
import { toast } from "sonner"
import { useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../../lib/context/data"

interface IProps {
  user?: User
  onUserChanged: (user: User, isDelete?: boolean) => void
}

export function SaveUserDialog({ user, onUserChanged }: IProps) {
  const refDialogTrigger = useRef<HTMLButtonElement>(null)
  const { user: loggedUser } = useAuthContext()
  const { apiService } = useServiceContext()
  const { sources, roles, plans } = useContext(DataContext)
  const [sourcesOptions, setSourcesOptions] = useState<
    { label: string; value: string }[]
  >([])
  const [rolesOptions, setRolesOptions] = useState<
    { label: string; value: string }[]
  >([])
  const [plansOptions, setPlansOptions] = useState<SelectOption<number>[]>([])
  const [name, setName] = useState(user?.name ?? "")
  const [email, setEmail] = useState(user?.email ?? "")
  const [_user, _setUser] = useState(user)
  const [selectedSources, setSelectedSources] = useState<string[]>(
    user?.sources?.map((source) => source.code) ?? []
  )
  const [selectedRoles, setSelectedRoles] = useState<string[]>(
    user?.roles?.map((role) => role.id) ?? []
  )
  const [selectedPlanId, setSelectedPlanId] = useState<number | undefined>(
    user?.planId
  )
  const [active, setActive] = useState(user?.active ?? true)

  useEffect(() => {
    setSourcesOptions(
      sources.map((source) => ({
        label: source.name ? source.name : source.code,
        value: source.code
      }))
    )
  }, [sources])

  useEffect(() => {
    setRolesOptions(roles.map((role) => ({ label: role.id, value: role.id })))
  }, [roles])

  useEffect(() => {
    setPlansOptions(
      plans.map((plan) => ({
        label: `${plan.name.charAt(0).toUpperCase() + plan.name.slice(1)} (${plan.historyMonths} month history)`,
        value: String(plan.id),
        data: plan.id
      }))
    )
  }, [plans])

  const handleSubmit = () => {
    apiService
      .saveUser({
        id: _user?.id,
        name,
        email,
        sources: selectedSources,
        roles: selectedRoles,
        apiKey: _user?.apiKey ?? "",
        active,
        planId: selectedPlanId
      })
      .then((modifiedUser) => {
        toast.success("User saved")
        _setUser(modifiedUser)
        refDialogTrigger.current?.click()
      })
      .catch((e) => {
        toast.error(`Failed to save user: ${e.message}`)
      })
  }

  const handleDelete = () => {
    if (!_user) {
      return
    } else if (loggedUser?.id === _user.id) {
      toast.error("You cannot delete yourself")
      return
    }

    toast("Confirm deletion", {
      action: {
        label: "Confirm",
        onClick: () => {
          apiService
            .deleteUser(_user.id)
            .then(() => {
              toast.success("User deleted")
              onUserChanged(_user, true)
              refDialogTrigger.current?.click()
            })
            .catch((e) => {
              toast.error(`Failed to delete user: ${e.message}`)
            })
        }
      }
    })
  }

  useEffect(() => {
    _setUser(user)
  }, [user])

  useEffect(() => {
    setName(_user?.name ?? "")
    setEmail(_user?.email ?? "")
    setSelectedRoles(_user?.roles?.map((role) => role.id) ?? [])
    setSelectedSources(
      _user === undefined
        ? sources.map((source) => source.code)
        : (_user.sources?.map((source) => source.code) ?? [])
    )
    setSelectedPlanId(_user?.planId ?? plans[0]?.id)
    setActive(_user?.active ?? true)
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
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          _setUser(undefined)
          refDialogTrigger.current?.click()
        }}
      >
        New
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{_user ? "Edit user" : "Create new user"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              className="col-span-3"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="email" className="text-right">
              Email
            </Label>
            <Input
              id="email"
              value={email}
              className="col-span-3"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex justify-center">
            <SelectDropdown
              title="Sources"
              options={sourcesOptions}
              values={selectedSources}
              onValuesChange={setSelectedSources}
            />
          </div>
          <div className="flex justify-center">
            <SelectDropdown
              disabled={_user?.id === loggedUser?.id}
              title="Roles"
              options={rolesOptions}
              values={selectedRoles}
              onValuesChange={setSelectedRoles}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label className="text-right">Plan</Label>
            <div className="col-span-3">
              <Dropdown
                items={plansOptions}
                value={selectedPlanId !== undefined ? String(selectedPlanId) : ""}
                onChange={(option) => setSelectedPlanId(option.data)}
              />
            </div>
          </div>
          {_user && (
            <div className="flex justify-center">
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
              />
              <Label htmlFor="active" className="flex items-center ml-1">
                Active
              </Label>
            </div>
          )}
        </div>
        <DialogFooter>
          {_user && (
            <Button
              type="submit"
              variant={"destructive"}
              onClick={handleDelete}
            >
              Delete
            </Button>
          )}
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
