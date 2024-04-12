/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
import EditIcon from "icons/editIcon"
import { useRouter } from "next/router"
import React, { useMemo } from "react"
import ReactTooltip from "react-tooltip"
import TableActions from "shared/actions"
import { MODULE_ACTIONS } from "utils/constant"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"
import Status from "widgets/status"
import ToggleButton from "widgets/toggle"

const courseColumns = ({ getList, isAllow, other, getCourseCounts }) => {
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
        Cell: ({ row }) => (
          <div className="flex ">
            <div>{(other.currentPage - 1) * other.perPage + row.index + 1}</div>
            {row?.original?.isReject ? (
              <div className="h-2 w-2 bg-red rounded-full" />
            ) : row.original?.isPreview ? (
              <div className="h-2 w-2 bg-yellow rounded-full" />
            ) : (
              ""
            )}
          </div>
        ),
      },
      {
        Header: "Image",
        style: {
          width: 42,
          minWidth: 42,
        },
        accessor: "imgId",
        Cell: ({ row }) => (
          <div>
            {row?.original?.imgId?.uri && (
              <div className="flex items-center justify-center">
                <img src={row.original?.imgId?.uri} className="w-6 h-6 rounded-full" alt={row.original.imgId.name} />
              </div>
            )}
          </div>
        ),
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Partner",
        accessor: "userId",
        Cell: ({ row }) => <div>{row?.original?.userId?.name}</div>,
      },
      {
        Header: "Primary Program",
        accessor: "parCategory",
        Cell: ({ row }) => <div>{row?.original?.parCategory?.[0]?.name}</div>,
      },
      {
        Header: "Status",
        accessor: "status",
        style: {
          width: 100,
          maxWidth: 100,
        },
        Cell: ({ row }) => (
          <div>
            <Status
              light={false}
              className="absolute inset-0 rounded-none"
              statusName={row?.original?.sts !== 1 ? "Published" : "Draft"}
              color={row?.original?.sts !== 1 ? "green" : undefined}
            />
          </div>
        ),
      },
      ...(isAllow(MODULE_ACTIONS.PREVIEW_COUNT)
        ? [
            {
              Header: "Preview",
              accessor: "isPreview",
              style: {
                width: 100,
                maxWidth: 100,
              },
              Cell: ({ row }) => (
                <OrbitLink onClick={() => other?.setPreview(row.original)}>
                  <Status
                    light={false}
                    className="absolute inset-0 rounded-none"
                    statusName="Preview"
                    color={row?.original?.isReject ? "red" : row?.original?.isPreview ? "yellow" : "green"}
                  />
                </OrbitLink>
              ),
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
                      actionProps={{ module: "courses" }}
                      setList={other.setList}
                      list={other.list}
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
      ...(isAllow(MODULE_ACTIONS.GET) && isAllow(MODULE_ACTIONS.DELETE)
        ? [
            {
              Header: "Actions",
              accessor: "actions",
              style: {
                width: 74,
                maxWidth: 74,
              },
              Cell: ({ row: { original = {} } }) => (
                <div className="flex items-center gap-3">
                  {isAllow(MODULE_ACTIONS.GET) && (
                    <OrbitLink
                      onClick={() =>
                        router.push({
                          pathname: routes.editCourse,
                          query: {
                            courseId: original?._id,
                            coachId: original?.userId?._id,
                            offset: other?.offset,
                            limit: other?.perPage,
                          },
                        })
                      }
                      className="relative cursor-pointer"
                    >
                      <span data-tip="Click To Edit">
                        <EditIcon size="14px" fill="#fff" />
                      </span>
                    </OrbitLink>
                  )}
                  <ReactTooltip effect="solid" />
                  {isAllow(MODULE_ACTIONS.DELETE) && (
                    <TableActions
                      pagination={{
                        itemCount: other?.itemCount,
                        offset: other?.offset,
                        perPage: other?.perPage,
                      }}
                      components={{
                        list: (offset, limit) => {
                          getList(offset, limit)
                          getCourseCounts()
                        },
                      }}
                      original={original}
                      actionProps={{
                        softDelete: true,
                        module: "courses",
                        canDelete: true,
                        payload: { itemName: original?.title },
                        fieldToDisplay: "title",
                      }}
                    />
                  )}
                </div>
              ),
            },
          ]
        : []),
    ],
    [other.list]
  )
  return { columns }
}

export default courseColumns
