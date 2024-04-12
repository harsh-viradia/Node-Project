/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import ToggleButton from "widgets/toggle"

import AddSubMaster from "./AddSubMaster"

const subMasterColumn = ({ getList, isAllow, sm }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "id",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(sm.currentPage - 1) * sm.perPage + row.index + 1}</div>,
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
                <ToggleButton
                  original={original}
                  actionProps={{ module: "masters" }}
                  getList={getList}
                  pagination={{
                    offset: sm?.offset,
                    perPage: sm?.perPage,
                  }}
                />
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
                maxWidth: 72,
              },
              Cell: ({ row: { original = {} } }) => (
                <TableActions
                  original={original}
                  pagination={{
                    itemcount: sm?.itemcount,
                    offset: sm?.offset,
                    perPage: sm?.perPage,
                  }}
                  components={{
                    SyncFrom: (properties_) => (
                      <AddSubMaster
                        {...properties_}
                        getList={getList}
                        pagination={{
                          offset: sm?.offset,
                          perPage: sm?.perPage,
                        }}
                      />
                    ),
                    list: getList,
                  }}
                  actionProps={{
                    title: "Update Sub Master",
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
    [sm.list]
  )
  return { columns }
}

export default subMasterColumn
