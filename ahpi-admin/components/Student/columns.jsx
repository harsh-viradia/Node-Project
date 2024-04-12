/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
import LockIcon from "icons/lockIcon"
// import VerifyIcon from "icons/verifyIcon"
import React, { useMemo } from "react"
import ReactTooltip from "react-tooltip"
import TableActions from "shared/actions"
import { MODULE_ACTIONS, USER_STATUS, USER_STATUS_COLOR } from "utils/constant"
import { dateDisplay } from "utils/util"
import Status from "widgets/status"
import ToggleButton from "widgets/toggle"

import AddStudent from "./AddStudent"
import CoursesAppliedLists from "./CourseAppliedList"
import ViewDetails from "./ViewDetails"

const studentColumn = ({ getListData, getList, isAllow, other, permission }) => {
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
        Header: "ID",
        accessor: "studentId",
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
        Header: "Applied Date",
        accessor: "appliedDate",
        Cell: ({ row }) => (row.original?.appliedDate ? <div>{`${dateDisplay(row.original?.appliedDate)}`}</div> : ""),
      },
      {
        Header: "Name",
        accessor: "name",
        Cell: ({ row }) => (
          <div>
            {row.original?.firstName} {row.original?.lastName}
          </div>
        ),
      },
      {
        Header: "University",
        accessor: "universityNm",
      },
      {
        Header: "Major",
        accessor: "majorNm",
      },
      {
        Header: "Courses Applied",
        accessor: "coursesApplied",
        Cell: ({ row }) => (
          <div>{row.original?.courses?.length ? <CoursesAppliedLists courses={row.original?.courses} /> : ""}</div>
        ),
      },
      {
        Header: "IPK",
        accessor: "ipk",
      },
      {
        Header: "Semester",
        accessor: "semesterNm",
      },
      {
        Header: "Entry Year",
        accessor: "entryYear",
      },
      {
        Header: "Entry Status",
        accessor: "entryStsNm",
      },
      {
        Header: "University Type",
        accessor: "universityTypeNm",
      },
      {
        Header: "Email Id",
        accessor: "email",
        Cell: ({ row }) => <div>{row.original?.emails?.[0]?.email}</div>,
      },
      {
        Header: "Phone No",
        accessor: "mobile",
        Cell: ({ row }) => <div>{row.original?.mobile?.no || ""}</div>,
      },
      {
        Header: "Status",
        accessor: "status",
        Cell: ({ row }) =>
          row.original?.stsNm ? (
            <Status statusName={row.original.stsNm} color={USER_STATUS_COLOR[row.original.stsNm]} />
          ) : (
            ""
          ),
      },
      {
        Header: "Remark",
        accessor: "reason",
        Cell: ({ row }) => (
          <div>{row.original.stsNm === USER_STATUS.systemRejected ? row.original?.reasonId?.name : ""}</div>
        ),
      },
      {
        Header: "Document Status",
        accessor: "isDocumentVerified",
        Cell: ({ row }) => (
          <div className="flex justify-center">
            {row.original.isDocumentVerified ? (
              <div data-tip="Documents Are Verified" data-for="isDocumentVerified">
                <img src="/images/verify.svg" alt="" className="w-5" />
              </div>
            ) : row.original.documents?.length === 0 ? (
              <div data-tip="Documents Not Uploaded" data-for="isDocumentVerified">
                <img src="/images/pending.svg" alt="" className="w-5" />
              </div>
            ) : row.original.documents?.find((x) => x.isVerified === false) ? (
              <div data-tip="Documents Rejected" data-for="isDocumentVerified">
                <img src="/images/reject.svg" alt="" className="w-5" />
              </div>
            ) : (
              <div data-tip="Documents Not Verified" data-for="isDocumentVerified">
                <LockIcon />
              </div>
            )}
            <ReactTooltip effect="solid" id="isDocumentVerified" />
          </div>
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
                      actionProps={{ module: "student" }}
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
      ...(isAllow(MODULE_ACTIONS.UPDATE) ||
      isAllow(MODULE_ACTIONS.DELETE) ||
      isAllow(MODULE_ACTIONS.QUESTIONLIST) ||
      isAllow(MODULE_ACTIONS.DOCUMENTLIST)
        ? [
            {
              Header: "Actions",
              accessor: "actions",
              style: {
                width: 100,
                maxWidth: 100,
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
                      <AddStudent
                        {...properties_}
                        getList={getList}
                        pagination={{
                          offset: other?.offset,
                          perPage: other?.perPage,
                        }}
                        permission={permission}
                      />
                    ),
                    ViewFrom: (properties_) => (
                      <ViewDetails
                        {...properties_}
                        getList={getList}
                        getListData={getListData}
                        pagination={{
                          offset: other?.offset,
                          perPage: other?.perPage,
                        }}
                        isAllow={isAllow}
                      />
                    ),
                    list: getList,
                  }}
                  actionProps={{
                    softDelete: true,
                    title: "Update Applicant",
                    module: "student",
                    canEdit: isAllow(MODULE_ACTIONS.UPDATE),
                    canDelete: original.canDel && isAllow(MODULE_ACTIONS.DELETE),
                    canView: isAllow(MODULE_ACTIONS.QUESTIONLIST) || isAllow(MODULE_ACTIONS.DOCUMENTLIST),
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
export default studentColumn
