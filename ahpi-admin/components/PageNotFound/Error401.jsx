import React from "react"

import CommonError from "./CommonError"

const Error401 = () => {
  return (
    <CommonError
      errorcode="401"
      title="No authorization was found."
      subtext="This page is not publicly available to access. Please login first."
    />
  )
}

export default Error401
