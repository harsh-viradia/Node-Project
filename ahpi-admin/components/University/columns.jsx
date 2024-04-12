/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import AffiliatedButton from "widgets/affiliated"
import ToggleButton from "widgets/toggle"

import AddUniversity from "./AddUniversity"

const universityColumn = ({ getList, isAllow, other, permission }) => {
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
        Header: "Abbreviation",
        accessor: "abbreviation",
      },
      {
        Header: "Location",
        accessor: "location",
        Cell: ({
          row: {
            original: { add = {} },
          },
        }) => {
          const { street = "", cityNm = "", stateNm = "", countryNm = "" } = add
          return (
            <div className="whitespace-normal">
              {street ? `${street}${cityNm ? ", " : ""}` : ""}
              {cityNm ? `${cityNm}${stateNm ? ", " : ""}` : ""}
              {stateNm ? `${stateNm}${countryNm ? ", " : ""}` : ""}
              {countryNm ? `${countryNm}` : ""}
            </div>
          )
        },
      },
      ...(isAllow(MODULE_ACTIONS.AFFILIATEUPDATE)
        ? [
            {
              Header: "KM Affiliate",
              accessor: "isAffiliated",
              style: {
                width: 92,
                maxWidth: 92,
              },
              Cell: ({ row: { original = {} } }) => {
                return (
                  <div className="text-center">
                    <AffiliatedButton
                      original={original}
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
                      actionProps={{ module: "university" }}
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
                      <AddUniversity
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
                    title: "Update University",
                    module: "university",
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

export default universityColumn
