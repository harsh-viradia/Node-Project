import Login from "components/Auth/login"
import { getCookie } from "cookies-next"
import React from "react"
import routes from "utils/routes"

const login = () => {
  return <Login />
}

export default login

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
