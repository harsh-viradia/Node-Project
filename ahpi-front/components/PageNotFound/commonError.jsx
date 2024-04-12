/* eslint-disable jsx-a11y/img-redundant-alt */
import { useRouter } from "next/router"
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import routes from "utils/routes"
import Button from "widgets/button"

const CommonError = ({ errorcode, title, subtext }) => {
  const router = useRouter()
  return (
    <LayoutWrapper>
      <div className="py-16 sm:py-28">
        <div className="max-w-2xl m-auto text-center px-5">
          <img
            src={`/images/error-${errorcode}-img.svg`}
            className="m-auto max-w-xs sm:max-w-sm"
            alt={`Error ${errorcode}`}
          />
          <div className="relative mt-8 text-center">
            <h1>{title}</h1>
            <p className="text-xs sm:text-sm font-medium text-light text-mute mt-1">{subtext}</p>
            <Button className="mt-5 " title="Back to Home" onClick={() => router.push(routes.home)} primaryShadowBTN />
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default CommonError
