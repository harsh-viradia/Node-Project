import ResetPassword from "components/Auth/resetPassword"
import { getCookie } from "cookies-next"
import React from "react"
import { KEYS } from "utils/constant"
import routes from "utils/routes"
// import { redirectIfNotForGetEmail } from "utils/handleAuth"

const ResetPasswordIndex = () => {
  return <ResetPassword />
}

export default ResetPasswordIndex

// eslint-disable-next-line unicorn/prevent-abbreviations
export async function getServerSideProps({ req, res }) {
  const forgetEmail = getCookie(KEYS.forgetEmail, { req, res })

  if (!forgetEmail) {
    return {
      redirect: {
        permanent: false,
        destination: routes.login,
      },
    }
  }
  return { props: {} }
}
