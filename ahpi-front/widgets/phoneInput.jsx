/* eslint-disable prettier/prettier */
/* eslint-disable no-empty */
/* eslint-disable prettier/prettier */
/* eslint-disable promise/no-callback-in-promise */
/* eslint-disable prettier/prettier */
/* eslint-disable jsx-a11y/label-has-associated-control */
// import commonApi from "api"
// import { useRouter } from "next/router"
import commonApi from "api/index"
import cx from "classnames"
import React, { useEffect, useState } from "react"
import { debounce } from "utils/util"

import DropdownPhone from "./dropDownPhone"

const PhoneInput = ({
  type = "text",
  placeholder = "Enter Phone Number",
  label = "Phone Number",
  error,
  className,
  value,
  defaultValue = "",
  maxLength = "",
  minLength = "",
  disabled = false,
  onChange = () => false,
  onKeyDown = () => false,
  setValue = () => {},
  rest,
  register,
  mandatory = false,
}) => {
  const [countryCode, setCountryCode] = useState()
  // const router = useRouter()
  const [countryValue, setCountryValue] = useState()

  // eslint-disable-next-line react-hooks/exhaustive-deps

  const getCountryCode = debounce(async (search, callback) => {
    const payload = {
      // redirectUrl: router?.query?.redirectUrl,
      query: {
        searchColumns: ["name", "code", "ISOCode2"],
        search: "",
      },

      options: {
        offset: 0,
        limit: 20,
        page: 1,
        sort: {
          createdAt: -1,
        },
      },
    }

    if (search) {
      payload.query.search = search
      payload.query.searchColumns = ["name", "code", "ISOCode2"]
    }
    try {
      await commonApi({
        action: "countryCode",
        data: payload,
      }).then(([, { data = {} }]) => {
        const country =
          data?.data?.map(({ ISDCode, isDefault, name }) => ({
            value: `+${ISDCode}`,
            label: `+${ISDCode}-${name}`,
            isDefault,
          })) || []

        // eslint-disable-next-line promise/always-return
        if (search) {
          callback?.(country)
        } else {
          setCountryCode(country)
          const defaultCountry = data.data?.filter((item) => item.isDefault)[0] || {}

          setValue("countryCode", defaultCountry.ISDCode)
          setCountryValue({ value: defaultCountry.ISDCode, label: `+${defaultCountry.ISDCode}` })
        }
        // eslint-disable-next-line promise/always-return
        return callback?.([])
      })
    } finally {
    }
  }, 500)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    getCountryCode()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="text-left w-full">
      {label && (
        <label className="text-sm font-medium mb-2 inline-block text-foreground">
          {label} {mandatory ? <span className="text-red">*</span> : ""}
        </label>
      )}
      <div className="relative flex items-center">
        <DropdownPhone
          isSearch={false}
          className="absolute inset-y-0 left-0 z-[11] flex items-center"
          isPhoneCode
          value={countryValue}
          defaultOptions={countryCode}
          // defaultValue={{ label: "+91", value: "91" }}
          loadOptions={getCountryCode}
          register={register("countryCode")}
          onChange={(opt) => {
            setValue("countryCode", opt?.value.slice(1))
            setCountryValue({ value: opt?.value, label: opt?.value })
          }}
          placeholder=""
        />
        <input
          placeholder={placeholder}
          className={cx(
            `bg-white focus:outline-none px-5 py-2.5 pl-32 md:pl-28 min-h-[20px] text-sm placeholder:text-mute w-full outline-none focus:border focus:border-primary transition border border-gray rounded-md ${className} ${
              (disabled && "bg-disabled-gray", error && "bg-red/10 !border-red")
            }`,
            { "bg-gray": disabled }
          )}
          maxLength={maxLength}
          minLength={minLength}
          disabled={disabled}
          type={type}
          value={value}
          onInput={(event) => {
            // eslint-disable-next-line no-param-reassign
            event.target.value = event.target.value.replaceAll(/\D/gi, "")
            if (event.target.value.length > 10) {
              // eslint-disable-next-line no-param-reassign
              event.target.value = event.target.value.slice(0, 10)
            }
            return event.target.value
          }}
          defaultValue={defaultValue}
          onChange={onChange}
          onKeyDown={onKeyDown}
          {...rest}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red font-medium">{error}</p>}
    </div>
  )
}
export default PhoneInput
