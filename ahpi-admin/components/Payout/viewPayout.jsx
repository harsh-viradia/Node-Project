/* eslint-disable sonarjs/no-duplicate-string */
import Table from "hook/table/useTable"
import BackIcon from "icons/backIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import routes from "utils/routes"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import OrbitLink from "widgets/orbitLink"
import SearchInput from "widgets/searchInput"

import FilterViewPayout from "./FilterViewPayout"
import PayoutColumn from "./payoutColumns"

const list = [
  {
    purchased: { name: "Total Purchased", totalPurchase: "₹ 25410250" },
    price: {
      name: "Total Amount",
      totalPurchase: "₹ 20410250",
    },
  },
  {
    no: "1",
    orderId: "1578568851",
    date: "28/06/2022",
    courseName: "Object-oriented Programming in JavaScript",
    price: "Rp 2000",
    discountAmount: "₹ 200",
    discountPercentage: "10%",
  },
  {
    no: "1",
    orderId: "1578568851",
    date: "28/06/2022",
    courseName: "Animation & VFX.",
    price: "Rp 2000",
    discountAmount: "₹ 200",
    discountPercentage: "10%",
  },
  {
    no: "1",
    orderId: "1578568851",
    date: "28/06/2022",
    courseName: "Animation & VFX.",
    price: "Rp 2000",
    discountAmount: "₹ 200",
    discountPercentage: "10%",
  },
]

const PayOutManageIndex = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title={
        <h4 className="flex col-span-2 gap-2 font-bold">
          <OrbitLink href={routes.payout}>
            <BackIcon />
          </OrbitLink>
          <div className="self-center">Syifa Intan</div>
        </h4>
      }
      headerDetail={
        <div className="flex gap-2">
          <SearchInput placeholder="Search here" />
          <Button title="Export" />
          <FilterButton onClick={() => setOpen(true)} />
        </div>
      }
    >
      <Table
        columns={
          PayoutColumn({
            permission,
          }).columns
        }
        data={list}
      />
      <FilterViewPayout open={open} setOpen={setOpen} />
    </LayoutWrapper>
  )
}

export default PayOutManageIndex
