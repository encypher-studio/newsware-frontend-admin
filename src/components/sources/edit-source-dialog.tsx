import { useServiceContext } from "@/lib/context/service"
import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Label,
  useToast,
} from "@newsware/ui"
import { SourceDetails } from "newsware"
import { PropsWithChildren, useEffect, useState } from "react"

interface IProps {
  source: SourceDetails
  onSourceChanged: (source: SourceDetails) => void
}

export function EditSourceDialog({
  source,
  onSourceChanged,
  children,
}: PropsWithChildren<IProps>) {
  const [name, setName] = useState(source?.name ?? "")
  const [description, setDescription] = useState(source?.description ?? "")
  const { toast } = useToast()
  const { apiService } = useServiceContext()
  const [open, setOpen] = useState(false)

  const handleSubmit = () => {
    apiService
      .putSource({
        code: source.code,
        name: name,
        description: description,
      })
      .then(() => {
        toast({ title: "Source updated" })
        onSourceChanged({ ...source, name, description })
        setOpen(false)
      })
      .catch((e) => {
        toast({
          title: `Failed to update source: ${e.message}`,
          variant: "destructive",
        })
      })
  }

  useEffect(() => {
    setName(source?.name ?? "")
    setDescription(source?.description ?? "")
  }, [source])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {children}
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit source</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Code
            </Label>
            <Input
              disabled
              id="name"
              value={source.code}
              className="col-span-3"
            />
          </div>
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
          <Button type="submit" onClick={handleSubmit}>
            Save changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
