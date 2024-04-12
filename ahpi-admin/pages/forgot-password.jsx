import ForgotPassword from "components/Auth/forgotPassword"
import React from "react"

import redirectIfAuthenticated from "../utils/handleAuth"

const ForgotPasswordIndex = () => {
  return <ForgotPassword />
}

export default ForgotPasswordIndex

// eslint-disable-next-line unicorn/prevent-abbreviations
export const getServerSideProps = redirectIfAuthenticated()
