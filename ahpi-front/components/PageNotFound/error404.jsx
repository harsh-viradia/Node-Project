import React from "react"

import CommonError from "./commonError"

const Error404 = () => {
  return (
    <CommonError
      errorcode="404"
      title="Sorry we couldn't find this page"
      subtext="But don't worry, you can find plenty of other things on our homepage"
    />
  )
}

export default Error404
