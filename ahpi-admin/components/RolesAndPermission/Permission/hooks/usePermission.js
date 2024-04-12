/* eslint-disable promise/always-return */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { setCookie } from "cookies-next"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { DEFAULT_NEXT_API_HEADER, MODULE_ACTIONS, MODULES } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"

const usePermission = ({ permission }) => {
  const [permissionList, setPermissionList] = useState([])
  const [permissionData, setPermissionData] = useState([])
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [checkBoxList, setCheckBoxList] = useState()

  const id = router.query?.roleId

  const getPermissionByRole = async () => {
    setLoading(true)
    await commonApi({ action: "permissionByRole", parameters: [id] })
      .then(([, { data = {} }]) => {
        setPermissionList(data)
        setPermissionData(data)
      })
      .finally(() => setLoading(false))
  }

  // eslint-disable-next-line no-unused-vars
  const updateSessionPermissions = async (data) => {
    await fetch("/api/permission", {
      method: "POST",
      headers: DEFAULT_NEXT_API_HEADER,
      body: JSON.stringify(data),
    }).then(() => {
      return router.push(routes.roles)
    })
  }

  const updateUserPermissions = async () => {
    await commonApi({ action: "permissionByUser" }).then(async ([, { data }]) => {
      setCookie("orbit-skills-admin", JSON.stringify(data))
      setLoading(false)
      return router.push(routes.roles)
    })
  }

  const onUpdatePermission = async () => {
    const payload = {
      permissionIds: checkBoxList,
      // roleId: id,
    }
    try {
      setLoading2(true)
      await commonApi({
        action: "permissionUpdate",
        data: payload,
        parameters: [id],
      }).then(([, { message = "" }]) => {
        Toast(message, "success")
        updateUserPermissions()
        return false
      })
    } finally {
      setLoading2(false)
    }
  }
  const isAllow = (key) => hasAccessTo(permission, MODULES.PERMISSION, key)

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GET_PERMISSION)) {
      getPermissionByRole()
    }
  }, [id])

  return {
    loading,
    loading2,
    permissionList,
    permissionData,
    onUpdatePermission,
    checkBoxList,
    setCheckBoxList,
    isAllow,
  }
}

export default usePermission
