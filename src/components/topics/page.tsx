import { useServiceContext } from "@/lib/context/service"
import { Topic } from "@/lib/models/topic"
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
import { DotsHorizontalIcon } from "@radix-ui/react-icons"
import { toast } from "sonner"
import { useEffect, useMemo, useState } from "react"
import Section from "../section/section"
import { SaveTopicDialog } from "./save-topic-dialog"

export function Topics() {
  const [topics, setTopics] = useState<Topic[]>([])
  const [selectedTopic, setSelectedTopic] = useState<Topic | undefined>(undefined)
  const { apiService } = useServiceContext()

  const topicColumns = useMemo<ColumnDef<Topic>[]>(
    () => [
      {
        accessorKey: "id",
        header: "Id"
      },
      {
        accessorKey: "code",
        header: "Code"
      },
      {
        accessorKey: "description",
        header: "Description"
      },
      {
        accessorKey: "filter",
        header: "Filter"
      },
      {
        id: "actions",
        header: "Actions",
        enableHiding: false,
        cell: ({ row }) => {
          const topic = row.original

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
                  onClick={() => setSelectedTopic({ ...topic })}
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

  useEffect(() => {
    apiService
      .getTopics()
      .then(setTopics)
      .catch((e) => toast.error(e.message))
  }, [])

  const onTopicChanged = (topic: Topic, isDelete?: boolean) => {
    setTopics((prev) => {
      if (isDelete) {
        return prev.filter((t) => t.id !== topic.id)
      }
      const index = prev.findIndex((t) => t.id === topic.id)
      if (index === -1) {
        return [topic, ...prev]
      } else {
        const newTopics = [...prev]
        newTopics[index] = topic
        return newTopics
      }
    })
  }

  return (
    <Section title="Topics">
      <DataTable
        columns={topicColumns}
        data={topics}
        headerOptions={
          <SaveTopicDialog topic={selectedTopic} onTopicChanged={onTopicChanged} />
        }
      />
    </Section>
  )
}
