/* eslint-disable sonarjs/no-duplicate-string */
import Table from "hook/table/useTable"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import SearchInput from "widgets/searchInput"

import PayoutColumn from "./columns"
import FilterPayout from "./FilterPayout"

const list = [
  {
    no: "1",
    name: "Syifa Intan",
    email: "safiyaintam@gmail.com",
    payout: "Rp 20000",
    date: "06/2022",
  },
  {
    no: "1",
    name: "Noor Mohhmad	",
    email: "noor@gmail.com",
    payout: "Rp 20000",
    date: "07/2022",
  },
]

const PayOutManageIndex = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const [view, setView] = useState("pyCurrent")
  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      topDetail={
        <div className="static h-16 top-0 px-4 py-2.5 bg-white shadow-sm gap-2">
          <div className="grid items-center w-full grid-cols-12">
            <h4 className="flex col-span-2 gap-2 font-bold">
              <div className="self-center">Payout</div>
            </h4>
            <div className="flex items-center justify-center col-span-6 overflow-hidden rounded-lg">
              <button
                type="button"
                className={`h-10 px-3 py-2 font-medium text-sm border-b ${
                  view === "pyCurrent" ? "text-primary border-primary" : "text-foreground"
                } `}
                onClick={() => setView("pyCurrent")}
              >
                Upcoming Payout
              </button>
              <button
                type="button"
                className={`h-10 px-3 py-2 font-medium text-sm border-b ${
                  view === "pyLast" ? "text-primary border-primary" : "text-foreground"
                } `}
                onClick={() => setView("pyLast")}
              >
                Last Payout
              </button>
              <button
                type="button"
                className={`h-10 px-3 py-2 font-medium text-sm border-b ${
                  view === "pyAll" ? "text-primary border-primary" : "text-foreground"
                } `}
                onClick={() => setView("pyAll")}
              >
                All Payout
              </button>
            </div>
            <div className="flex items-center justify-end col-span-4 gap-2">
              <SearchInput placeholder="Search here" />
              <Button title="Export" />
              <FilterButton onClick={() => setOpen(true)} />
            </div>
          </div>
        </div>
      }
    >
      {view === "pyCurrent" && (
        <Table
          columns={
            PayoutColumn({
              permission,
            }).columns
          }
          data={list}
        />
      )}

      {view === "pyUpcoming" && (
        <Table
          columns={
            PayoutColumn({
              permission,
            }).columns
          }
          data={list}
        />
      )}

      {view === "pyLast" && (
        <Table
          columns={
            PayoutColumn({
              permission,
            }).columns
          }
          data={list}
        />
      )}

      {view === "pyAll" && (
        <Table
          columns={
            PayoutColumn({
              permission,
            }).columns
          }
          data={list}
        />
      )}
      <FilterPayout open={open} setOpen={setOpen} />
    </LayoutWrapper>
  )
}

export default PayOutManageIndex
