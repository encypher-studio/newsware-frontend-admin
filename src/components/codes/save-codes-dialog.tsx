import { useServiceContext } from "@/lib/context/service"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  Input,
  Label,
  useToast,
} from "@newsware/ui"
import { CodeType } from "newsware"
import { useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../../lib/context/data"

export function SaveCodeDialog() {
  const { selectedCode, onCodeChanged: onCategoryCodeChanged } =
    useContext(DataContext)
  const [code, setCode] = useState(selectedCode?.code ?? "")
  const [description, setDescription] = useState(
    selectedCode?.description ?? ""
  )
  const [_code, _setCode] = useState(selectedCode)
  const refDialogTrigger = useRef<HTMLButtonElement>(null)
  const { toast } = useToast()
  const { apiService } = useServiceContext()

  useEffect(() => {
    _setCode(selectedCode)
  }, [selectedCode])

  useEffect(() => {
    setCode(_code?.code ?? "")
    setDescription(_code?.description ?? "")
    if (_code) {
      onCategoryCodeChanged(_code)

      if (refDialogTrigger.current) {
        refDialogTrigger.current.click()
      }
    }
  }, [_code])

  const handleSubmit = () => {
    if (!selectedCode) {
      apiService
        .createCategoryGroup({
          code: code,
          type: CodeType.GROUP,
          description: description,
        })
        .then(() => {
          toast({ title: "Category code created" })
          setCode("")
          setDescription("")
        })
        .catch((e) => {
          toast({
            title: `Failed to create category code: ${e.message}`,
            variant: "destructive",
          })
        })
      return
    }

    apiService
      .putCategoryCode({
        code: code,
        type: _code!!.type,
        description: description,
      })
      .then(() => {
        toast({ title: "Category code saved" })
        _setCode((prev) => ({ ...prev!!, code, description }))
      })
      .catch((e) => {
        toast({
          title: `Failed to save user: ${e.message}`,
          variant: "destructive",
        })
      })
  }

  const handleDelete = () => {}

  return (
    <Dialog>
      <DialogTrigger asChild ref={refDialogTrigger}>
        <div></div>
      </DialogTrigger>
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          _setCode(undefined)
          refDialogTrigger.current?.click()
        }}
      >
        New
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {_code ? "Edit category code" : "Create category code"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input
              disabled={!!selectedCode}
              id="code"
              value={code}
              className="col-span-3"
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Input
              id="description"
              value={description}
              className="col-span-3"
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          {_code && (
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
