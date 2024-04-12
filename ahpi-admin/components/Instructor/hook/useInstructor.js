/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import usePaginate from "hook/common/usePaginate"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import { DEFAULT_LIMIT, INSTRUCTOR_COURSE_OPTION, MODULE_ACTIONS, MODULES } from "utils/constant"
import { addToUrl } from "utils/util"
import Dropdown from "widgets/dropdown"

const useInstructor = ({ permission }) => {
  const router = useRouter()
  const [searchValue, setSearchValue] = useState("")
  const [open, setOpen] = useState(false)
  const [editId, setEditId] = useState()
  const [payoutId, setPayoutId] = useState()
  const [openFilter, setOpenFilter] = useState(false)
  const [filter, setFilter] = useState()
  const [courseApproval, setCourseApproval] = useState()
  const [filterObject, setFilterObject] = useState()

  const MemoizedNestedComponent = React.useCallback(
    () => (
      // eslint-disable-next-line react/jsx-filename-extension
      <div className="grid grid-cols-1 items-start gap-4">
        <Dropdown
          defaultOptions={INSTRUCTOR_COURSE_OPTION}
          label="Course Approval"
          placeholder="Select Approval"
          onChange={setCourseApproval}
          value={courseApproval}
          isClearable
          isSearch={false}
        />
        {/* <Input label="Bank name" placeholder="Enter bank name" rest={register("bankName")} /> */}
      </div>
    ),
    [openFilter, courseApproval]
  )

  const isAllow = (key) => hasAccessTo(permission, MODULES.INSTRUCTOR, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    action: "add",
    module: "instructor",
    mount: isAllow(MODULE_ACTIONS.GETALL),
    populate: ["profileId", "agreement.category", "agreement.certificates"],
    fixedQuery: {
      searchColumns: ["name", "email", "mobNo", "companyNm"],
      search: searchValue,
    },
    setOpenFilter,
  })

  const deleteAction = async (perPage, offset, itemCount) => {
    getList({
      options: {
        offset: offset > 0 ? (itemCount % offset === 1 ? offset - perPage : offset) : 0,
        limit: perPage || Number(router?.query?.limit) || DEFAULT_LIMIT,
      },
      filter: {
        isActive: filter?.value || router?.query?.isActive,
        "agreement.isApproved": courseApproval?.value || router?.query?.isCourse,
      },
      query: {
        search: searchValue || router?.query?.isSearch,
      },
    })
  }

  const onPaginationChange = (offset, limit) => {
    addToUrl("isSearch", searchValue || router?.query?.isSearch)
    addToUrl("isActive", filter?.value || router?.query?.isActive)
    addToUrl("isCourse", courseApproval?.value || router?.query?.isCourse)
    addToUrl("limit", limit)
    router.replace(addToUrl("offset", offset))

    // return getList(options{offset, limit})
    getList({
      options: {
        offset,
        limit,
      },
      filter: {
        isActive: filter?.value || router?.query?.isActive,
        "agreement.isApproved": courseApproval?.value || router?.query?.isCourse,
      },
      query: {
        search: searchValue || router?.query?.isSearch,
      },
    })
  }

  const handleApplyFilter = () => {
    addToUrl("isSearch", router?.query?.isSearch || searchValue)
    addToUrl("limit", DEFAULT_LIMIT || router?.query?.limit)
    addToUrl("isActive", typeof filter?.value === "boolean" ? filter?.value : undefined)
    addToUrl("isCourse", typeof courseApproval?.value === "boolean" ? courseApproval?.value : undefined)
    router.replace(addToUrl("offset", 0))

    setFilterObject({
      isActive: filter?.value,
      courseApproval: courseApproval?.value,
    })

    getList({
      filter: {
        isActive: filter?.value,
        "agreement.isApproved": courseApproval?.value,
      },
      query: {
        search: searchValue || router?.query?.isSearch,
      },
    })
  }

  const onClickClearFilter = () => {
    addToUrl("isCourse")
    router.replace(addToUrl("isActive"))
    setFilter()
    setFilterObject()
    setCourseApproval()
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue || router?.query?.isSearch,
      },
    })
  }

  useEffect(() => {
    if (router.query.isActive) {
      setFilter({
        label: router?.query?.isActive === "true" ? "Active" : "Inactive",
        value: router?.query?.isActive === "true",
      })
    }

    setFilterObject({
      isActive: router?.query?.isActive,
      courseApproval: router?.query?.isCourse,
    })
    if (router.query.isCourse) {
      setCourseApproval({
        label: router?.query?.isCourse === "true" ? "YES" : "NO",
        value: router?.query?.isCourse === "true",
      })
    }
  }, [router?.query?.isActive, router?.query?.isCourse])

  const routerList = (search) => {
    getList({
      options: {
        offset: Number(router?.query?.offset) || 0,
        limit: Number(router?.query?.limit) || paginate?.perPage || DEFAULT_LIMIT,
      },
      filter: {
        isActive: filter?.value || router?.query?.isActive,
        "agreement.isApproved": courseApproval?.value || router?.query?.isCourse,
      },
      query: {
        search,
      },
    })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) {
      routerList(searchValue || router?.query?.isSearch)
    }
  }, [searchValue])

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
    payoutId,
    setPayoutId,
    handleApplyFilter,
    onClickClearFilter,
    openFilter,
    setOpenFilter,
    filter,
    setFilter,
    addToUrl,
    routerList,
    setList,
    courseApproval,
    setCourseApproval,
    MemoizedNestedComponent,
    setFilterObject,
    deleteAction,
    filterObj: filterObject,
  }
}

export default useInstructor
