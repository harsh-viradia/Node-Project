/* eslint-disable unicorn/consistent-function-scoping */
import getConfig from "next/config"
import React from "react"
import AuthWrapper from "shared/layout/AuthWrapper"
import { REGEX } from "utils/regex"
import routes from "utils/routes"
import Button from "widgets/button"
import Input from "widgets/input"
import OrbitLink from "widgets/orbitLink"
import PasswordInput from "widgets/passwordInput"

import useLogin from "./hooks/useLogin"

const { publicRuntimeConfig } = getConfig()
const Login = () => {
  const { loading, errors, register, handleSubmit, onSubmit, handleKeyPress, setValue } = useLogin()

  const handleEmailChange = (event) => {
    return (
      event.target.value && setValue("email", event.target.value.replace(REGEX.SPACE_REMOVE_REGEX, "").toLowerCase())
    )
  }

  return (
    <AuthWrapper>
      <h3 className="text-2xl font-bold text-center">
        Login to <span className="text-primary">{publicRuntimeConfig.NEXT_PUBLIC_META_TITLE}</span>
      </h3>
      <form autoComplete="off" className="grid gap-4 mt-6">
        <Input
          label="Email"
          placeholder="Enter Email ID"
          rest={register("email", {
            onChange: (event) => {
              handleEmailChange(event)
            },
          })}
          error={errors.email?.message ? errors.email?.message : ""}
          onKeyDown={(event) => handleKeyPress(event)}
          disabled={loading}
          authInput="true"
          mandatory
        />

        <PasswordInput
          label="Password"
          placeholder="Enter Password"
          rest={register("password")}
          error={errors.password?.message ? errors.password?.message : ""}
          onKeyDown={(event) => handleKeyPress(event)}
          disabled={loading}
          mandatory
          onPaste={(event) => {
            event.preventDefault()
          }}
        />
        <div className="w-full text-right">
          <OrbitLink
            href={routes.forgorPassword}
            className="px-0 py-0.5 text-sm btn-link text-primary hover:text-primary-focus hover:underline"
          >
            Forgot Password?
          </OrbitLink>
        </div>

        <Button loading={loading} onClick={handleSubmit(onSubmit)} title="Login" />
      </form>
    </AuthWrapper>
  )
}
export default Login
