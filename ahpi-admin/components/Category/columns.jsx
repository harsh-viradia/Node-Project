/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable react/button-has-type */
/* eslint-disable react/no-unstable-nested-components */
import { hasAccessTo } from "@knovator/can"
import EditIcon from "icons/editIcon"
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import SeoActions from "shared/actions/seoActions"
import { CACHE_KEY, MODULE_ACTIONS, MODULES } from "utils/constant"
import OrbitLink from "widgets/orbitLink"
import ToggleButton from "widgets/toggle"

const categoryColumns = ({ dt, setOpen, setOpen1, isAllow, list, permission, showSlug }) => {
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
        accessor: "image.uri",
        Cell: ({ row }) => {
          return row.original.image?.uri ? (
            <img src={row.original.image.uri} alt="" className="object-cover w-6 h-6 rounded-full" />
          ) : (
            <div />
          )
        },
      },
      {
        Header: "Program Name",
        accessor: "name",
      },
      ...(showSlug
        ? [
            {
              Header: "Slug",
              accessor: "slug",
            },
            {
              Header: "Parent Program",
              accessor: "parentCategory",
              Cell: ({
                row: {
                  original: { parentCategory = [] },
                },
              }) => {
                return parentCategory.map((parent) => `${parent.name} `)
              },
            },
          ]
        : []),
      // {
      //   Header: "Description",
      //   accessor: "description",
      //   Cell: ({ row: { original = {} } }) => (
      //     <>
      //       <div className="relative inline-block" data-tip data-type="light" data-for={`discTip-${original._id}`}>
      //         <div className="max-w-sm line-clamp-1 cursor-help">{ReactHtmlParser(original.description)}</div>
      //       </div>
      //       <ReactTooltip
      //         border={10}
      //         id={`discTip-${original._id}`}
      //         place="top"
      //         effect="solid"
      //         borderColor="#dfdfdf"
      //         className="!p-2.5 !opacity-100 !rounded-md shadow-sm"
      //       >
      //         <div className="max-w-md text-xs font-semibold leading-relaxed whitespace-normal line-clamp-5">
      //           {ReactHtmlParser(original.description)}
      //         </div>
      //       </ReactTooltip>
      //     </>
      //   ),
      // },
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
                      actionProps={{
                        module: "category",
                        action: "partialUpdate",
                        config: {
                          headers: {
                            [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.CATEGORY,
                          },
                        },
                      }}
                      setList={dt.setList}
                      list={list}
                      pagination={{
                        offset: dt?.offset,
                        perPage: dt?.limit,
                      }}
                    />
                  </div>
                )
              },
            },
          ]
        : []),
      ...(hasAccessTo(permission, MODULES.SEO, MODULE_ACTIONS.GET) ||
      isAllow(MODULE_ACTIONS.UPDATE) ||
      isAllow(MODULE_ACTIONS.DELETE)
        ? [
            {
              Header: "Action",
              accessor: "action",
              Cell: ({ row }) => {
                return (
                  <div className="flex items-center gap-3">
                    {hasAccessTo(permission, MODULES.SEO, MODULE_ACTIONS.GET) && (
                      <OrbitLink
                        onClick={() => {
                          setOpen1(true)
                          dt?.setEditId(row.original)
                        }}
                      >
                        <SeoActions />
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
                        <div data-tip="Click To Edit" className="sell-center">
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
                        module: "category",
                        canDelete: isAllow(MODULE_ACTIONS.DELETE),
                        softDelete: true,
                        fieldToDisplay: "name",
                        config: {
                          headers: {
                            [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.CATEGORY,
                          },
                        },
                      }}
                    />
                  </div>
                )
              },
            },
          ]
        : []),
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [list]
  )
  return { columns }
}

export default categoryColumns
