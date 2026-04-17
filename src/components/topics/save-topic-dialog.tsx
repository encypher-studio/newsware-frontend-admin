import { useServiceContext } from "@/lib/context/service"
import { Topic } from "@/lib/models/topic"
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
  Textarea
} from "@newsware/ui"
import { toast } from "sonner"
import { useEffect, useRef, useState } from "react"

interface IProps {
  topic?: Topic
  onTopicChanged: (topic: Topic, isDelete?: boolean) => void
}

export function SaveTopicDialog({ topic, onTopicChanged }: IProps) {
  const refDialogTrigger = useRef<HTMLButtonElement>(null)
  const { apiService } = useServiceContext()
  const [_topic, _setTopic] = useState(topic)
  const [code, setCode] = useState(topic?.code ?? "")
  const [description, setDescription] = useState(topic?.description ?? "")
  const [filter, setFilter] = useState(topic?.filter ?? "")

  useEffect(() => {
    _setTopic(topic)
  }, [topic])

  useEffect(() => {
    setCode(_topic?.code ?? "")
    setDescription(_topic?.description ?? "")
    setFilter(_topic?.filter ?? "")
    if (_topic) {
      onTopicChanged(_topic)
      if (refDialogTrigger.current) {
        refDialogTrigger.current.click()
      }
    }
  }, [_topic])

  const handleSubmit = () => {
    apiService
      .putTopic({ id: _topic?.id, code, description, filter })
      .then((savedTopic) => {
        toast.success("Topic saved")
        onTopicChanged(savedTopic)
        refDialogTrigger.current?.click()
      })
      .catch((e) => {
        toast.error(`Failed to save topic: ${e.message}`)
      })
  }

  const handleDelete = () => {
    if (!_topic) return

    toast("Confirm deletion", {
      action: {
        label: "Confirm",
        onClick: () => {
          apiService
            .deleteTopic(_topic.id)
            .then(() => {
              toast.success("Topic deleted")
              onTopicChanged(_topic, true)
              refDialogTrigger.current?.click()
            })
            .catch((e) => {
              toast.error(`Failed to delete topic: ${e.message}`)
            })
        }
      }
    })
  }

  return (
    <Dialog>
      <DialogTrigger asChild ref={refDialogTrigger}>
        <div></div>
      </DialogTrigger>
      <Button
        variant="outline"
        onClick={(e) => {
          e.preventDefault()
          _setTopic(undefined)
          setCode("")
          setDescription("")
          setFilter("")
          refDialogTrigger.current?.click()
        }}
      >
        New
      </Button>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{_topic ? "Edit topic" : "Create new topic"}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="code" className="text-right">
              Code
            </Label>
            <Input
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
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="filter" className="text-right pt-2">
              Filter
            </Label>
            <Textarea
              id="filter"
              value={filter}
              className="col-span-3"
              rows={6}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>
        <DialogFooter>
          {_topic && (
            <Button type="submit" variant="destructive" onClick={handleDelete}>
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
