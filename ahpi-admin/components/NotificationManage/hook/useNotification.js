/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"

const sendNotification = async (id) => {
  await commonApi({
    action: "sendNotification",
    parameters: [id],
  }).then(async ([error, { message }]) => {
    if (error) {
      return
    }
    Toast(message, "success")
    // eslint-disable-next-line consistent-return
    return false
  })
}
const useNotification = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState()
  const [openFilter, setOpenFilter] = useState(false)
  const [filter, setFilter] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.NOTIFICATION, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "notification",
    mount: isAllow(MODULE_ACTIONS.GETALL),
    fixedQuery: {
      searchColumns: ["nm", "title", "desc"],
      search: searchValue,
    },
    populate: [
      {
        path: "criteriaId courses categories users typeId imgId userTypeId pages",
        select: "name code title uri",
      },
    ],
    setOpenFilter,
  })

  const onPaginationChange = (offset, limit) => {
    // return getList(options{offset, limit})
    getList({
      options: {
        offset,
        limit,
      },
      query: {
        filter,
        searchColumns: ["nm", "title", "desc"],
        search: searchValue,
      },
    })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
        query: {
          filter,
          search: searchValue,
        },
        filter,
      })
    }
  }, [searchValue])

  const handleApplyFilter = (sendObject) => {
    setFilter(sendObject)
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
        userIds: sendObject?.userIds,
      },
      filter: sendObject,
    })
  }

  const onClickClearFilter = () => {
    setFilter()
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
      },
    })
  }

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    isAllow,
    setSearchValue,
    searchValue,
    open,
    setOpen,
    editId,
    setEditId,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    setList,
    sendNotification,
  }
}

export default useNotification
