/* eslint-disable sonarjs/cognitive-complexity */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES, SYSTEM_USERS } from "utils/constant"

const useUser = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const [userData, setUserData] = useState([])
  const [openFilter, setOpenFilter] = useState(false)
  const [filterCount, setFilterCount] = useState()
  const [userId, setUserId] = useState()
  const [userId2, setUserId2] = useState()
  const [activeFilter, setActiveFilter] = useState()
  const [activeFilter2, setActiveFilter2] = useState()

  const isAllow = (key) => hasAccessTo(permission, MODULES.USER, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
  } = usePaginate({
    select: ["-passwords"],
    action: "add",
    module: "users",
    populate: ["roles.roleId"],
    fixedQuery: {
      searchColumns: ["name", "email", "mobNo"],
      search: searchValue,
    },
    mount: isAllow(MODULE_ACTIONS.GETALL),
  })

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
    })
  }

  const getUsersList = async () => {
    if (hasAccessTo(permission, MODULES.ROLE, MODULE_ACTIONS.GETALL)) {
      const payload = {
        options: { sort: { createdAt: -1 }, pagination: false },
        query: {
          code: { $nin: [SYSTEM_USERS.INSTRUCTOR, SYSTEM_USERS.LEARNER] },
        },
      }
      await commonApi({ action: "list", module: "role", common: true, data: payload }).then(async ([, { data }]) => {
        const roleList = data?.data?.map(({ _id, name, code }) => ({
          value: _id,
          label: name,
          code,
        }))
        setUserData(roleList)
        return false
      })
    }
  }

  useEffect(() => {
    if (hasAccessTo(permission, MODULES.ROLE, MODULE_ACTIONS.GETALL)) {
      getUsersList()
    }
  }, [])

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

  const applyFilter = async () => {
    await getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      filter: {
        roleId: userId?.value || undefined,
        isActive: activeFilter?.value === true || activeFilter?.value === false ? activeFilter?.value : undefined,
      },
      query: { search: searchValue },
    })
    await setFilterCount((activeFilter?.label ? 1 : 0) + (userId?.value ? 1 : 0))
    await setActiveFilter2(activeFilter)
    await setUserId2(userId)
    setOpenFilter(false)
  }

  const removeFilter = async () => {
    await setActiveFilter()
    await setActiveFilter2()
    await setUserId()
    await setUserId2()
    await setFilterCount()
    getList({
      filter: {
        roleIds: undefined,
        isActive: undefined,
      },
      query: { search: searchValue },
    })
  }

  useEffect(() => {
    if (filterCount) {
      setActiveFilter(activeFilter2)
      setUserId(userId2)
    } else {
      setActiveFilter()
      setUserId()
      setFilterCount()
    }
  }, [openFilter])

  return {
    ...paginate,
    loading,
    userData,
    list,
    open,
    openFilter,
    filterCount,
    activeFilter,
    userId,
    getList,
    onPaginationChange,
    setSearchValue,
    setOpen,
    isAllow,
    getUsersList,
    setUserId,
    setOpenFilter,
    setActiveFilter,
    applyFilter,
    removeFilter,
  }
}

export default useUser
