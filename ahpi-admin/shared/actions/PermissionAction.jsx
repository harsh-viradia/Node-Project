/* eslint-disable no-underscore-dangle */
import LockIcon from "icons/lockIcon"
import { useRouter } from "next/router"
import React from "react"
import ReactTooltip from "react-tooltip"
import routes from "utils/routes"

const PermissionActions = ({ data = {} }) => {
  const router = useRouter()
  const onEdit = () => {
    router.push(`${routes.permissions}?roleId=${data._id}&roleCode=${data.code}&roleName=${data.name}`)
  }

  return (
    <>
      <span data-tip="Click For Permission" className="cursor-pointer">
        <LockIcon onClick={onEdit} />
      </span>
      <ReactTooltip effect="solid" />
    </>
  )
}

export default PermissionActions
