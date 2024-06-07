import { LoadingSpinner } from "@/lib/spinner/spinner";
import { useContext } from "react";
import Section from "../section/section";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { CategoryCodesContext, CategoryCodesProvider } from "./category-codes-context";
import { CategoryCodesTable } from "./category-codes-table";
import { SaveCategoryCodeDialog } from "./save-category-code-dialog";

export function CategoryCodes() {
    return (
        <CategoryCodesProvider>
            <_categoryCodes />
        </CategoryCodesProvider>
    )
}

const _categoryCodes = () => {
    const { sourceCodes } = useContext(CategoryCodesContext)

    if (sourceCodes.length > 0) {
        return <Section title="Category Codes">
            <h3> Curated codes</h3>
            {
                sourceCodes[0].length > 0 && <CategoryCodesTable
                    categoryCodes={sourceCodes[0]}
                    headerOptions={
                        <SaveCategoryCodeDialog />
                    }
                />
            }
            <Accordion className="mt-6" type="single" collapsible>
                {sourceCodes.map((categoryCodes, i) => {
                    if (i === 0) return null
                    return (
                        <AccordionItem key={categoryCodes[0].source} value={categoryCodes[0].source}>
                            <AccordionTrigger>{categoryCodes[0].source}</AccordionTrigger>
                            <AccordionContent>
                                <CategoryCodesTable categoryCodes={categoryCodes} />
                            </AccordionContent>
                        </AccordionItem>
                    )
                })}
            </Accordion>
        </Section>
    }

    return <div className="flex items-center justify-center h-[50vh]">
        <LoadingSpinner size={200} />
    </div>
}