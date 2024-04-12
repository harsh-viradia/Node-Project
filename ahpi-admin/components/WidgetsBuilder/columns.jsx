/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unstable-nested-components */
import EditIcon from "icons/editIcon"
import router from "next/router"
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"
import ToggleButton from "widgets/toggle"

const widgetColumns = ({ dt, list, isAllow }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => {
          return <div>{(((dt.currentPage || 1) - 1) * dt.perPage || 0) + (row.index + 1)}</div>
        },
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
        Header: "Type",
        accessor: "type.name",
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
                      actionProps={{ module: "widget", action: "partialUpdate" }}
                      setList={dt.setList}
                      list={list}
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
              Header: "Action",
              accessor: "action",
              style: {
                width: 74,
                maxWidth: 74,
              },
              Cell: ({ row }) => {
                return (
                  <>
                    {" "}
                    <div className="flex items-center gap-3">
                      {isAllow(MODULE_ACTIONS.UPDATE) && (
                        <OrbitLink
                          onClick={() =>
                            router.push({
                              pathname: routes.addWidget,
                              query: { id: row.original._id, offset: dt?.offset, limit: dt?.perPage },
                            })
                          }
                        >
                          <div data-tip="Click To Edit" className="sell-center">
                            <EditIcon size="14px" />
                          </div>
                        </OrbitLink>
                      )}
                      <TableActions
                        original={row.original}
                        pagination={{
                          itemcount: dt?.itemCount,
                          offset: dt?.offset,
                          perPage: dt?.perPage,
                        }}
                        components={{
                          list: dt.getList,
                        }}
                        actionProps={{
                          module: "widget",
                          canDelete: isAllow(MODULE_ACTIONS.DELETE),
                          fieldToDisplay: "name",
                          softDelete: true,
                        }}
                      />
                    </div>
                  </>
                )
              },
            },
          ]
        : []),
    ],
    [list]
  )
  return { columns }
}

export default widgetColumns
