import React from "react"
import Button from "widgets/button"
import PasswordInput from "widgets/passwordInput"

import useChangePassword from "./useChangePassword"

const ChangePassword = ({ email }) => {
  const {
    handleSubmit,
    onSubmit,
    errors,
    numberCharacter,
    upperAndLower,
    numberOrSymbol,
    setValue,
    loading,
    trigger,
    watch,
  } = useChangePassword({ email })

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  const handleCancel = () => {
    setValue("currentPassword", "")
    setValue("newPassword", "")
    setValue("confirmPassword", "")
  }
  const validPassword = "text-xs text-green opacity-70"
  const inValidPass = "text-xs text-mute-200 opacity-70"

  return (
    <div className="p-4 mt-6 bg-white border rounded-md border-primary-border">
      <p>Change Password</p>
      <form autoComplete="off">
        <div className="grid grid-cols-2 gap-3 mt-3 max-w-7xl">
          <PasswordInput
            label="Current Password"
            mandatory
            value={watch("currentPassword")}
            placeholder="Enter Current Password"
            error={errors.currentPassword?.message}
            disabled={loading}
            onChange={(e) => {
              setValue("currentPassword", e.target.value)
              trigger("currentPassword")
              trigger("newPassword")
            }}
            onPaste={(event) => {
              event.preventDefault()
            }}
            onKeyDown={(event) => onKeyDown(event)}
          />
          <div />
          <div>
            <PasswordInput
              label="New Password"
              mandatory
              placeholder="Enter New Password"
              value={watch("newPassword")}
              error={errors.newPassword?.message}
              disabled={loading}
              onKeyDown={(e) => onKeyDown(e)}
              onChange={(e) => {
                const newValue = e.target.value.replace(/\s/g, "")
                setValue("newPassword", newValue)
                trigger("newPassword")
                trigger("confirmPassword")
              }}
              onPaste={(event) => {
                event.preventDefault()
              }}
            />
            <ul className="text-[10px] mt-2 mb-2 ml-5 text-left list-disc">
              <li className={numberCharacter ? validPassword : inValidPass}>Should contains at least 8 characters.</li>
              <li className={upperAndLower ? validPassword : inValidPass}>
                Should contain both lower (a-z) and upper case (A-Z) letter
              </li>
              <li className={numberOrSymbol ? validPassword : inValidPass}>
                Should contain at least one number (0-9) and a symbol ({`\`~!"#$%&()*,.:<>?@^{|}`})
              </li>
            </ul>
          </div>
          <PasswordInput
            label="Confirm Password"
            mandatory
            placeholder="Enter Confirm Password"
            error={errors.confirmPassword?.message}
            value={watch("confirmPassword")}
            onChange={(e) => {
              setValue("confirmPassword", e.target.value)
              trigger("confirmPassword")
            }}
            disabled={loading}
            onKeyDown={(e) => onKeyDown(e)}
            onPaste={(event) => {
              event.preventDefault()
            }}
          />
          <div className="flex items-center gap-3">
            <Button kind="dark-gray" hoverKind="white" title="Cancel" onClick={handleCancel} disabled={loading} />
            <Button title="Save Changes" onClick={handleSubmit(onSubmit)} loading={loading} />
          </div>
        </div>
      </form>
    </div>
  )
}

export default ChangePassword
