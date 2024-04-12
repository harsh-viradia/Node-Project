import Login from "components/Auth/login"
import React from "react"
import redirectIfAuthenticated from "utils/handleAuth"

const LoginIndex = () => {
  return <Login />
}

export default LoginIndex

// eslint-disable-next-line unicorn/prevent-abbreviations
export const getServerSideProps = redirectIfAuthenticated()
