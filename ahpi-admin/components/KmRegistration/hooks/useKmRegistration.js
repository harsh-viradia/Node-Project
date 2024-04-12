/* eslint-disable no-unused-vars */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"

const useKmRegistration = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [applicantsList, setApplicantsList] = useState([])
  const [ignore, setIgnore] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const isAllow = (key) => hasAccessTo(permission, MODULES.FILEHISTORY, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    mount: isAllow(MODULE_ACTIONS.GETALL),
    module: "file-history",
    fixedQuery: {
      searchColumns: ["name"],
      search: searchValue,
    },
  })

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
    })
  }

  const getApplicantsList = async () => {
    try {
      setLoading2(true)
      await commonApi({
        action: "getFileHistory",
        parameters: [ignore?.id],
      }).then(async ([, { data = {} }]) => {
        switch (ignore.title) {
          case "Total Applicant": {
            setApplicantsList(data.totalUsers)
            break
          }
          case "New Applicant": {
            setApplicantsList(data.newUsers)
            break
          }
          case "Ignore Applicant": {
            setApplicantsList(data.ignoreUsers)
            break
          }
          default: {
            setApplicantsList(data.updatedUsers)
          }
        }
        return false
      })
    } finally {
      setLoading2(false)
    }
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
      })
    }
  }, [searchValue])

  useEffect(() => {
    if (ignore?.id) {
      getApplicantsList()
    }
  }, [ignore?.id])

  return {
    ...paginate,
    loading,
    list,
    getList,
    onPaginationChange,
    setSearchValue,
    applicantsList,
    setApplicantsList,
    ignore,
    setIgnore,
    loading2,
    isAllow,
  }
}

export default useKmRegistration
