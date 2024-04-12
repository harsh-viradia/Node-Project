import { withSessionSsr } from "lib/withSession"

import routes from "./routes"
// eslint-disable-next-line import/no-cycle, import/no-named-as-default
import isEmpty from "./util"

const redirectIfAuthenticated = () =>
  withSessionSsr(async ({ req }) => {
    return {
      ...(req.session?.token
        ? {
            redirect: {
              permanent: false,
              destination: routes.dashboard,
            },
          }
        : { props: {} }),
    }
  })

export const redirectIfNotAuthenticated = () =>
  withSessionSsr(async ({ req }) => {
    return {
      ...(!req.session?.token
        ? {
            redirect: {
              permanent: false,
              destination: routes.login,
            },
          }
        : { props: {} }),
    }
  })

export const handleMFA = () =>
  withSessionSsr(async ({ req }) => {
    return {
      ...(isEmpty(req.session?.user)
        ? {
            redirect: {
              permanent: false,
              destination: routes.login,
            },
          }
        : { props: { user: req.session?.user } }),
    }
  })

export const handleOTP = () =>
  withSessionSsr(async ({ req }) => {
    const data = req.session?.user || {}

    if (Object.keys(data).length === 0) {
      return {
        redirect: {
          permanent: false,
          destination: routes.login,
        },
        props: { user: data },
      }
    }
    if (req.session?.token) {
      return {
        redirect: {
          permanent: false,
          destination: routes.dashboard,
        },
      }
    }

    return { props: { user: data } }
  })

export const handleGoogleAuth = () =>
  withSessionSsr(async ({ req }) => {
    return {
      ...(isEmpty(req.session?.user || req.session?.user?.selectedMFA !== "google")
        ? {
            redirect: {
              permanent: false,
              destination: routes.mfa,
            },
            props: { user: req.session?.user },
          }
        : { props: { user: req.session?.user } }),
    }
  })

export const getAllPermissions = async () => {
  const { permission } = await fetch("/api/getPermission").then((response) => response.json())
  return permission
}
export default redirectIfAuthenticated
