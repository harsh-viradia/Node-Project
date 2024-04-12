import useTranslation from "next-translate/useTranslation"
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import Button from "widgets/button"
import PasswordInput from "widgets/passwordInput"

import useChangePassword from "./hook/useChangePassword"
import ProfileSettingSidebar from "./profileSettingSidebar"

const ChangePassword = () => {
  const { t } = useTranslation("changePassword")
  const {
    handleSubmit,
    onSubmit,
    errors,
    watch,
    setValue,
    loading,
    trigger,
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
  } = useChangePassword()

  const validPassword = "text-xs text-green"
  const inValidPass = "text-xs text-[#666]"
  return (
    <LayoutWrapper>
      <div className="container lg:my-16 sm:my-12 my-9">
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden md:col-span-4 md:block">
            <ProfileSettingSidebar />
          </div>

          <div className="col-span-12 md:col-span-8">
            <div className="flex gap-4">
              <h2>{t("changePassword")}</h2>
            </div>

            <form autoComplete="off">
              <div className="grid w-1/2 gap-4">
                <PasswordInput
                  mandatory
                  disabled={loading}
                  label={t("currentPassword")}
                  placeholder={t("enterCurrentPassword")}
                  error={t(errors?.currentPassword?.message)}
                  value={watch("currentPassword")}
                  onChange={(e) => {
                    setValue("currentPassword", e.target.value)
                    trigger("currentPassword")
                    trigger("newPassword")
                  }}
                  onPaste={(event) => {
                    event.preventDefault()
                  }}
                />

                <div>
                  <PasswordInput
                    mandatory
                    disabled={loading}
                    value={watch("newPassword")}
                    placeholder={t("phEnterNewPassword")}
                    label={t("newPassword")}
                    error={t(errors?.newPassword?.message)}
                    onChange={(e) => {
                      const newValue = e.target.value.replaceAll(/\s/g, "")
                      setValue("newPassword", newValue)
                      trigger("newPassword")
                      trigger("confirmPassword")
                    }}
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
                  mandatory
                  disabled={loading}
                  label={t("confirmPassword")}
                  value={watch("confirmPassword")}
                  placeholder={t("enterConfirmPassword")}
                  onChange={(e) => {
                    setValue("confirmPassword", e.target.value)
                    trigger("confirmPassword")
                  }}
                  error={t(errors?.confirmPassword?.message)}
                  onPaste={(event) => {
                    event.preventDefault()
                  }}
                />

                <div>
                  <Button
                    title={t("changePassword")}
                    loading={loading}
                    primaryShadowBTN
                    onClick={handleSubmit(onSubmit)}
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default ChangePassword
