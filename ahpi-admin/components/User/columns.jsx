/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unstable-nested-components */
import dayjs from "dayjs"
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import { dateDisplay } from "utils/util"
import ToggleButton from "widgets/toggle"

import AddUser from "./AddUser"

const userColumn = ({ getList, isAllow, other, permission, rolesList }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(other.currentPage - 1) * other.perPage + row.index + 1}</div>,
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => <div>{`${row.original?.firstName || ""} ${row.original?.lastName || ""}`}</div>,
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Phone Number",
        accessor: "mobNo",
        Cell: ({ row }) => <div>{`${row.original?.countryCode} ${row.original?.mobNo}`}</div>,
      },
      {
        Header: "Roles",
        accessor: "roles",
        Cell: ({ row }) => <div>{`${row.original?.roles?.[0]?.roleId?.name || ""}`}</div>,
      },
      {
        Header: "Created",
        accessor: "createdAt",
        Cell: ({ row }) => <div>{`${dateDisplay(row.original?.createdAt)}`}</div>,
      },
      {
        Header: "Last Login",
        accessor: "lastLogin",
        Cell: ({ row }) => (
          <div>{row?.original?.lastLogin ? dayjs(row?.original?.lastLogin).format("DD/MM/YYYY HH:mm:ss") : ""}</div>
        ),
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
                      actionProps={{ module: "users" }}
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
                      <AddUser
                        {...properties_}
                        getList={getList}
                        pagination={{
                          offset: other?.offset,
                          perPage: other?.perPage,
                        }}
                        rolesList={rolesList}
                        permission={permission}
                      />
                    ),
                    list: getList,
                  }}
                  actionProps={{
                    softDelete: true,
                    title: "Update User",
                    module: "users",
                    canEdit: isAllow(MODULE_ACTIONS.UPDATE),
                    canDelete: isAllow(MODULE_ACTIONS.DELETE),
                    itemName: `${original?.firstName || ""} ${original?.lastName || ""}`,
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

export default userColumn
