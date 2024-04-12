import OTP from "components/Auth/otp"
import { getCookie } from "cookies-next"
import React from "react"
import { KEYS } from "utils/constant"
import routes from "utils/routes"

const otp = () => {
  return <OTP />
}

export default otp

export async function getServerSideProps({ req, res }) {
  const email = getCookie(KEYS.email, { req, res })

  if (!email) {
    return {
      redirect: {
        destination: routes.login,
        permanent: false,
      },
    }
  }
  return { props: {} }
}
