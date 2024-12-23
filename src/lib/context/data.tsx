import { useServiceContext } from "@/lib/context/service"
import { useToast } from "@newsware/ui"
import { ToastAction } from "@radix-ui/react-toast"
import { Api, Code, CodeType, SourceDetails } from "newsware"
import { PropsWithChildren, createContext, useEffect, useState } from "react"
import { Environment } from "../environment/environment"
import { Role } from "../models/user"

interface IDataContext {
  selectedGroupCode?: Code
  setSelectedGroupCode: (categoryCode?: Code) => void
  editChildCode: (categoryCode: Code, remove: boolean) => void
  sourceCodes: Code[][]
  onCategoryCodeChanged: (categoryCode: Code, isDelete?: boolean) => void
  setSelectedCode: (categoryCode?: Code) => void
  selectedCategoryCode: Code | undefined
  sources: SourceDetails[]
  roles: Role[]
}

export const DataContext = createContext<IDataContext>({
  setSelectedGroupCode: () => {},
  editChildCode: () => {},
  sourceCodes: [],
  onCategoryCodeChanged: () => {},
  setSelectedCode: () => {},
  selectedCategoryCode: undefined,
  sources: [],
  roles: [],
})

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [selectedGroupCode, _setSelectedGroupCode] = useState<Code | undefined>(
    undefined
  )
  const [selectedCode, setSelectedCode] = useState<Code | undefined>(undefined)
  const { toast } = useToast()
  const { apiService } = useServiceContext()
  const [sources, setSources] = useState<SourceDetails[]>([])
  const [sourceCodes, setSourceCodes] = useState<Code[][]>([])
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    apiService.getRoles().then(setRoles)
    Api.getSources(Environment.apiEndpointDescription).then(setSources)
  }, [])

  useEffect(() => {
    ;(async () => {
      const sourceCodes = []
      for (const source of sources) {
        sourceCodes.push(
          await Api.getCodes(
            source.code,
            CodeType.CATEGORY,
            Environment.apiEndpointDescription
          )
        )
      }

      const groupCodes = await Api.getCodes(
        "",
        CodeType.GROUP,
        Environment.apiEndpointDescription
      )

      setSourceCodes([groupCodes, ...sourceCodes])
    })()
  }, [sources])

  const setSelectedGroupCode = (categoryCode?: Code) => {
    _setSelectedGroupCode(categoryCode)
    if (categoryCode) {
      toast({
        title: "Editing group " + categoryCode.code,
        action: (
          <ToastAction
            altText="Finish"
            onClick={() => {
              _setSelectedGroupCode(undefined)
            }}
          >
            Finish
          </ToastAction>
        ),
        duration: 1000 * 1000,
      })
    }
  }

  const onCategoryCodeChanged = (categoryCode: Code, isDelete?: boolean) => {
    const newSourceCodes = [...sourceCodes]

    const sourceIndex = newSourceCodes.findIndex(
      (s) => s[0].source === categoryCode.source
    )

    if (isDelete) {
      newSourceCodes[sourceIndex].filter((c) => c.code !== categoryCode.code)
      return newSourceCodes
    }

    const categoryCodeIndex = newSourceCodes[sourceIndex].findIndex(
      (c) => c.code === categoryCode.code
    )
    if (categoryCodeIndex === -1) {
      newSourceCodes[sourceIndex] = [
        categoryCode,
        ...newSourceCodes[sourceIndex],
      ]
    } else {
      newSourceCodes[sourceIndex] = newSourceCodes[sourceIndex].map((c, i) =>
        i === categoryCodeIndex ? categoryCode : c
      )
    }

    setSourceCodes(newSourceCodes)
  }

  const editChildCode = (categoryCode: Code, remove: boolean) => {
    if (remove) {
      apiService
        .deleteCodeFromCategoryGroup({
          parentCode: selectedGroupCode!.code,
          child: categoryCode,
        })
        .then(() => {
          toast({
            title:
              "Removed " +
              categoryCode.code +
              " from group " +
              selectedGroupCode!.code,
          })
          const newCode = {
            ...selectedGroupCode!!,
            children: selectedGroupCode!.children.filter(
              (child) => child.code !== categoryCode.code
            ),
          }
          setSelectedGroupCode(newCode)
          onCategoryCodeChanged(newCode)
        })
        .catch((e) => {
          toast({
            title:
              "Failed to remove " +
              categoryCode.code +
              " from group " +
              selectedGroupCode!.code +
              ": " +
              e.message,
          })
        })
    } else {
      apiService
        .addCodeToCategoryGroup({
          parentCode: selectedGroupCode!.code,
          child: categoryCode,
        })
        .then(() => {
          toast({
            title:
              "Added " +
              categoryCode.code +
              " to group " +
              selectedGroupCode!.code,
          })
          const newCode = {
            ...selectedGroupCode!!,
            children: [...selectedGroupCode!.children, categoryCode],
          }
          setSelectedGroupCode(newCode)
          onCategoryCodeChanged(newCode)
        })
        .catch((e) => {
          toast({
            title:
              "Failed to add " +
              categoryCode.code +
              " to group " +
              selectedGroupCode!.code +
              ": " +
              e.message,
          })
        })
    }
  }

  return (
    <DataContext.Provider
      value={{
        selectedGroupCode,
        setSelectedGroupCode,
        editChildCode,
        onCategoryCodeChanged,
        sourceCodes,
        selectedCategoryCode: selectedCode,
        setSelectedCode: setSelectedCode,
        sources,
        roles,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
