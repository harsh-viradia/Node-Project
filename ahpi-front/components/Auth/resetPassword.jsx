/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
// import add from "date-fns/add"
import { getCookie } from "cookies-next"
import { add, differenceInSeconds } from "date-fns"
import getConfig from "next/config"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"
import OtpInput from "react-otp-input"
import Footer from "shared/footer"
import AuthWrapper from "shared/wrapper/AuthWrapper"
import { KEYS } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import Button from "widgets/button"
import PasswordInput from "widgets/passwordInput"

import useResetPassword from "./hooks/useResetPassword"

const { publicRuntimeConfig } = getConfig()

const ResetPassword = () => {
  const [seconds, setSeconds] = React.useState(
    differenceInSeconds(new Date(LocalStorage.getID(KEYS.otpExpireTime)), new Date())
  )
  const router = useRouter()

  const email = getCookie(KEYS.forgetEmail)

  const {
    OTPToVerify,
    handleOTPChange,
    handleResendOtp,
    register,
    errors,
    loading,
    handleSubmit,
    handleResetPassword,
    onKeyDown,
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
    setOTPToVerify,
    reset,
  } = useResetPassword()

  const validPassword = "text-xs text-green"
  const inValidPass = "text-xs text-mute"
  const { t } = useTranslation("auth")

  useEffect(() => {
    const myInterval = setInterval(() => {
      if (seconds > 0) {
        setSeconds(differenceInSeconds(new Date(LocalStorage.getID(KEYS.otpExpireTime)), new Date()))
      } else {
        setSeconds(0)
        LocalStorage.remove(KEYS.otpExpireTime)
        clearInterval(myInterval)
      }
    }, 1000)
    return () => {
      clearInterval(myInterval)
    }
  })

  useEffect(() => {
    const listener = (event) => {
      if (event.code === "Enter" || event.code === "NumpadEnter") {
        event.preventDefault()
      }
    }
    document.addEventListener("keydown", listener)
    return () => {
      document.removeEventListener("keydown", listener)
    }
  })

  useEffect(() => {
    if (router.asPath === routes.resetPass) {
      window.addEventListener("popstate", () => {
        window.history.go(1)
      })
    }
  }, [router])

  const onResend = () => {
    setSeconds(Number.parseFloat(publicRuntimeConfig.NEXT_PUBLIC_OTP_EXPIRE_TIME))
    LocalStorage.set(KEYS.otpExpireTime, add(new Date(), { seconds: publicRuntimeConfig.NEXT_PUBLIC_OTP_EXPIRE_TIME }))
    handleResendOtp()
    setOTPToVerify("")
    reset()
  }

  return (
    <>
      <AuthWrapper className="bg-accent otp-page">
        <h3 className="text-2xl font-bold text-center">{t("resetPassword")}</h3>
        <p className="mt-3 text-xs sm:text-sm text-mute font-normal text-center md:max-w-xs mx-auto">
          {t("otpDetail")}
          <strong className="block text-black mt-1">{email}</strong>
        </p>
        <form autoComplete="off" className="grid gap-4 mt-6" onSubmit={handleSubmit(handleResetPassword)}>
          <div className="text-left">
            <label className="relative block mb-2 text-sm text-black font-medium">
              {t("otp")} <span className="text-red">*</span>
            </label>
            <OtpInput
              onChange={handleOTPChange}
              value={OTPToVerify}
              numInputs={6}
              inputStyle={{ height: "42px", width: "36px", border: "1px solid #E8E6EA", borderRadius: "6px" }}
              focusStyle={{ outline: "1px solid #40B5E8" }}
              containerStyle={{ gap: "4px", width: "100%", justifyContent: "center" }}
              isInputNum
              shouldAutoFocus
              id="otp"
              key="OTPInput"
              renderInput={(properties) => <input {...properties} />}
            />
            {errors.code?.message && <p className="mt-1 text-sm font-medium text-red">{t(errors.code?.message)}</p>}
          </div>
          <div>
            <PasswordInput
              label={t("newPassword")}
              placeholder={t("enterNewPassword")}
              rest={{ ...register("password"), autoComplete: "new-password" }}
              error={t(errors.password?.message)}
              disabled={loading}
              onKeyDown={(event) => onKeyDown(event)}
              mandatory
              onPaste={(event) => {
                event.preventDefault()
              }}
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
            disabled={loading}
            onKeyDown={(event) => onKeyDown(event)}
            onPaste={(event) => {
              event.preventDefault()
            }}
            mandatory
          />
          <Button loading={loading} title={t("resetPassword")} disabled={!OTPToVerify || OTPToVerify.length < 6} />

          {/* <div className="text-center">
          <p className="text-sm text-mute">
            {t("codeNotReceive")}{" "}
            <span className="text-primary cursor-pointer" onClick={onResend}>
              {seconds === 0 ? "Resend" : ""}
            </span>
          </p>


          <p className="inline-block px-4 py-1 mt-3 text-sm rounded-md bg-gray text-mute">
            {" "}
            {seconds ? `${seconds} sec` : "OTP Expired!"}{" "}
          </p>
        </div> */}

          <div className="text-center">
            <p className="text-sm text-mute">
              {t("codeNotReceive")}{" "}
              <span className="text-primary cursor-pointer" onClick={onResend}>
                {seconds <= 0 ? `${t("resend")}` : ""}
              </span>
            </p>
            {seconds > 0 ? (
              <p className="inline-block px-4 py-1 mt-3 text-sm rounded-md bg-gray text-mute">{`${seconds} Sec`}</p>
            ) : (
              ""
            )}
          </div>
        </form>
      </AuthWrapper>
      <Footer />
    </>
  )
}
export default ResetPassword
