import React from "react"
import ReactHtmlParser from "react-html-parser"

const AboutUsMobile = ({ data }) => {
  return (
    <div className="wrapper-MinHeight px-4 mx-auto max-w-7xl sm:px-6 lg:px-8 w-full">
      <div className="container staticText mx-auto">{ReactHtmlParser(data?.details)}</div>
    </div>
  )
}

export default AboutUsMobile
