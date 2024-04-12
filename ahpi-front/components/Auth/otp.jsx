/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { getCookie } from "cookies-next"
import { add, differenceInSeconds } from "date-fns"
import getConfig from "next/config"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect } from "react"
import OtpInput from "react-otp-input"
import AuthWrapper from "shared/wrapper/AuthWrapper"
import { KEYS } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import Button from "widgets/button"

import useOtp from "./hooks/useOtp"

const { publicRuntimeConfig } = getConfig()

const OTP = () => {
  const [seconds, setSeconds] = React.useState(
    differenceInSeconds(new Date(LocalStorage.getID(KEYS.otpExpireTime)), new Date())
  )

  const { OTPToVerify, handleOTPChange, handleTerms, handleResendOtp, loading, setOTPToVerify } = useOtp()

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
  const { t } = useTranslation("auth")

  const onResend = () => {
    setSeconds(Number.parseFloat(publicRuntimeConfig.NEXT_PUBLIC_OTP_EXPIRE_TIME))
    LocalStorage.set(KEYS.otpExpireTime, add(new Date(), { seconds: publicRuntimeConfig.NEXT_PUBLIC_OTP_EXPIRE_TIME }))
    handleResendOtp()
    setOTPToVerify("")
  }

  return (
    <AuthWrapper className="bg-accent otp-page">
      <h3 className="text-2xl font-bold text-center">{t("enterOTP")}</h3>
      <p className="mt-3 text-xs sm:text-sm text-mute font-normal text-center md:max-w-xs mx-auto">
        {t("otpDetail")}
        <strong className="block text-black mt-1">{getCookie(KEYS.email)}</strong>
      </p>
      <form autoComplete="off" className="grid gap-4 mt-6">
        <OtpInput
          onChange={handleOTPChange}
          value={OTPToVerify}
          numInputs={6}
          inputStyle={{ height: "34px", width: "34px", border: "1px solid #E8E6EA", borderRadius: "6px" }}
          focusStyle={{ outline: "1px solid #40B5E8" }}
          containerStyle={{ gap: "6px", justifyContent: "center", width: "100%" }}
          isInputNum
          shouldAutoFocus
          renderInput={(properties) => <input {...properties} />}
        />

        <Button
          onClick={() => handleTerms(true)}
          className="text-sm border-none rounded-md bg-primary hover:bg-primary-focus"
          title={t("continue")}
          loading={loading}
        />
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
  )
}
export default OTP
