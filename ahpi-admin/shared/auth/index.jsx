import React from "react"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"

const AuthWrapper = ({ children, title }) => {
  return (
    <div className="flex flex-col min-h-screen pt-10 bg-secondary">
      <div className="flex items-center justify-center w-4/12 p-12 mx-auto my-auto text-center bg-white rounded-md shadow-lg">
        <div className="w-full">
          <div className="w-full mx-auto">
            <span className="relative block mb-3 text-3xl font-extrabold">
              <img src="/images/logo1.png" className="h-16 mx-auto mb-6" alt="" />
            </span>
            <h3 className="text-4xl font-bold text-foreground">{title}</h3>
            <div className="mt-8">{children}</div>
          </div>
        </div>
      </div>
      <div className="flex flex-wrap items-center justify-center gap-4 py-6 text-sm text-center">
        <OrbitLink
          onClick={() => window.open(routes.privacyPolicy, "_blank")}
          className="transition hover:text-primary"
        >
          Privacy Policy
        </OrbitLink>
        <span>|</span>
        <OrbitLink onClick={() => window.open(routes.termsOfUse, "_blank")} className="transition hover:text-primary">
          Terms & Conditions
        </OrbitLink>
      </div>
    </div>
  )
}

export default AuthWrapper
