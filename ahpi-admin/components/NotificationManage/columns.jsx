/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import EditIcon from "icons/editIcon"
import ResendIcon from "icons/resendIcon"
import React, { useMemo } from "react"
import ReactHtmlParser from "react-html-parser"
import ReactTooltip from "react-tooltip"
import TableActions from "shared/actions"
import { DATE_TIME_FORMAT, MODULE_ACTIONS, NOTIFICATION_TYPE } from "utils/constant"
import { dateDisplay } from "utils/util"
import OrbitLink from "widgets/orbitLink"
import ToggleButton from "widgets/toggle"

const NotificationColumn = ({ dt, setOpen, isAllow, list }) => {
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
        Header: "Image",
        accessor: "imgId",
        Cell: ({ row }) => {
          return row.original.imgId?.uri ? (
            <img src={row.original.imgId.uri} alt="" className="object-cover w-6 h-6 rounded-full" />
          ) : (
            <div />
          )
        },
      },
      {
        Header: "Name",
        accessor: "nm",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "desc",
        Cell: ({ row: { original = {} } }) => (
          <>
            <div className="relative inline-block" data-tip data-type="light" data-for={`discTip-${original._id}`}>
              <div className="line-clamp-1 cursor-help max-w-xs">{ReactHtmlParser(original.desc)}</div>
            </div>
            <ReactTooltip
              border={10}
              id={`discTip-${original._id}`}
              place="top"
              effect="solid"
              borderColor="#dfdfdf"
              className="!p-2.5 !opacity-100 !rounded-md shadow-sm"
            >
              <div className="text-xs leading-relaxed line-clamp-5 max-w-xs whitespace-normal font-semibold">
                {ReactHtmlParser(original.desc)}
              </div>
            </ReactTooltip>
          </>
        ),
      },
      {
        Header: "Type",
        accessor: "typeId.name",
      },
      {
        Header: "Criteria Type",
        accessor: "criteriaId.name",
      },
      {
        Header: "Start Date",
        accessor: "startDate",
        Cell: ({ row: { original = {} } }) => dateDisplay(original.startDt, DATE_TIME_FORMAT),
      },
      {
        Header: "End Date",
        accessor: "endDate",
        Cell: ({ row: { original = {} } }) => dateDisplay(original.endDt, DATE_TIME_FORMAT),
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
                  <ToggleButton
                    original={original}
                    actionProps={{ module: "notification", action: "partialUpdate" }}
                    setList={dt.setList}
                    list={list}
                    pagination={{
                      offset: dt?.offset,
                      perPage: dt?.limit,
                    }}
                  />
                )
              },
            },
          ]
        : []),
      ...(isAllow(MODULE_ACTIONS.UPDATE) || isAllow(MODULE_ACTIONS.DELETE || isAllow(MODULE_ACTIONS.SEND))
        ? [
            {
              Header: "Action",
              accessor: "action",
              Cell: ({ row }) => {
                return (
                  <div className="flex items-center gap-3">
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
                        list: dt.getList,
                      }}
                      actionProps={{
                        module: "notification",
                        canDelete: isAllow(MODULE_ACTIONS.DELETE),
                        softDelete: true,
                        fieldToDisplay: "nm",
                      }}
                    />
                    {isAllow(MODULE_ACTIONS.SEND) &&
                      row.original?.typeId?.code === NOTIFICATION_TYPE.GENERAL &&
                      row.original?.isActive && (
                        <OrbitLink
                          dataTip="Click to Send Notification"
                          onClick={() => dt?.sendNotification(row.original?._id)}
                        >
                          <ResendIcon size="16px" className="text-primary" />
                          <ReactTooltip effect="solid" />
                        </OrbitLink>
                      )}
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
export default NotificationColumn
