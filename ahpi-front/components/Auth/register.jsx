/* eslint-disable prettier/prettier */
/* eslint-disable no-param-reassign */
import getConfig from "next/config"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Footer from "shared/footer"
import AuthWrapper from "shared/wrapper/AuthWrapper"
import { DESIGNATION_TYPE } from "utils/constant"
import { REGEX } from "utils/regex"
import routes from "utils/routes"
import Button from "widgets/button"
import FilterSelectDropdown from "widgets/dynamicDataDropdown"
import Input from "widgets/input"
import OrbitLink from "widgets/orbitLink"
import PasswordInput from "widgets/passwordInput"
import PhoneInput from "widgets/phoneInput"

import useRegister from "./hooks/useRegister"

const { publicRuntimeConfig } = getConfig()

const GetRoleInputFields = ({ role, errors, onKeyDown, register, t, loading }) => {
  switch (role) {
    case DESIGNATION_TYPE.STUDENT: {
      return (
        <>
          <Input
            label={t("university")}
            placeholder={t("enterUniversityName")}
            rest={register("university")}
            error={t(errors.university?.message)}
            onKeyDown={(event) => onKeyDown(event)}
            mandatory
            disabled={loading}
          />
          <Input
            label={t("course")}
            placeholder={t("enterCourseName")}
            rest={register("course")}
            error={t(errors.course?.message)}
            onKeyDown={(event) => onKeyDown(event)}
            disabled={loading}
            mandatory
          />
        </>
      )
    }
    case DESIGNATION_TYPE.PROFESSION: {
      return (
        <>
          <Input
            label={t("organization")}
            placeholder={t("enterOrganizationName")}
            rest={register("organization")}
            error={t(errors.organization?.message)}
            onKeyDown={(event) => onKeyDown(event)}
            disabled={loading}
            mandatory
          />
          <Input
            label={t("profession")}
            placeholder={t("enterProfessionName")}
            rest={register("profession")}
            error={t(errors.profession?.message)}
            onKeyDown={(event) => onKeyDown(event)}
            disabled={loading}
            mandatory
          />
        </>
      )
    }
    default: {
      return false
    }
  }
}

const Register = () => {
  const { t } = useTranslation("auth")
  const router = useRouter()
  const {
    errors = {},
    register,
    handleSubmit,
    onSubmit,
    onKeyDown,
    setValue,
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
    loading,
    watch,
    setRole,
    role,
    getValues,
    clearErrors,
  } = useRegister()

  const validPassword = "text-xs text-green"
  const inValidPass = "text-xs text-mute"

  const handleEmailChange = (event) => {
    return (
      event.target.value && setValue("email", event.target.value.replace(REGEX.SPACE_REMOVE_REGEX, "").toLowerCase())
    )
  }

  return (
    <>
      <AuthWrapper>
        <h3 className="text-2xl font-bold text-center">
          {t("registerOn")}{" "}
          <span className="text-primary">
            {router?.query?.redirectTitle || publicRuntimeConfig.NEXT_PUBLIC_META_TITLE}
          </span>
        </h3>
        <p className="mt-3 text-xs sm:text-sm text-mute font-normal text-center mx-auto">
          {t("registerFirst")} <b>{t("continue")}</b>.
        </p>
        <form autoComplete="off">
          <div className="grid gap-4 mt-6">
            <Input
              label={t("firstName")}
              placeholder={t("enterFirstName")}
              rest={register("firstName")}
              error={t(errors.firstName?.message)}
              onKeyDown={(event) => onKeyDown(event)}
              disabled={loading}
              autoFocus
              mandatory
            />
            <Input
              label={t("lastName")}
              placeholder={t("enterLastName")}
              rest={register("lastName")}
              error={t(errors.lastName?.message)}
              onKeyDown={(event) => onKeyDown(event)}
              disabled={loading}
            />
            <PhoneInput
              label={t("phone")}
              type="number"
              placeholder={t("enterPhone")}
              rest={register("mobNo")}
              watch={watch}
              error={t(errors.mobNo?.message)}
              onKeyDown={(event) => onKeyDown(event)}
              disabled={loading}
              setValue={setValue}
              register={register}
              mandatory
            />
            <FilterSelectDropdown
              label={t("Are you a student or working professional?")}
              mount
              action="getMasterList"
              mandatory
              onChange={(opt) => {
                setRole(opt?.code)
                setValue("designation", opt)
                clearErrors("designation")
              }}
              value={getValues("designation")}
              error={t(errors.designation?.message)}
              isRegister
            />
            <GetRoleInputFields {...{ role, errors, onKeyDown, register, t, loading }} />

            <Input
              label={t("email")}
              placeholder={t("enterEmail")}
              rest={{
                ...register("email", {
                  onChange: (event) => {
                    handleEmailChange(event)
                  },
                }),
                autoComplete: "email",
              }}
              error={t(errors.email?.message)}
              onKeyDown={(event) => onKeyDown(event)}
              disabled={loading}
              mandatory
            />
            <div>
              <PasswordInput
                label={t("password")}
                placeholder={t("enterPassword")}
                rest={{ ...register("password"), autoComplete: "new-password" }}
                error={t(errors.password?.message)}
                onKeyDown={(event) => onKeyDown(event)}
                disabled={loading}
                mandatory
              />
              <ul className="text-[10px] mt-2 mb-2 ml-5 text-left list-disc">
                <li className={numberCharacter ? validPassword : inValidPass}>{t("passwordRule1")}</li>
                <li className={upperAndLower ? validPassword : inValidPass}>{t("passwordRule2")}</li>
                <li className={numberOrSymbol ? validPassword : inValidPass}>{t("passwordRule3")}</li>
              </ul>
            </div>
            <PasswordInput
              label={t("confirmPassword")}
              placeholder={t("enterConfirmPassword")}
              rest={register("confirmPassword")}
              error={t(errors.confirmPassword?.message)}
              onKeyDown={(event) => onKeyDown(event)}
              disabled={loading}
              onPaste={(event) => {
                event.preventDefault()
              }}
              mandatory
            />
            <Button onClick={handleSubmit(onSubmit)} loading={loading} title={t("continue")} disabled={loading} />
            <p className="text-sm text-center">
              {t("haveAccount")}{" "}
              <OrbitLink
                className="text-primary hover:underline"
                onClick={() =>
                  router.push({
                    pathname: routes.otp,
                    query: { isverify: true },
                  })
                }
              >
                {t("logIn")}
              </OrbitLink>
            </p>
          </div>
        </form>
      </AuthWrapper>
      <Footer />
    </>
  )
}
export default Register
