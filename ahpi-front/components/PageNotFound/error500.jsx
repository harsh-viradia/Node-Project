import React from "react"

import CommonError from "./commonError"

const Error500 = () => {
  return (
    <CommonError
      errorcode="500"
      title="Sorry, unexpected error"
      subtext="We are working on fixing the problem. Be back soon"
    />
  )
}

export default Error500
