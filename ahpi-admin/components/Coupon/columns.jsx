/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import { dateDisplay } from "utils/util"
import ToggleButton from "widgets/toggle"

import AddCouponForm from "./AddCouponForm"

const widgetColumn = ({ getList, isAllow, other, permission }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(other.currentPage - 1) * other.perPage + row.index + 1}</div>,
      },
      {
        Header: "Coupon Name",
        accessor: "name",
      },
      {
        Header: "Coupon Code",
        accessor: "code",
      },
      {
        Header: "Type",
        accessor: "typeId",
        Cell: ({ row }) => <div>{row.original.typeId?.name}</div>,
      },
      {
        Header: "Expired On",
        accessor: "expireDate",
        Cell: ({ row }) => <div>{`${dateDisplay(row.original?.expireDate)}`}</div>,
      },
      {
        Header: "Criteria",
        accessor: "criteriaId",
        Cell: ({ row }) => <div>{row.original.criteriaId?.name}</div>,
      },
      {
        Header: "No of Purchase",
        accessor: "totalPurchase",
      },
      {
        Header: "No of Use",
        accessor: "totalUse",
      },
      {
        Header: "Discount Amount",
        accessor: "discountAmount",
      },
      {
        Header: "Discount Percentage(%)",
        accessor: "discountPercentage",
      },
      ...(isAllow(MODULE_ACTIONS.PARTIALUPDATE)
        ? [
            {
              Header: "Active",
              accessor: "isActive",
              style: {
                width: 64,
                maxWidth: 64,
              },
              Cell: ({ row: { original = {} } }) => {
                return (
                  <div className="text-center">
                    <ToggleButton
                      original={original}
                      actionProps={{ module: "coupon" }}
                      getList={getList}
                      pagination={{
                        offset: other?.offset,
                        perPage: other?.perPage,
                      }}
                    />
                  </div>
                  // )
                )
              },
            },
          ]
        : []),
      ...(isAllow(MODULE_ACTIONS.UPDATE) || isAllow(MODULE_ACTIONS.DELETE)
        ? [
            {
              Header: "Actions",
              accessor: "actions",
              style: {
                width: 72,
                maxWidth: 72,
              },
              Cell: ({ row: { original = {} } }) => (
                <TableActions
                  original={original}
                  pagination={{
                    itemCount: other?.itemCount,
                    offset: other?.offset,
                    perPage: other?.perPage,
                  }}
                  components={{
                    SyncFrom: (properties_) => (
                      <AddCouponForm
                        {...properties_}
                        getList={getList}
                        pagination={{
                          offset: other?.offset,
                          perPage: other?.perPage,
                        }}
                        permission={permission}
                      />
                    ),
                    list: getList,
                  }}
                  actionProps={{
                    softDelete: true,
                    title: "Update Coupon",
                    module: "coupon",
                    canEdit: isAllow(MODULE_ACTIONS.UPDATE),
                    canDelete: isAllow(MODULE_ACTIONS.DELETE),
                    itemName: original?.name,
                  }}
                />
              ),
            },
          ]
        : []),
    ],
    [other.list]
  )
  return { columns }
}
export default widgetColumn
