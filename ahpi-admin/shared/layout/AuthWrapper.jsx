/* eslint-disable import/extensions */
import React from "react"

const AuthWrapper = ({ children, maxWidth = "max-w-xl" }) => {
  return (
    <div className=" flex items-center justify-center min-h-screen bg-accent py-10">
      <div className="container px-4 mx-auto">
        <div className={`${maxWidth} w-full mx-auto`}>
          <div className="gap-6 p-6 sm:p-12 mx-auto bg-white rounded-lg my-auto shadow-lg border border-gray">
            <img src="../images/logo1.png" className="mb-5 sm:mb-8 h-12 mx-auto" alt="" />
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AuthWrapper
