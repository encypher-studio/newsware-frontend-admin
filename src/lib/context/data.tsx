import { useServiceContext } from "@/lib/context/service"
import { useToast } from "@newsware/ui"
import { ToastAction } from "@radix-ui/react-toast"
import { Api, Code, CodeType, SourceDetails } from "newsware"
import { PropsWithChildren, createContext, useEffect, useState } from "react"
import { Environment } from "../environment/environment"
import { Role } from "../models/user"

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
  ensureCodes: (source: string, codeType: CodeType) => {},
})

export const DataProvider = ({ children }: PropsWithChildren) => {
  const [selectedGroupCode, _setSelectedGroupCode] = useState<Code | undefined>(
    undefined
  )
  const [selectedCode, setSelectedCode] = useState<Code | undefined>(undefined)
  const { toast } = useToast()
  const { apiService } = useServiceContext()
  const [sources, setSources] = useState<SourceDetails[]>([])
  const [sourceCodes, setSourceCodes] = useState<sourceCodes>({})
  const [roles, setRoles] = useState<Role[]>([])

  useEffect(() => {
    apiService.getRoles().then(setRoles)
    Api.getSources(Environment.apiEndpointDescription).then(setSources)
  }, [])

  useEffect(() => {
    ;(async () => {
      let sourceCodes: sourceCodes = {}
      for (const source of sources) {
        sourceCodes = {
          ...sourceCodes,
          [source.code]: {},
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
          [CodeType.GROUP]: groupCodes,
        },
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
          [codeType]: codes,
        },
      })
    }
  }

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
          ...newSourceCodes[code.source][code.type]!!,
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
          onCodeChanged(newCode)
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
          onCodeChanged(newCode)
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
        onCodeChanged,
        sourceCodes,
        selectedCode: selectedCode,
        setSelectedCode: setSelectedCode,
        sources,
        roles,
        ensureCodes,
      }}
    >
      {children}
    </DataContext.Provider>
  )
}
