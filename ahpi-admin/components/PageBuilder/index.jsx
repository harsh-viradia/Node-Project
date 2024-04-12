/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-unused-vars */
// import Table from "hook/table/useTable"
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import Table from "hook/table/useTable"
import React, { useEffect, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { useDebouncedCallback } from "use-debounce"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import SearchInput from "widgets/searchInput"

import SeoManageForm from "../Category/SeoManageForm"
import AddPageForm from "./AddPage"
import pageColumn from "./columns"

const PageBuilderIndex = ({ permission = {}, user = {} }) => {
  // const { getCollapseProps, getToggleProps } = useCollapse()
  const [open, setOpen] = useState(false)
  const [open1, setOpen1] = useState(false)
  const [tableData, setTableData] = useState([])
  const [paginator, setPaginator] = useState({})
  const [search, setSearch] = useState()
  const [page, setPage] = useState(1)
  const [perPage, setPerPage] = useState(10)
  const [pageData, setEditPageData] = useState({})
  const [loading, setLoading] = useState(false)
  const isAllow = (key) => hasAccessTo(permission, MODULES.PAGE, key)
  const GetPageList = async (searchString) => {
    setLoading(true)
    const payload = {
      query: {
        searchColumns: ["name"],
        search: searchString,
      },
      options: {
        page,
        limit: perPage,
        populate: [
          {
            path: "widget.widgetId",
            select: "name",
          },
        ],
      },
    }
    try {
      await commonApi({ action: "add", module: "pages", data: { ...payload }, common: true }).then(([error, res]) => {
        if (error) return
        setPaginator(res.data.paginator || {})
        setTableData(res.data.data || [])
        // eslint-disable-next-line consistent-return
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) GetPageList()
  }, [perPage])

  const debounced = useDebouncedCallback((input) => {
    GetPageList(input)
  }, 350)

  useEffect(() => {
    if (search !== undefined) debounced(search)
  }, [search])

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Page Builder"
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.GETALL) && (
            <SearchInput
              placeholder="Search Page"
              className="w-60"
              onChange={(e) => setSearch(e.target.value || "")}
              value={search}
            />
          )}
          {/* <Button onClick={() => setOpen(true)} title="Add" icon={<AddIcon size="10" />} /> */}
        </div>
      }
    >
      {isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            pageColumn({
              getList: GetPageList,
              setOpen: setOpen1,
              setData: setEditPageData,
              isAllow,
              paginator,
              permission,
            }).columns
          }
          totalPages={paginator.pageCount}
          page={paginator.currentPage}
          itemCount={paginator.itemCount}
          currentPageCount={paginator.currentPage}
          limit={paginator.perPage}
          data={tableData}
          onPaginationChange={(_, e) => setPerPage(e)}
          loading={loading}
        />
      )}
      <AddPageForm open={open} setOpen={setOpen} />
      <SeoManageForm permission={permission} open={open1} setOpen={setOpen1} categoryDetail={pageData} module="page" />
    </LayoutWrapper>
  )
}

export default PageBuilderIndex
