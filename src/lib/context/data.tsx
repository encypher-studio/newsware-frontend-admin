import { useServiceContext } from "@/lib/context/service"
import { toast } from "sonner"
import { Api, Code, CodeType, SourceDetails } from "newsware"
import { createContext, PropsWithChildren, useEffect, useState } from "react"
import { Environment } from "../environment/environment"
import { Plan, Role } from "../models/user"

type sourceCodes = {
  [source: string]: {
    [codeType in CodeType]?: Code[]
  }
}

interface IDataContext {
  selectedGroupCode?: Code
  setSelectedGroupCode: (categoryCode?: Code) => void
  editChildCode: (categoryCode: Code, remove: boolean) => void
  sourceCodes: sourceCodes
  onCodeChanged: (categoryCode: Code, isDelete?: boolean) => void
  setSelectedCode: (categoryCode?: Code) => void
  selectedCode: Code | undefined
  sources: SourceDetails[]
  roles: Role[]
  plans: Plan[]
  ensureCodes: (source: string, codeType: CodeType) => void
}

export const DataContext = createContext<IDataContext>({
  setSelectedGroupCode: () => {},
  editChildCode: () => {},
  sourceCodes: {},
  onCodeChanged: () => {},
  setSelectedCode: () => {},
  selectedCode: undefined,
  sources: [],
  roles: [],
  plans: [],
  ensureCodes: () => {}
})

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [selectedGroupCode, _setSelectedGroupCode] = useState<Code | undefined>(
    undefined
  )
  const [selectedCode, setSelectedCode] = useState<Code | undefined>(undefined)
  const { apiService } = useServiceContext()
  const [sources, setSources] = useState<SourceDetails[]>([])
  const [sourceCodes, setSourceCodes] = useState<sourceCodes>({})
  const [roles, setRoles] = useState<Role[]>([])
  const [plans, setPlans] = useState<Plan[]>([])

  useEffect(() => {
    apiService.getRoles().then(setRoles)
    apiService.getPlans().then(setPlans)
    Api.getSources(Environment.apiEndpointDescription).then(setSources)
  }, [])

  useEffect(() => {
    ;(async () => {
      let sourceCodes: sourceCodes = {}
      for (const source of sources) {
        sourceCodes = {
          ...sourceCodes,
          [source.code]: {}
        }
      }

      const groupCodes = await Api.getCodes(
        "",
        CodeType.GROUP,
        Environment.apiEndpointDescription
      )

      setSourceCodes({
        ...sourceCodes,
        group: {
          [CodeType.GROUP]: groupCodes
        }
      })
    })()
  }, [sources])

  const ensureCodes = async (source: string, codeType: CodeType) => {
    if (sourceCodes[source]?.[codeType] === undefined) {
      const codes = await Api.getCodes(
        source,
        codeType,
        Environment.apiEndpointDescription
      )
      setSourceCodes({
        ...sourceCodes,
        [source]: {
          ...sourceCodes[source],
          [codeType]: codes
        }
      })
    }
  }

  const setSelectedGroupCode = (categoryCode?: Code) => {
    _setSelectedGroupCode(categoryCode)
    if (categoryCode) {
      toast("Editing group " + categoryCode.code, {
        action: {
          label: "Finish",
          onClick: () => {
            _setSelectedGroupCode(undefined)
          },
        },
        duration: 1000 * 1000,
      })
    }
  }

  const onCodeChanged = (code: Code, isDelete?: boolean) => {
    code.source = code.source ? code.source : "group"
    const newSourceCodes = { ...sourceCodes }

    if (newSourceCodes[code.source]?.[code.type] === undefined) {
      return
    }

    if (isDelete) {
      newSourceCodes[code.source][code.type]!!.filter(
        (c) => c.code !== code.code
      )
    } else {
      const codeIndex = newSourceCodes[code.source][code.type]!!.findIndex(
        (c) => {
          console.log(c)
          return c.code === code.code
        }
      )
      if (codeIndex === -1) {
        newSourceCodes[code.source][code.type] = [
          code,
          ...newSourceCodes[code.source][code.type]!!
        ]
      } else {
        newSourceCodes[code.source][code.type] = newSourceCodes[code.source][
          code.type
        ]!!.map((c, i) => (i === codeIndex ? code : c))
      }
    }

    setSourceCodes(newSourceCodes)
  }

  const editChildCode = (categoryCode: Code, remove: boolean) => {
    if (remove) {
      apiService
        .deleteCodeFromCategoryGroup({
          parentCode: selectedGroupCode!.code,
          child: categoryCode
        })
        .then(() => {
          toast.success("Removed " + categoryCode.code + " from group " + selectedGroupCode!.code)
          const newCode = {
            ...selectedGroupCode!!,
            children: selectedGroupCode!.children.filter(
              (child) => child.code !== categoryCode.code
            )
          }
          setSelectedGroupCode(newCode)
          onCodeChanged(newCode)
        })
        .catch((e) => {
          toast.error("Failed to remove " + categoryCode.code + " from group " + selectedGroupCode!.code + ": " + e.message)
        })
    } else {
      apiService
        .addCodeToCategoryGroup({
          parentCode: selectedGroupCode!.code,
          child: categoryCode
        })
        .then(() => {
          toast.success("Added " + categoryCode.code + " to group " + selectedGroupCode!.code)
          const newCode = {
            ...selectedGroupCode!!,
            children: [...selectedGroupCode!.children, categoryCode]
          }
          setSelectedGroupCode(newCode)
          onCodeChanged(newCode)
        })
        .catch((e) => {
          toast.error("Failed to add " + categoryCode.code + " to group " + selectedGroupCode!.code + ": " + e.message)
        })
    }
  }

  return (
    <DataContext.Provider
      value={{
        selectedGroupCode,
        setSelectedGroupCode,
        editChildCode,
        onCodeChanged,
        sourceCodes,
        selectedCode: selectedCode,
        setSelectedCode: setSelectedCode,
        sources,
        roles,
        plans,
        ensureCodes
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
