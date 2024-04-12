/* eslint-disable sonarjs/no-collapsible-if */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-unused-vars */
/* eslint-disable no-shadow */
/* eslint-disable no-param-reassign */
/* eslint-disable react/no-unstable-nested-components */
import React, { useEffect, useState } from "react"
import { usePagination, useTable } from "react-table"
import { useDebouncedCallback } from "use-debounce"
import { PAGE_LIMIT } from "utils/constant"
import Button from "widgets/button"
import Input from "widgets/input"
import OrbitLoader from "widgets/loader"

const Pagination = ({ page, limit, totalPages, itemCount, currentPageCount, onPaginationChange, setPageSize }) => {
  const [newPageValue, setNewPageValue] = useState(page)
  const gotoPreviousPage = React.useCallback(() => {
    if (page !== 1) {
      onPaginationChange(limit * (page - 2), limit)
      setNewPageValue(page - 1)
    }
  }, [limit, onPaginationChange, page])

  const gotoNextPage = React.useCallback(() => {
    if (page !== totalPages) {
      onPaginationChange(limit * page, limit)
      setNewPageValue(page + 1)
    }
  }, [limit, onPaginationChange, page, totalPages])

  const handleLimitChange = React.useCallback(
    (event) => {
      setPageSize(Number(event.target.value))
      setNewPageValue(1)
      onPaginationChange(event.target.value * 0, Number(event.target.value))
    },
    [onPaginationChange]
  )

  const debounced = useDebouncedCallback((input) => {
    onPaginationChange(limit * (input - 1), limit)
  }, 1000)

  const goToPage = (event) => {
    event.target.value = event.target.value.replaceAll(/\D/gi, "")
    setNewPageValue(event.target.value)
    if (event.target.value && event.target.value > 0 && event.target.value <= totalPages) {
      debounced(event.target.value)
    }
  }

  useEffect(() => {
    setNewPageValue(page)
  }, [page])

  return (
    <div className="flex items-center justify-between px-4 py-3 pagination">
      <div className="flex items-center gap-3">
        <span className="text-xs">View</span>
        <select
          value={limit}
          className="px-2 py-2 text-xs bg-transparent border rounded-md outline-none h-9 border-primary-border"
          onChange={handleLimitChange}
        >
          {PAGE_LIMIT.map((pageSize) => (
            <option key={pageSize} value={pageSize}>
              {pageSize}
            </option>
          ))}
        </select>
        <span className="text-xs">Records per page</span>
      </div>
      <div className="flex items-center gap-3">
        {currentPageCount ? (
          <span className="text-xs">
            Showing {(page - 1) * limit + 1 || 0} to {(page - 1) * limit + currentPageCount || 0} of {itemCount || 0}{" "}
            records
          </span>
        ) : (
          ""
        )}
        <Button
          title="Previous"
          kind="primary"
          className="cursor-pointer "
          onClick={gotoPreviousPage}
          disabled={page === 1}
        />
        <div className="flex items-center gap-1 text-xs">
          Page
          <Input
            className="outline-none flex items-center text-center justify-center py-2 text-sm border rounded-md h-9 border-primary-border
            focus:outline-none px-3 font-medium placeholder:text-gray-400 placeholder:font-normal focus:border focus:border-primary text-black transition bg-white w-14"
            onChange={(event) => goToPage(event)}
            value={newPageValue}
          />
          of
        </div>
        <span className="text-sm text-black font-medium">{totalPages}</span>
        <Button
          title="Next"
          kind="primary"
          className="cursor-pointer"
          onClick={gotoNextPage}
          disabled={page === totalPages}
        />
      </div>
    </div>
  )
}

const Table = ({
  columns,
  data = {},
  showPagination = true,
  totalPages = 1,
  page: currentPage,
  limit,
  loading,
  onPaginationChange,
  itemCount,
  currentPageCount,
  tableHeight = false,
  className = "table-height",
  prefixHeight,
}) => {
  const myReference = React.useRef()
  const { getTableProps, getTableBodyProps, headerGroups, prepareRow, rows, setPageSize } = useTable(
    {
      columns,
      data,
      initialState: {
        pageIndex: 0,
      },
    },
    usePagination
  )

  return (
    <div className="overflow-hidden bg-white border rounded-lg border-thin-gray">
      <div className="relative">
        {loading && <OrbitLoader relative />}
        <div className={`${className} ${tableHeight || ""}`}>
          <table className="w-full text-sm" {...getTableProps()} ref={myReference}>
            <thead>
              {headerGroups.map((headerGroup) => (
                <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => (
                    <th
                      style={column.style}
                      className="text-xs px-3 py-2.5 text-left bg-primary-light visible border-b border-r border-thin-gray font-semibold whitespace-nowrap sticky top-0 z-10"
                      {...column.getHeaderProps()}
                    >
                      {column.render("Header")}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody {...getTableBodyProps()}>
              {rows?.length ? (
                rows.map((row) => {
                  prepareRow(row)
                  return (
                    <tr {...row.getRowProps()} className="border-b border-thin-gray">
                      {row.cells.map((cell) => {
                        return (
                          <td
                            className="relative text-xs text-foreground font-medium px-3 py-2.5 border-r border-thin-gray whitespace-nowrap"
                            {...cell.getCellProps()}
                          >
                            {cell.render("Cell")}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })
              ) : (
                <div className="min-h-20">
                  <div className="w-full font-bold no-data">{loading ? "" : "NO DATA FOUND"}</div>
                </div>
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showPagination && (
        <Pagination
          page={currentPage}
          limit={limit}
          totalPages={totalPages}
          itemCount={itemCount}
          currentPageCount={currentPageCount}
          setPageSize={setPageSize}
          onPaginationChange={onPaginationChange}
        />
      )}
    </div>
  )
}
export default Table
