import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import AppContext from "utils/appContext"
import { MODULE_ACTIONS } from "utils/constant"

const useSection = ({ setOpen, reset, defaultValues, setOpen7, setSectionTitle, isAllow }) => {
  const [searchValue, setSearchValue] = useState("")
  const [loading2, setLoading2] = useState(false)
  const [deleteItemDetail, setDeleteItemDetail] = useState({})
  const { setSectionData } = React.useContext(AppContext)

  const router = useRouter()

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    module: "courses/sections",
    action: "add",
    fixedQuery: {
      searchColumns: ["nm"],
      search: searchValue,
      userId: router?.query?.coachId || undefined,
      courseId: router?.query?.courseId,
    },
    sort: {
      seq: 1,
    },
    mount: true,
  })

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALLSECTIONS)) getList()
  }, [])

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
    })
  }

  const addUpdateSection = async (values) => {
    const { id, ...rest } = values
    const data = id
      ? { ...rest }
      : {
          ...rest,
          courseId: router?.query?.courseId,
          userId: router?.query?.coachId,
        }
    try {
      setLoading2(true)
      await commonApi({
        action: id ? "update" : "addSection",
        module: id ? "courses/sections" : "",
        common: !!id,
        parameters: [id],
        data,
      }).then(async ([error]) => {
        if (error) return false
        setOpen(false)
        reset({ ...defaultValues })
        setSectionTitle("Add")
        if (isAllow(MODULE_ACTIONS.GETALLSECTIONS)) getList()
        return false
      })
    } finally {
      setLoading2(false)
    }
  }

  const handleConfirmation = async () => {
    const data = {
      ids: [deleteItemDetail?.id],
    }
    await commonApi({
      action: "deleteSection",
      data,
    }).then(async ([error]) => {
      if (error) return false
      // Toast(message, "success")
      getList()
      setOpen7(false)
      return false
    })
  }

  useEffect(() => {
    setSectionData(list)
  }, [list])

  const onDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return
    await commonApi({
      action: "edit",
      module: "courses/sections/update/sequence",
      parameters: [result.draggableId],
      common: true,
      data: {
        seq: result.destination.index,
      },
    }).then(([error]) => {
      if (error) return false
      getList()
      return false
    })
    // setList(items)
  }
  return {
    ...paginate,
    loading,
    loading2,
    getList,
    onPaginationChange,
    list,
    setSearchValue,
    addUpdateSection,
    handleConfirmation,
    deleteItemDetail,
    setDeleteItemDetail,
    onDragEnd,
  }
}

export default useSection
