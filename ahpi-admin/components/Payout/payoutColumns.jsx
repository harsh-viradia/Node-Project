/* eslint-disable sonarjs/no-identical-functions */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import Checkbox from "widgets/checkbox"
import Status from "widgets/status"

const PayoutColumn = () => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: () => <Checkbox />,
      },
      {
        Header: "Order ID",
        accessor: "orderId",
        Cell: ({ row }) => (
          <div>
            {row.original.orderId?.name ? (
              <div>
                <div>{row.original.orderId?.name} </div>
                <div>{row.original.orderId.name2}</div>
                <div>{row.original.orderId?.name3}</div>
                <div>{row.original.orderId.name4}</div>
              </div>
            ) : (
              row.original.orderId
            )}
          </div>
        ),
      },
      {
        Header: "Date",
        accessor: "date",
        Cell: ({ row }) => (
          <div>
            {row.original.date?.name ? (
              <div>
                <div>{row.original.date?.name} </div>
                <div className="text-lg font-bold">{row.original.date.totalPurchase}</div>
              </div>
            ) : (
              row.original.date
            )}
          </div>
        ),
      },
      {
        Header: "Course Name",
        accessor: "courseName",
        Cell: ({ row }) => (
          <div>
            {row.original.courseName?.name ? (
              <div>
                <div>{row.original.courseName?.name} </div>
                <div>{row.original.courseName.name2}</div>
                <div>{row.original.courseName?.name3}</div>
                <div>{row.original.courseName.name4}</div>
              </div>
            ) : (
              row.original.courseName
            )}
          </div>
        ),
      },
      {
        Header: "Price",
        accessor: "price",
        Cell: ({ row }) => (
          <div>
            {row.original.price?.name ? (
              <div>
                <div>{row.original.purchased?.name} </div>
                <div className="text-lg font-bold">{row.original.purchased.totalPurchase}</div>
              </div>
            ) : (
              row.original.price
            )}
          </div>
        ),
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) => (
          <div>
            {row.original.price?.status ? (
              <div>
                <div>{row.original.purchased?.status} </div>
                <div className="text-lg font-bold">{row.original.purchased.totalPurchase}</div>
              </div>
            ) : (
              <Status statusName="Pending" color="yellow" />
            )}
          </div>
        ),
      },
      {
        Header: "Actions",
        accessor: "actions",
        style: {
          width: 100,
          maxWidth: 100,
        },
        Cell: ({ row: { original = {} } }) => (
          <TableActions
            original={original}
            // pagination={{
            //   itemCount: other?.itemCount,
            //   offset: other?.offset,
            //   perPage: other?.perPage,
            // }}
            components={
              {
                // SyncFrom: (properties_) => (
                //   <AddStudent
                //     {...properties_}
                //     getList={getList}
                //     pagination={{
                //       offset: other?.offset,
                //       perPage: other?.perPage,
                //     }}
                //     permission={permission}
                //   />
                // ),
              }
            }
            actionProps={{
              canEdit: false,
              module: "student",
              canDownload: true,
            }}
          />
        ),
      },
    ],
    []
  )
  return { columns }
}
export default PayoutColumn
