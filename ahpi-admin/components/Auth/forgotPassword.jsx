import { useRouter } from "next/router"
import React from "react"
import AuthWrapper from "shared/layout/AuthWrapper"
import { REGEX } from "utils/regex"
import routes from "utils/routes"
import Button from "widgets/button"
import Input from "widgets/input"
import OrbitLink from "widgets/orbitLink"

import useForgotPassword from "./hooks/useForgotPassword"

const ForgotPassword = () => {
  const router = useRouter()
  const { errors, register, handleSubmit, onSubmit, handleKeyPress, loading, setValue } = useForgotPassword()

  const handleEmailChange = (event) => {
    return (
      event.target.value && setValue("email", event.target.value.replace(REGEX.SPACE_REMOVE_REGEX, "").toLowerCase())
    )
  }

  return (
    <AuthWrapper>
      <h3 className="text-2xl font-bold text-center">Forgot Password</h3>
      <p className="mt-3 text-xs sm:text-sm text-mute font-normal text-center mx-auto">
        Enter the email associated with your account and we&apos;ll send an email with instructions to reset your
        password.
      </p>

      <div className="grid gap-4 mt-6">
        <Input
          label="Email"
          placeholder="Enter Email ID"
          rest={register("email", {
            onChange: (event) => {
              handleEmailChange(event)
            },
          })}
          error={errors.email?.message}
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
          title="Continue"
        />
        <p className="text-sm text-center">
          Remember Password?{" "}
          <OrbitLink
            className="text-primary hover:underline"
            onClick={() =>
              router.push({
                pathname: routes.login,
              })
            }
          >
            Login
          </OrbitLink>
        </p>
      </div>
    </AuthWrapper>
  )
}
export default ForgotPassword
