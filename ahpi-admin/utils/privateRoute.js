import { hasAccessOf, hasAccessTo } from "@knovator/can"
import { getCookie, hasCookie } from "cookies-next"
import { withSessionSsr } from "lib/withSession"
import routes from "utils/routes"

const privateRoute = (properties = {}) => {
  const { moduleName = "", moduleActionName = "" } = properties
  return withSessionSsr(async (context) => {
    const { req, res } = context
    const { token, user = {} } = req.session
    const permission = hasCookie("orbit-skills-admin", { req, res })
      ? JSON.parse(getCookie("orbit-skills-admin", { req, res }))
      : {}
    if (!token) {
      return {
        redirect: {
          destination: routes.login,
          permanent: false,
        },
      }
    }
    if (
      moduleActionName
        ? !hasAccessTo(permission, moduleName, moduleActionName)
        : moduleName && !hasAccessOf(permission, moduleName)
    ) {
      return {
        redirect: {
          destination: routes.error404Page,
          permanent: false,
        },
      }
    }
    return {
      props: { user, permission, token },
    }
  })
}
export default privateRoute
