/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import ToggleButton from "widgets/toggle"

// import AddStudents from "./FilterStudents"
import ViewStudents from "./ViewStudents"

const StudentsColumn = ({ getList, isAllow, other, permission }) => {
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
        Header: "User Name",
        accessor: "name",
        Cell: ({ row: { original = {} } }) => {
          return <>{original?.name || "-"}</>
        },
      },
      {
        Header: "Email Id",
        accessor: "email",
        Cell: ({ row: { original = {} } }) => {
          return <>{original?.email || "-"}</>
        },
      },
      {
        Header: "Phone No",
        accessor: "mobNo",
        Cell: ({ row }) => {
          return `${row.original.countryCode || ""} ${row.original.mobNo || ""}`
        },
      },
      {
        Header: "No of Course Bought",
        accessor: "totalPurchaseCourse",
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
                      actionProps={{ module: "lerner" }}
                      setList={other.setList}
                      list={other.list}
                      pagination={{
                        offset: other?.offset,
                        perPage: other?.perPage,
                      }}
                    />
                  </div>
                )
              },
            },
          ]
        : []),
      {
        Header: "Actions",
        accessor: "actions",
        style: {
          width: 74,
          maxWidth: 74,
        },
        Cell: ({ row: { original = {} } }) => (
          <TableActions
            pagination={{
              itemCount: other?.itemCount,
              offset: other?.offset,
              perPage: other?.perPage,
            }}
            getList={getList}
            original={original}
            components={{
              // SyncFrom: (properties_) => (
              //   <AddStudents
              //     {...properties_}
              //   getList={getList}
              //   pagination={{
              //     offset: other?.offset,
              //     perPage: other?.perPage,
              //   }}
              //   permission={permission}
              // />
              // ),
              ViewFrom: (properties_) => (
                <ViewStudents
                  {...properties_}
                  permission={permission}
                  getList={getList}
                  pagination={{
                    offset: other?.offset,
                    perPage: other?.perPage,
                  }}
                  original={original}
                  isAllow={isAllow}
                />
              ),
              list: getList,
              //   list: getList,
            }}
            actionProps={{
              softDelete: true,
              module: "lerner",
              canEdit: false,
              canView: true,
              canDelete: isAllow(MODULE_ACTIONS.DELETE),
              payload: { itemName: original?.name },
              fieldToDisplay: "name",
            }}
          />
        ),
      },
    ],
    [other.list]
  )
  return { columns }
}

export default StudentsColumn
