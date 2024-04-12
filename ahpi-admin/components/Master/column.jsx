/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import ToggleButton from "widgets/toggle"

import AddMaster from "./SyncMaster"

const masterColumn = ({ getList, isAllow, dt }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "id",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(dt.currentPage - 1) * dt.perPage + row.index + 1}</div>,
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Code",
        accessor: "code",
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
              Cell: ({ row: { original = {} } }) => (
                <div className="text-center">
                  <ToggleButton
                    original={original}
                    actionProps={{ module: "masters" }}
                    getList={getList}
                    pagination={{
                      offset: dt?.offset,
                      perPage: dt?.perPage,
                    }}
                  />
                </div>
              ),
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
                minWidth: 72,
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
                      <AddMaster
                        {...properties_}
                        getList={getList}
                        pagination={{
                          offset: dt?.offset,
                          perPage: dt?.perPage,
                        }}
                      />
                    ),
                    list: getList,
                  }}
                  actionProps={{
                    title: "Update Master",
                    module: "masters",
                    canEdit: isAllow(MODULE_ACTIONS.UPDATE),
                    canDelete: original.canDel && isAllow(MODULE_ACTIONS.DELETE),
                  }}
                />
              ),
            },
          ]
        : []),
    ],
    [dt.list]
  )
  return { columns }
}
export default masterColumn
