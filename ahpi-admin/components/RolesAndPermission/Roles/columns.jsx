/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unstable-nested-components */
import { hasAccessTo } from "@knovator/can"
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS, MODULES } from "utils/constant"

import AddRoles from "./AddRoles"

const rolesColumn = ({ getList, isAllow, role, dt, permission }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(dt.currentPage - 1) * dt.perPage + row.index + 1}</div>,
      },
      {
        Header: "Role Name",
        accessor: "name",
      },
      {
        Header: "Role Code",
        accessor: "code",
      },
      ...(isAllow(MODULE_ACTIONS.UPDATE) ||
      isAllow(MODULE_ACTIONS.DELETE) ||
      hasAccessTo(permission, MODULES.PERMISSION, MODULE_ACTIONS.GETPERMISSIONUSER)
        ? [
            {
              Header: "Actions",
              accessor: "actions",
              style: {
                width: 102,
                maxWidth: 102,
              },
              Cell: ({ row: { original = {} } }) => (
                <TableActions
                  original={original}
                  pagination={{
                    itemcount: dt?.itemcount,
                    offset: dt?.offset,
                    perPage: dt?.perPage,
                  }}
                  components={{
                    SyncFrom: (properties_) => (
                      <AddRoles
                        {...properties_}
                        getList={getList}
                        pagination={{
                          offset: dt?.offset,
                          perPage: dt?.perPage,
                        }}
                        permission={permission}
                      />
                    ),
                    list: getList,
                  }}
                  actionProps={{
                    title: "Update Role",
                    module: "role",
                    // showPermission: role === "ADMIN",
                    showPermission: hasAccessTo(permission, MODULES.PERMISSION, MODULE_ACTIONS.GETPERMISSIONUSER),
                    canEdit: original.canDel && isAllow(MODULE_ACTIONS.UPDATE),
                    canDelete: original.canDel && isAllow(MODULE_ACTIONS.DELETE),
                    softDelete: true,
                    fieldToDisplay: "name",
                  }}
                />
              ),
            },
          ]
        : []),
    ],
    [dt]
  )
  return { columns }
}

export default rolesColumn
