import ForgotPassword from "components/Auth/forgotPassword"
import { getCookie } from "cookies-next"
import React from "react"
import routes from "utils/routes"

const forgotPassword = () => {
  return <ForgotPassword />
}

export default forgotPassword

export async function getServerSideProps({ req, res }) {
  const token = getCookie("token", { req, res })

  if (token) {
    return {
      redirect: {
        destination: routes.home,
        permanent: false,
      },
    }
  }
  return { props: {} }
}
