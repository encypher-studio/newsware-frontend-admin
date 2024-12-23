import { LoadingSpinner } from "@/lib/spinner/spinner"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Label,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
  Separator,
} from "@newsware/ui"
import { CodeType } from "newsware"
import { useContext, useEffect, useState } from "react"
import { DataContext } from "../../lib/context/data"
import Section from "../section/section"
import { CodesTable } from "./codes-table"
import { SaveCodeDialog } from "./save-codes-dialog"

export function Codes() {
  const { sourceCodes, sources, ensureCodes } = useContext(DataContext)
  const [selectedSource, setSelectedSource] = useState<string>("dj")
  const [selectedType, setSelectedType] = useState<CodeType>()

  useEffect(() => {
    if (selectedSource && selectedType) {
      ensureCodes(selectedSource, selectedType)
    }
  }, [selectedSource, selectedType])

  if (Object.keys(sourceCodes).length > 0) {
    return (
      <Section title="Codes">
        <h3> Curated codes</h3>
        {sourceCodes["group"]?.group !== undefined && (
          <CodesTable
            codes={sourceCodes["group"].group}
            headerOptions={<SaveCodeDialog />}
          />
        )}
        <Separator className="mt-6 mb-3" />
        <Label className="mb-2">Select a source</Label>
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
        {selectedSource && (
          <Accordion
            type="single"
            collapsible
            onValueChange={(v) => setSelectedType(v as CodeType)}
            value={selectedType}
          >
            {[CodeType.CATEGORY, CodeType.INDUSTRY, CodeType.REGION].map(
              (typ) => (
                <AccordionItem key={typ} value={typ}>
                  <AccordionTrigger>{typ}</AccordionTrigger>
                  <AccordionContent>
                    <CodesTable
                      codes={sourceCodes[selectedSource]?.[typ] ?? []}
                    />
                  </AccordionContent>
                </AccordionItem>
              )
            )}
          </Accordion>
        )}
      </Section>
    )
  }

  return (
    <div className="flex items-center justify-center h-[50vh]">
      <LoadingSpinner size={200} />
    </div>
  )
}
