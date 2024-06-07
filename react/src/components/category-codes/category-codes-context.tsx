import { CategoryCode, SourceDetails } from "newsware";
import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react";
import { useToast } from "../ui/use-toast";
import { ToastAction } from "@radix-ui/react-toast";
import { ServiceContext } from "@/lib/context/service";

interface ICategoryCodesContext {
    selectedGroupCode?: CategoryCode
    setSelectedGroupCode: (categoryCode?: CategoryCode) => void
    editChildCode: (categoryCode: CategoryCode, remove: boolean) => void
    sourceCodes: CategoryCode[][]
    onCategoryCodeChanged: (categoryCode: CategoryCode, isDelete?: boolean) => void
    setSelectedCategoryCode: (categoryCode?: CategoryCode) => void
    selectedCategoryCode: CategoryCode | undefined
}

export const CategoryCodesContext = createContext<ICategoryCodesContext>({
    setSelectedGroupCode: () => { },
    editChildCode: () => { },
    sourceCodes: [],
    onCategoryCodeChanged: () => { },
    setSelectedCategoryCode: () => { },
    selectedCategoryCode: undefined
})

export const CategoryCodesProvider = ({ children }: PropsWithChildren) => {
    const [selectedGroupCode, _setSelectedGroupCode] = useState<CategoryCode | undefined>(undefined)
    const [selectedCategoryCode, setSelectedCategoryCode] = useState<CategoryCode | undefined>(undefined)
    const { toast } = useToast()
    const { apiService } = useContext(ServiceContext)
    const [sourceCodes, setSourceCodes] = useState<CategoryCode[][]>([])

    useEffect(() => {
        apiService.api.getSources().then(async (sources: SourceDetails[]) => {
            const sourceCodes = []
            for (const source of sources) {
                sourceCodes.push(await apiService.api.getCategoryCodes(source.code))
            }

            const groupCodes = await apiService.api.getCategoryCodes("group")

            setSourceCodes([groupCodes, ...sourceCodes.filter(categoryCodes => categoryCodes.length > 0)])
        })
    }, [])

    useEffect(() => {
        console.log("ASD<MPSAD", sourceCodes)
    }, [sourceCodes])

    const setSelectedGroupCode = (categoryCode?: CategoryCode) => {
        _setSelectedGroupCode(categoryCode)
        if (categoryCode) {
            toast({
                title: "Editing group " + categoryCode.code,
                action: <ToastAction altText="Finish" onClick={() => {
                    _setSelectedGroupCode(undefined)
                }}>
                    Finish
                </ToastAction>,
                duration: 1000 * 1000
            })
        }
    }

    const onCategoryCodeChanged = (categoryCode: CategoryCode, isDelete?: boolean) => {
        const newSourceCodes = [...sourceCodes]

        const sourceIndex = newSourceCodes.findIndex((s) => s[0].source === categoryCode.source)

        if (isDelete) {
            newSourceCodes[sourceIndex].filter((c) => c.code !== categoryCode.code)
            return newSourceCodes
        }

        const categoryCodeIndex = newSourceCodes[sourceIndex].findIndex((c) => c.code === categoryCode.code)
        if (categoryCodeIndex === -1) {
            newSourceCodes[sourceIndex] = [categoryCode, ...newSourceCodes[sourceIndex]]
        } else {
            newSourceCodes[sourceIndex] = newSourceCodes[sourceIndex].map((c, i) => i === categoryCodeIndex ? categoryCode : c)
        }

        setSourceCodes(newSourceCodes)
    }

    const editChildCode = (categoryCode: CategoryCode, remove: boolean) => {
        if (remove) {
            apiService.deleteCodeFromCategoryGroup({
                parentCode: selectedGroupCode!.code,
                child: categoryCode
            })
                .then(() => {
                    toast({
                        title: "Removed " + categoryCode.code + " from group " + selectedGroupCode!.code,
                    })
                    const newCode = { ...selectedGroupCode!!, children: selectedGroupCode!.children.filter((child) => child.code !== categoryCode.code) }
                    setSelectedGroupCode(newCode)
                    onCategoryCodeChanged(newCode)
                })
                .catch((e) => {
                    toast({
                        title: "Failed to remove " + categoryCode.code + " from group " + selectedGroupCode!.code + ": " + e.message,
                    })
                })
        } else {
            apiService.addCodeToCategoryGroup({
                parentCode: selectedGroupCode!.code,
                child: categoryCode
            })
                .then(() => {
                    toast({
                        title: "Added " + categoryCode.code + " to group " + selectedGroupCode!.code,
                    })
                    const newCode = { ...selectedGroupCode!!, children: [...selectedGroupCode!.children, categoryCode] }
                    setSelectedGroupCode(newCode)
                    onCategoryCodeChanged(newCode)
                })
                .catch((e) => {
                    toast({
                        title: "Failed to add " + categoryCode.code + " to group " + selectedGroupCode!.code + ": " + e.message,
                    })
                })
        }
    }

    return (
        <CategoryCodesContext.Provider value={{
            selectedGroupCode,
            setSelectedGroupCode,
            editChildCode,
            onCategoryCodeChanged,
            sourceCodes,
            selectedCategoryCode,
            setSelectedCategoryCode
        }}>
            {children}
        </CategoryCodesContext.Provider>
    )
}