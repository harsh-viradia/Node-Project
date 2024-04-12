/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import { hasAccessOf } from "@knovator/can"
import EditIcon from "icons/editIcon"
import PayOutIcon from "icons/payOutIcon"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"
import ToggleButton from "widgets/toggle"

const InstructorColumn = ({ dt, setOpen, isAllow, list, permission, deleteAction }) => {
  const router = useRouter()
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
        Header: "Profile Image",
        accessor: "profileId.uri",
        Cell: ({ row }) => {
          return row.original.profileId?.uri ? (
            <img
              // eslint-disable-next-line no-unsafe-optional-chaining
              src={row.original?.profileId?.uri}
              alt=""
              className="object-cover w-6 h-6 rounded-full"
            />
          ) : (
            <div />
          )
        },
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Company Name",
        accessor: "companyNm",
      },
      {
        Header: "Email Id",
        accessor: "email",
      },
      {
        Header: "Phone No",
        accessor: "mobNo",
        Cell: ({ row }) => {
          return `${row.original.countryCode || ""} ${row.original.mobNo || ""}`
        },
      },
      {
        Header: "No Of Courses",
        accessor: "noOfCourses",
        Cell: ({ row }) => {
          return row.original.agreement?.courseLimit || 0
        },
      },
      {
        Header: "Courses Approval",
        accessor: "coursesApproval",
        Cell: ({ row }) => {
          return row.original.agreement?.isApproved ? "Yes" : " No"
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
                      actionProps={{ module: "instructor", action: "partialUpdate" }}
                      setList={dt.setList}
                      list={list}
                      // pagination={{
                      //   offset: other?.offset,
                      //   perPage: other?.perPage,
                      // }}
                    />
                  </div>
                )
              },
            },
          ]
        : []),
      ...(isAllow(MODULE_ACTIONS.UPDATE) || isAllow(MODULE_ACTIONS.DELETE) || hasAccessOf(permission, MODULES.PAYOUT)
        ? [
            {
              Header: "Action",
              accessor: "action",
              Cell: ({ row }) => {
                return (
                  <>
                    {" "}
                    <div className="flex items-center gap-3">
                      {hasAccessOf(permission, MODULES.PAYOUT) && (
                        <OrbitLink
                          onClick={() => {
                            router.push(`${routes.addPayout}?payUser=${row.original._id}&userName=${row.original.name}`)
                          }}
                        >
                          <div data-tip="Payout" className="sell-center">
                            <PayOutIcon size="14px" />
                          </div>
                        </OrbitLink>
                      )}
                      {isAllow(MODULE_ACTIONS.UPDATE) && (
                        <OrbitLink
                          href="#"
                          onClick={() => {
                            setOpen(true)
                            dt?.setEditId(row.original)
                          }}
                        >
                          <div data-tip="Edit" className="sell-center">
                            <EditIcon size="14px" />
                          </div>
                        </OrbitLink>
                      )}
                      <TableActions
                        original={row.original}
                        pagination={{
                          itemcount: dt?.itemcount,
                          offset: dt?.offset,
                          perPage: dt?.perPage,
                        }}
                        components={{
                          list: () => deleteAction(dt?.perPage, dt?.offset, dt?.itemcount),
                        }}
                        actionProps={{
                          module: "instructor",
                          canDelete: isAllow(MODULE_ACTIONS.DELETE),
                          softDelete: true,
                          fieldToDisplay: "name",
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
export default InstructorColumn
