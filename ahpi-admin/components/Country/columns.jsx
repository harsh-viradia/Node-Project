/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import DefaultToggleBtn from "widgets/defaultToggle"
import ToggleButton from "widgets/toggle"

import AddCountry from "./AddCountry"

const countryColumn = ({ getList, other, partialDefaultUpdate, isAllow }) => {
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
        Header: "Two Letter ISO Code",
        accessor: "ISOCode2",
      },
      {
        Header: "Three Letter ISO Code",
        accessor: "ISOCode3",
      },
      {
        Header: "ISD Code",
        accessor: "ISDCode",
      },
      ...(isAllow(MODULE_ACTIONS.DEFAULT)
        ? [
            {
              Header: "Default",
              accessor: "isDefault",
              Cell: ({ row }) => {
                return (
                  <div className="flex items-center gap-3">
                    <DefaultToggleBtn
                      checked={row.original?.isDefault}
                      // eslint-disable-next-line no-underscore-dangle
                      onChange={partialDefaultUpdate(row.original?._id, { isDefault: !row.original?.isDefault })}
                    />
                  </div>
                )
              },
            },
          ]
        : []),
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
                      actionProps={{ module: "country", action: "partialUpdateCountry" }}
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
      ...(isAllow(MODULE_ACTIONS.UPDATE || isAllow(MODULE_ACTIONS.DELETE))
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
                      <AddCountry
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
                    title: "Update Country",
                    module: "country",
                    canEdit: isAllow(MODULE_ACTIONS.UPDATE),
                    canDelete: isAllow(MODULE_ACTIONS.DELETE),
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

export default countryColumn
