// import getConfig from "next/config"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Footer from "shared/footer"
import AuthWrapper from "shared/wrapper/AuthWrapper"
import { REGEX } from "utils/regex"
import routes from "utils/routes"
import Button from "widgets/button"
import Input from "widgets/input"
import OrbitLink from "widgets/orbitLink"

import useForgotPassword from "./hooks/useForgotPassword"

// const { publicRuntimeConfig } = getConfig()
const ForgotPassword = () => {
  const { t } = useTranslation("auth")
  const router = useRouter()
  const { errors, register, handleSubmit, onSubmit, handleKeyPress, loading, setValue } = useForgotPassword()

  const handleEmailChange = (event) => {
    return (
      event.target.value && setValue("email", event.target.value.replace(REGEX.SPACE_REMOVE_REGEX, "").toLowerCase())
    )
  }

  return (
    <>
      <AuthWrapper>
        <h3 className="text-2xl font-bold text-center">{t("forgotPasswordTitle")}</h3>
        <p className="mt-3 text-xs sm:text-sm text-mute font-normal text-center mx-auto">{t("forgotDFirst")}</p>

        <div className="grid gap-4 mt-6">
          <Input
            label={t("email")}
            placeholder={t("enterEmail")}
            rest={register("email", {
              onChange: (event) => {
                handleEmailChange(event)
              },
            })}
            error={t(errors.email?.message)}
            onKeyDown={(event) => handleKeyPress(event)}
            disabled={loading}
            authInput="true"
            autoFocus
            mandatory
          />
          <Button
            loading={loading}
            onClick={handleSubmit(onSubmit)}
            className="text-sm border-none rounded-md bg-primary hover:bg-primary-focus"
            title={t("continue")}
          />
          <p className="text-sm text-center">
            {t("rememberPassword")}{" "}
            <OrbitLink
              className="text-primary hover:underline"
              onClick={() =>
                router.push({
                  pathname: routes.login,
                })
              }
            >
              {t("logIn")}
            </OrbitLink>
          </p>
        </div>
      </AuthWrapper>
      <Footer />
    </>
  )
}
export default ForgotPassword
