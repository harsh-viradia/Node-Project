/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import ToggleButton from "widgets/toggle"

import AddProvince from "./AddProvince"

const provinceColumn = ({ getList, list, other, isAllow }) => {
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
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Code",
        accessor: "code",
      },
      {
        Header: "Country",
        accessor: "countryNm",
      },
      {
        Header: "Two Letter ISO Code",
        accessor: "ISOCode2",
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
                      actionProps={{ module: "state" }}
                      getList={getList}
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
      ...(isAllow(MODULE_ACTIONS.UPDATE) || isAllow(MODULE_ACTIONS.DELETE)
        ? [
            {
              Header: "Actions",
              accessor: "actions",
              style: {
                width: 74,
                maxWidth: 74,
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
                      <AddProvince
                        {...properties_}
                        getList={getList}
                        pagination={{
                          offset: other?.offset,
                          perPage: other?.perPage,
                        }}
                      />
                    ),
                    list: getList,
                  }}
                  actionProps={{
                    softDelete: true,
                    title: "Update State",
                    module: "state",
                    canEdit: isAllow(MODULE_ACTIONS.UPDATE),
                    canDelete: isAllow(MODULE_ACTIONS.DELETE),
                  }}
                />
              ),
            },
          ]
        : []),
    ],
    [list]
  )
  return { columns }
}

export default provinceColumn
