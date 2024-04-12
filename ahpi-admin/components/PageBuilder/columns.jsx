/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import { hasAccessTo } from "@knovator/can"
import React, { useMemo } from "react"
import TableActions from "shared/actions"
import SeoActions from "shared/actions/seoActions"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import OrbitLink from "widgets/orbitLink"

import ChooseWidgets from "./ChooseWidgetsFrom"

const pageColumn = ({ getList, setOpen, setData, paginator, isAllow, permission }) => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
        Cell: ({ row }) => <div>{(paginator.currentPage - 1) * paginator.perPage + row.index + 1}</div>,
      },
      {
        Header: "Page Name",
        accessor: "name",
      },
      {
        Header: "Slug",
        accessor: "slug",
      },
      // {
      //   Header: "Active",
      //   accessor: "isActive",
      //   style: {
      //     width: 64,
      //     maxWidth: 64,
      //   },
      //   Cell: ({ row: { original = {} } }) => {
      //     return (
      //       <div className="text-center">
      //         <ToggleButton
      //           original={original}
      //           actionProps={{ module: "student" }}
      // getList={getList}
      // pagination={{
      //   offset: other?.offset,
      //   perPage: other?.perPage,
      // }}
      //         />
      //       </div>
      //     )
      //   },
      // },
      ...(hasAccessTo(permission, MODULES.SEO, MODULE_ACTIONS.GET) || isAllow(MODULE_ACTIONS.UPDATE)
        ? [
            {
              Header: "Actions",
              accessor: "actions",
              style: {
                width: 74,
                maxWidth: 74,
              },
              Cell: ({ row: { original = {} } }) => {
                return (
                  <div className="flex items-center gap-3">
                    {isAllow(MODULE_ACTIONS.UPDATE) && (
                      <TableActions
                        original={original}
                        getList={getList}
                        components={{
                          SelectWidgets: (properties_) => <ChooseWidgets {...properties_} />,
                        }}
                        actionProps={{
                          softDelete: true,
                          module: "page",
                          canEdit: false,
                          canDelete: false,
                          canPageBuilder: true,
                        }}
                      />
                    )}
                    {hasAccessTo(permission, MODULES.SEO, MODULE_ACTIONS.GET) && (
                      <OrbitLink
                        href="#"
                        onClick={() => {
                          setOpen(true)
                          setData(original)
                        }}
                      >
                        <SeoActions />
                      </OrbitLink>
                    )}
                  </div>
                )
              },
            },
          ]
        : []),
    ],
    [getList]
  )
  return { columns }
}
export default pageColumn
