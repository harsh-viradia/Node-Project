import React from "react"

import CommonError from "./CommonError"

const Error503 = () => {
  return (
    <CommonError
      errorcode="503"
      title="Sorry, We're under maintenance!"
      subtext="Hang on till we get the error fixed you may also refresh the page or try again later"
    />
  )
}

export default Error503
