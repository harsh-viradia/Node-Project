/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DEFAULT_LIMIT, MODULE_ACTIONS, MODULES, SYSTEM_USERS } from "utils/constant"
import Toast from "utils/toast"

const useCourse = ({ permission, user }) => {
  const [searchValue, setSearchValue] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [filter, setFilter] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.COURSE, key)
  const [allowAdd, setAllowAdd] = useState(true)
  const [preview, setPreview] = useState()
  const [requestedCount, setCount] = useState()
  const router = useRouter()
  const { query } = router

  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "courses",
    action: "add",
    fixedQuery: {
      search: searchValue,
      searchColumns: ["title"],
    },
    populate: ["userId", "imgId"],
    mount: isAllow(MODULE_ACTIONS.GETALL),
    setOpenFilter,
  })

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
      query: {
        isActive: filter?.isActive,
        isPreview: filter?.isPreview,
        sts: filter?.sts,
        search: searchValue,
      },
      filter: {
        categories: filter?.category,
        userIds: filter?.userIds,
      },
    })
  }
  const handleApplyFilter = (sendObject) => {
    setFilter(sendObject)
    getList({
      query: {
        isActive: sendObject.isActive,
        sts: sendObject?.sts,
        search: searchValue,
        ...(sendObject.isPreview === 1
          ? { isPreview: true }
          : sendObject.isPreview === 2
          ? { isPreview: true, isReject: false }
          : sendObject.isPreview === 3
          ? { isPreview: true, isReject: true }
          : {}),
      },
      filter: {
        categories: sendObject?.category,
        userIds: sendObject?.userIds,
      },
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
  const setFilteredList = () => {
    getList({
      options: {
        offset: Number(query?.offset) || 0,
        limit: Number(query?.limit) || paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        isActive: filter?.isActive,
        ...(filter?.isPreview === 1
          ? { isPreview: true }
          : filter?.isPreview === 2
          ? { isPreview: true, isReject: false }
          : filter?.isPreview === 3
          ? { isPreview: true, isReject: true }
          : {}),
        sts: filter?.sts,
        search: searchValue,
      },
      filter: {
        categories: filter?.category,
        userIds: filter?.userIds,
      },
    })
  }
  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) setFilteredList()
  }, [searchValue])
  const getCourseCounts = async () => {
    if (user?.role === SYSTEM_USERS.INSTRUCTOR) {
      commonApi({ action: "courseCountForInstructor", data: { instructorId: user?.id }, errorToast: false })
        .then(([error, { data }]) => setAllowAdd(error ? false : data.flag))
        .catch(() => {})
    }
    if (isAllow(MODULE_ACTIONS.PREVIEW_COUNT)) {
      commonApi({ action: "requestedCourseCount", errorToast: false })
        .then(([, { data }]) => setCount(data))
        .catch(() => {})
    }
  }
  useEffect(() => getCourseCounts(), [])
  const rejectPreview = async ({ rejectReason }) => {
    await commonApi({ action: "rejectCourse", data: { rejectList: rejectReason }, parameters: [preview?._id] })
      .then(([error, { message }]) => {
        if (!error) {
          Toast(message)
          setPreview()
          setFilteredList()
        }
        return false
      })
      .catch(() => {})
  }
  const acceptPreview = async () => {
    await commonApi({ action: "verifyCourse", parameters: [preview?._id] })
      // eslint-disable-next-line sonarjs/no-identical-functions
      .then(([error, { message }]) => {
        if (!error) {
          Toast(message)
          setPreview()
          setFilteredList()
        }
        return false
      })
      .catch(() => {})
    if (isAllow(MODULE_ACTIONS.PREVIEW_COUNT)) {
      await commonApi({ action: "requestedCourseCount", errorToast: false })
        .then(([, { data }]) => setCount(data))
        .catch(() => {})
    }
  }
  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setSearchValue,
    isAllow,
    setList,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    handleApplyFilter,
    onClickClearFilter,
    allowAdd,
    preview,
    setPreview,
    rejectPreview,
    acceptPreview,
    requestedCount,
    getCourseCounts,
  }
}

export default useCourse
