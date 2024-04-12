import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import Button from "widgets/button"

import AddRoles from "./AddRoles"
import rolesColumn from "./columns"
import useRole from "./hooks/useRole"

const Roles = ({ permission, user = {} }) => {
  const [open, setOpen] = useState(false)
  const dt = useRole({ permission })
  return (
    <LayoutWrapper
      title="Roles"
      user={user}
      headerDetail={
        <div className="flex items-center gap-3">
          {dt.isAllow(MODULE_ACTIONS.CREATE) && (
            <Button icon={<AddIcon size="10px" />} title="Add Role" onClick={() => setOpen(true)} />
          )}
        </div>
      }
      permission={permission}
    >
      {dt.isAllow(MODULE_ACTIONS.GETALL) && (
        <Table
          columns={
            rolesColumn({
              getList: dt.getList,
              isAllow: dt.isAllow,
              role: permission?.roles?.[0],
              dt,
              permission,
            }).columns
          }
          data={dt.list}
          loading={dt.loading}
          onPaginationChange={dt.onPaginationChange}
          page={dt.currentPage}
          totalPages={dt.pageCount}
          limit={dt.perPage}
          itemCount={dt.itemCount}
          currentPageCount={dt.list.length}
        />
      )}
      <AddRoles open={open} setOpen={setOpen} getList={dt.getList} permission={permission} />
    </LayoutWrapper>
  )
}

export default Roles
