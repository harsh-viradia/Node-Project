import React from "react"

import CommonError from "./commonError"

const Error403 = () => {
  return (
    <CommonError
      errorcode="403"
      title="We are Sorry..."
      subtext="The page you're trying to access has restricted access. please refer to your system administrator"
    />
  )
}

export default Error403
