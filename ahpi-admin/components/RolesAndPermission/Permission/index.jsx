/* eslint-disable no-underscore-dangle */
import BackIcon from "icons/backIcon"
import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS } from "utils/constant"
import routes from "utils/routes"
import { addTitleSpace } from "utils/util"
import Button from "widgets/button"
import OrbitLink from "widgets/orbitLink"

import Checkbox from "../../../widgets/checkbox"
import AddRoles from "../Roles/AddRoles"
import usePermission from "./hooks/usePermission"

const Permission = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)
  const router = useRouter()
  const {
    permissionList = {},
    loading = true,
    loading2,
    permissionData = {},
    onUpdatePermission,
    checkBoxList,
    isAllow,
    setCheckBoxList,
  } = usePermission({ permission })
  const data = permissionList ? Object.entries(permissionList) : []

  useEffect(() => {
    const list = []
    const temporary = data.flatMap(([, x]) => x)
    for (const { _id: id, selected } of temporary) {
      if (selected) {
        list.push(id)
      }
    }

    setCheckBoxList(list)
  }, [permissionData, permissionList])

  const handleCheckbox = (e) => {
    const list = [...checkBoxList]
    const { checked, id } = e.target
    if (checked) {
      if (!checkBoxList.includes(id)) {
        list.push(id)
      }
      setCheckBoxList(list)
    } else {
      const result = list.filter((x) => x !== id)
      setCheckBoxList(result)
    }
  }
  const code = router.query?.roleCode !== "ADMIN"

  return (
    <LayoutWrapper
      title={
        <div className="flex items-center gap-2 font-bold">
          <OrbitLink href={routes.roles}>
            <BackIcon />
          </OrbitLink>
          <span>{router.query?.roleName}</span>
        </div>
      }
      permission={permission}
      loading={loading}
      user={user}
      headerDetail={
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.UPDATE_PERMISSION) && code && (
            <Button title="Update" onClick={onUpdatePermission} loading={loading2} />
          )}
        </div>
      }
    >
      <div className="grid grid-cols-2 gap-3">
        {data.map(([name, module]) => {
          return (
            <div className="p-3 bg-white rounded-lg shadow">
              <p className="text-base font-bold capitalize">{addTitleSpace(name)}</p>
              <div className="grid grid-cols-3 gap-3 mt-3">
                {module.map((list) => {
                  return (
                    <Checkbox
                      title={addTitleSpace(list.route_name)}
                      key={`${name}-${list._id}`}
                      // eslint-disable-next-line no-underscore-dangle
                      id={list._id}
                      checked={checkBoxList.includes(list._id)}
                      onChange={handleCheckbox}
                    />
                  )
                })}
              </div>
            </div>
          )
        })}
      </div>
      <AddRoles open={open} setOpen={setOpen} permission={permission} />
    </LayoutWrapper>
  )
}

export default Permission
