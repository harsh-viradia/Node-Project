/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/better-regex */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */

import commonApi from "api/index"
import { getCookie } from "cookies-next"
import { useSearchParams } from "next/navigation"
import useTranslation from "next-translate/useTranslation"
import { useEffect, useState } from "react"
import useLoginWithOrbit from "shared/Header/hook/useLoginWithOrbit"
import { KEYS, OTP_VERIFY_CODE } from "utils/constant"
import { OTP_REGEX } from "utils/regex"
import Toast from "utils/toast"

const useOtp = () => {
  const [OTPToVerify, setOTPToVerify] = useState()
  const [loading, setLoading] = useState(false)
  const { t } = useTranslation("auth")
  const { storeSessionData } = useLoginWithOrbit()
  const searchParams = useSearchParams()
  const isverify = Boolean(searchParams.get("isverify"))

  const verifyLoginOtp = async (registrationVerify = false) => {
    const email = getCookie(KEYS.email)
    if (!email) return

    const payload = {
      email,
      otp: Number(OTPToVerify),
      remember: true,
      registrationVerify,
    }

    setLoading(true)

    commonApi({ action: "loginOtp", data: payload })
      .then(async ([error, Data = {}]) => {
        if (error) {
          setLoading(false)
        }

        const { code, data } = Data
        if (code === OTP_VERIFY_CODE) {
          Toast("OTP Verify.", "success")
          const newData = {
            token: data,
          }
          await storeSessionData(newData)
          setLoading(false)
        }
        return false
      })
      .catch(() => {})
  }

  const checkOTP = () => {
    if (OTPToVerify?.length === 6) {
      verifyLoginOtp(isverify)
    }
  }

  useEffect(() => {
    checkOTP()
  }, [OTPToVerify])

  const handleOTPChange = async (otp) => {
    const regex = new RegExp(OTP_REGEX)
    if (regex.test(otp)) setOTPToVerify(otp)
  }

  const handleResendOtp = async () => {
    const email = getCookie(KEYS.email) || getCookie(KEYS.forgetEmail)

    const data = {
      email,
      process: "sign-up",
    }
    await commonApi({
      action: "forgotPassword",
      data,
    }).then(async ([error, Data]) => {
      if (error) return false
      const { code, message } = Data
      if (code === OTP_VERIFY_CODE) {
        Toast(message)
      }
      return false
    })
  }

  const handleTerms = (registrationVerify = false) => {
    if (OTPToVerify?.length === 6) {
      verifyLoginOtp(registrationVerify)
    } else {
      Toast(t("errorOTP"), "error")
    }
  }
  return { handleOTPChange, OTPToVerify, handleResendOtp, handleTerms, loading, setOTPToVerify }
}

export default useOtp
