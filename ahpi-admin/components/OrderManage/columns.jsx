/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { STATUS, STATUS_VIEW } from "utils/constant"
import { dateDisplay } from "utils/util"
import Status from "widgets/status"

const orderColumn = ({ other, list, setOpen }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(other?.currentPage - 1) * other?.perPage + row.index + 1}</div>,
      },
      {
        Header: "Order ID",
        accessor: "orderNo",
      },
      {
        Header: "User Name",
        accessor: "user.name",
      },
      {
        Header: "Date",
        accessor: "createdAt",
        Cell: ({ row: { original = {} } }) => dateDisplay(original?.createdAt),
      },
      {
        Header: "Payment Method",
        accessor: "payMethod",
      },
      {
        Header: "Amount (INR)",
        accessor: "grandTotal",
      },
      {
        Header: "Coupon",
        accessor: "coupon.couponCode",
      },
      {
        Header: "Course Name",
        accessor: "courseName",
        Cell: ({ row: { original = {} } }) => (
          <button type="button" className="text-primary underline" onClick={() => setOpen(original.courses)}>
            {original.courses?.length || 0}
          </button>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row: { original = {} } }) => {
          let color = ""
          switch (original.sts) {
            case STATUS.SUCCESSFULL: {
              color = "dark-green"
              break
            }
            case STATUS.PENDING: {
              color = "yellow"
              break
            }
            case STATUS.FAILED: {
              color = "red"
              break
            }
            default:
              color = "dark-grey"
          }
          return (
            <div>
              <Status statusName={STATUS_VIEW[original.sts]} color={color} />
            </div>
          )
        },
      },
      {
        Header: "Actions",
        accessor: "actions",
        style: {
          width: 100,
          maxWidth: 100,
        },
        Cell: ({ row: { original = {} } }) => (
          // original?.sts === 3 || original?.sts === 2 || !original?.sts ? (
          //   ""
          // ) : (
          <TableActions
            original={original}
            actionProps={{
              canDownload: true,
              // canGenerateInvoice: true,
              // canReSendInvoice: isAllow(MODULE_ACTIONS.SENDINVOICE),
              canReSendInvoice: true,
              showDisabled: original?.sts === 3 || original?.sts === 2 || !original?.sts,
            }}
          />
        ),
        // ),
      },
    ],
    [list]
  )
  return { columns }
}
export default orderColumn
