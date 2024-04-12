/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"

import CoursesAppliedList from "./courseAppliedList"
import ViewDetails from "./ViewDetails"

const documentColumn = ({ getList, isAllow, other }) => {
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
        Header: "NIK",
        accessor: "nikNo",
      },
      {
        Header: "NIM",
        accessor: "nim",
      },
      {
        Header: "Name",
        accessor: "firstName",
      },
      {
        Header: "Email Id",
        accessor: "email",
        Cell: ({ row }) => <div>{row.original?.emails?.[0]?.email}</div>,
      },
      {
        Header: "University",
        accessor: "universityNm",
      },
      {
        Header: "Documents (Upload Date)",
        accessor: "documents",
        Cell: ({ row: { original = {} } }) =>
          original?.documents?.length > 0 ? <CoursesAppliedList documents={original.documents} /> : "",
      },
      ...(isAllow(MODULE_ACTIONS.VERIFYDOCUMENT)
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
                    ViewFrom: (properties_) => (
                      <ViewDetails
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
                    title: "Update Applicant",
                    module: "users",
                    canEdit: false,
                    canView: isAllow(MODULE_ACTIONS.VERIFYDOCUMENT) && original?.documents?.length > 0,
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

export default documentColumn
