import ResetPassword from "components/Auth/resetPassword"
import { getCookie } from "cookies-next"
import React from "react"
import { KEYS } from "utils/constant"
import routes from "utils/routes"

const resetPassword = () => {
  return <ResetPassword />
}

export default resetPassword

export async function getServerSideProps({ req, res }) {
  const forgetEmail = await getCookie(KEYS.forgetEmail, { req, res })

  if (!forgetEmail) {
    return {
      redirect: {
        destination: routes.login,
        permanent: false,
      },
    }
  }
  return { props: {} }
}
