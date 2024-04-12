/* eslint-disable import/extensions */
// import useTranslation from "next-translate/useTranslation"
import React from "react"
import AuthHeader from "shared/authHeader"
// import routes from "utils/routes"
// import OrbitLink from "widgets/orbitLink"

const AuthWrapper = ({ children, maxWidth = "max-w-xl" }) => {
  // const { t } = useTranslation("auth")

  return (
    <>
      <AuthHeader />
      <div className=" flex items-center justify-center bg-accent py-10  min-h-screen">
        <div className="container px-4 mx-auto">
          <div className={`${maxWidth} w-full mx-auto`}>
            <div className="gap-6 p-6 sm:p-12 mx-auto bg-white rounded-lg my-auto shadow-lg border border-gray">
              {children}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default AuthWrapper
