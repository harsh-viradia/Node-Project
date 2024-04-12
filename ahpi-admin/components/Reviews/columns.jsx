/* eslint-disable no-unsafe-optional-chaining */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import React, { useMemo, useState } from "react"
import StarRatings from "react-star-ratings"
import ReactTooltip from "react-tooltip"
import { DATE_TIME_FORMAT, MODULE_ACTIONS } from "utils/constant"
import { dateDisplay } from "utils/util"
import ToggleButton from "widgets/toggle"

const OrderColumn = ({ permission, isAllow, ...other }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(other?.currentPage - 1) * other?.perPage + row.index + 1}</div>,
      },
      {
        Header: "Name",
        accessor: "fullName",
      },
      {
        Header: "Review",
        accessor: "review",
        Cell: ({ row }) => (
          <>
            <div className="relative inline-block" data-tip data-type="light" data-for={`discTip-${row.original._id}`}>
              <div className="truncate max-w-xs cursor-help">{row.original?.desc}</div>
            </div>
            <ReactTooltip
              border={10}
              id={`discTip-${row.original._id}`}
              place="top"
              effect="solid"
              borderColor="#dfdfdf"
              className="!p-2.5 !opacity-100 !rounded-md shadow-sm"
            >
              <div className="text-xs leading-relaxed line-clamp-5 max-w-xs whitespace-normal font-semibold">
                {row.original?.desc}
              </div>
            </ReactTooltip>
          </>
        ),
      },
      {
        Header: "Course Name",
        accessor: "courseId.title",
      },
      {
        Header: "Review Rating",
        accessor: "reviewRating",
        Cell: ({ row: { original } }) => {
          return (
            <div>
              <StarRatings
                rating={original?.stars}
                starDimension="17px"
                starSpacing="1px"
                starRatedColor="#f0b831"
                numberOfStars={5}
              />
            </div>
          )
        },
      },
      {
        Header: "Date",
        accessor: "createdAt",
        Cell: ({ row: { original = {} } }) => dateDisplay(original?.createdAt, DATE_TIME_FORMAT),
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
                      actionProps={{ module: "reviews", action: "partialUpdate" }}
                      setList={other?.setList}
                      list={other?.list}
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
    [other?.list]
  )
  return { columns }
}
export default OrderColumn
