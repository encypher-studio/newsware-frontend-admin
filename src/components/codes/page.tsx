import { LoadingSpinner } from "@/lib/spinner/spinner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@newsware/ui"
import { useContext, useState } from "react"
import { DataContext } from "../../lib/context/data"
import Section from "../section/section"
import { CodesTable } from "./codes-table"
import { SaveCategoryCodeDialog } from "./save-codes-dialog"

export function Codes() {
  const { sourceCodes, sources } = useContext(DataContext)
  const [selectedSource, setSelectedSource] = useState<string>()

  if (sourceCodes.length > 0) {
    return (
      <Section title="Codes">
        <h3> Curated codes</h3>
        {sourceCodes[0].length !== undefined && (
          <CodesTable
            codes={sourceCodes[0]}
            headerOptions={<SaveCategoryCodeDialog />}
          />
        )}
        <Select value={selectedSource} onValueChange={setSelectedSource}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a source" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              <SelectLabel>Sources</SelectLabel>
              {sources.map((source) => (
                <SelectItem key={source.code} value={source.code}>
                  {source.name ? source.name : source.code}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Accordion className="mt-6" type="single" collapsible>
          {sourceCodes.map((codes, i) => {
            if (i === 0 || codes.length == 0) return null
            return (
              <AccordionItem key={codes[0].source} value={codes[0].source}>
                <AccordionTrigger>{codes[0].source}</AccordionTrigger>
                <AccordionContent>
                  <CodesTable codes={codes} />
                </AccordionContent>
              </AccordionItem>
            )
          })}
        </Accordion>
      </Section>
    )
  }

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <LoadingSpinner size={200} />
    </div>
  )
}
