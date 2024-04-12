import Register from "components/Auth/register"
import { getCookie } from "cookies-next"
import React from "react"
import routes from "utils/routes"

const register = () => {
  return <Register />
}

export default register

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
