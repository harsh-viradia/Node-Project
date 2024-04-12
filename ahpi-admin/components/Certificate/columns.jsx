/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import { MODULE_ACTIONS } from "utils/constant"
import DefaultToggleBtn from "widgets/defaultToggle"
import OrbitLink from "widgets/orbitLink"
import Status from "widgets/status"
import ToggleButton from "widgets/toggle"

const CertificateColumn = ({ list, setOpen, isAllow, ...other }) => {
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
      },
      {
        Header: "Description",
        accessor: "description",
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
                      disabled={!row.original?.isActive}
                      checked={row.original?.isDefault}
                      // eslint-disable-next-line no-underscore-dangle
                      onChange={other?.partialDefaultUpdate(row.original?._id, { isDefault: !row.original?.isDefault })}
                    />
                  </div>
                )
              },
            },
          ]
        : []),
      {
        Header: "Preview",
        accessor: "preview",
        Cell: ({ row }) => {
          return (
            <OrbitLink className="cursor-pointer" onClick={() => setOpen(row.original?._id)}>
              <Status light={false} className="absolute inset-0 rounded-none" statusName="Preview" color="yellow" />
            </OrbitLink>
          )
        },
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
                      actionProps={{ module: "certificate", action: "partialUpdate", disabled: original?.isDefault }}
                      setList={other.setList}
                      list={list}
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
    ],
    [list]
  )
  return { columns }
}

export default CertificateColumn
