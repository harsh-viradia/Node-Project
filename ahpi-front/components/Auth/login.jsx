/* eslint-disable unicorn/consistent-function-scoping */
import getConfig from "next/config"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Footer from "shared/footer"
import AuthWrapper from "shared/wrapper/AuthWrapper"
import { REGEX } from "utils/regex"
import routes from "utils/routes"
import Button from "widgets/button"
import Input from "widgets/input"
import OrbitLink from "widgets/orbitLink"
import PasswordInput from "widgets/passwordInput"

import useLogin from "./hooks/useLogin"

const { publicRuntimeConfig } = getConfig()
const Login = () => {
  const { t } = useTranslation("auth")
  const { loading, loader, errors, register, handleSubmit, onSubmit, handleKeyPress, setValue } = useLogin()

  const handleEmailChange = (event) => {
    return (
      event.target.value && setValue("email", event.target.value.replace(REGEX.SPACE_REMOVE_REGEX, "").toLowerCase())
    )
  }

  return (
    <>
      <AuthWrapper>
        <h3 className="text-2xl font-bold text-center">
          {t("logInTo")} <span className="text-primary">{publicRuntimeConfig.NEXT_PUBLIC_META_TITLE}</span>
        </h3>
        <form autoComplete="off" className="grid gap-4 mt-6">
          <Input
            label={t("email")}
            placeholder={t("enterEmail")}
            rest={register("email", {
              onChange: (event) => {
                handleEmailChange(event)
              },
            })}
            error={errors.email?.message ? t(errors.email?.message) : ""}
            onKeyDown={(event) => handleKeyPress(event)}
            disabled={loading || loader}
            authInput="true"
            mandatory
          />

          <PasswordInput
            label={t("password")}
            placeholder={t("enterPassword")}
            rest={register("password")}
            error={errors.password?.message ? t(errors.password?.message) : ""}
            onKeyDown={(event) => handleKeyPress(event)}
            disabled={loading || loader}
            mandatory
            onPaste={(event) => {
              event.preventDefault()
            }}
          />
          <div className="w-full text-right">
            <OrbitLink
              href={routes.forgotPassword}
              className="px-0 py-0.5 text-sm btn-link text-primary hover:text-primary-focus hover:underline"
            >
              {t("forgotPassword")}
            </OrbitLink>
          </div>

          <Button loading={loading || loader} onClick={handleSubmit(onSubmit)} title={t("logIn")} />

          <p className="text-sm text-center">
            {t("notHaveAccount")}{" "}
            <OrbitLink className="text-primary hover:underline" href={routes.register}>
              {t("register")}
            </OrbitLink>
          </p>
        </form>
      </AuthWrapper>
      <Footer />
    </>
  )
}
export default Login
