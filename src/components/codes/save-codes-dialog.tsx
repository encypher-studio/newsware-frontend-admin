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
import { useContext, useEffect, useRef, useState } from "react"
import { DataContext } from "../../lib/context/data"

export function SaveCategoryCodeDialog() {
  const { selectedCategoryCode, onCategoryCodeChanged } =
    useContext(DataContext)
  const [code, setCode] = useState(selectedCategoryCode?.code ?? "")
  const [description, setDescription] = useState(
    selectedCategoryCode?.description ?? ""
  )
  const [_categoryCode, _setCategoryCode] = useState(selectedCategoryCode)
  const refDialogTrigger = useRef<HTMLButtonElement>(null)
  const { toast } = useToast()
  const { apiService } = useServiceContext()

  useEffect(() => {
    _setCategoryCode(selectedCategoryCode)
  }, [selectedCategoryCode])

  useEffect(() => {
    setCode(_categoryCode?.code ?? "")
    setDescription(_categoryCode?.description ?? "")
    if (_categoryCode) {
      onCategoryCodeChanged(_categoryCode)

      if (refDialogTrigger.current) {
        refDialogTrigger.current.click()
      }
    }
  }, [_categoryCode])

  const handleSubmit = () => {
    if (!selectedCategoryCode) {
      apiService
        .createCategoryGroup({
          code: code,
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
        description: description,
      })
      .then(() => {
        toast({ title: "Category code saved" })
        _setCategoryCode((prev) => ({ ...prev!!, code, description }))
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
          _setCategoryCode(undefined)
          refDialogTrigger.current?.click()
        }}
      >
        New
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {_categoryCode ? "Edit category code" : "Create category code"}
          </DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input
              disabled={!!selectedCategoryCode}
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
          {_categoryCode && (
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
