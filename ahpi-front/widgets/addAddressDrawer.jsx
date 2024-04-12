/* eslint-disable no-underscore-dangle */
import * as amplitude from "@amplitude/analytics-browser"
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { checkOutAddressSchema } from "schema/common"
import DrawerWrapper from "shared/drawer/index"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import Toast from "utils/toast"
import DynamicDataDropdown from "widgets/dynamicDataDropdown"
import Input from "widgets/input"

import Button from "./button"

const defaultValues = {
  addrLine1: "",
  addrLine2: "",
  stateId: "",
  stateNm: "",
  cityId: "",
  cityNm: "",
  countryId: "",
  countryNm: "",
  // zipcodeId: "",
  zipcode: "",
}
const AddAddress = ({ open, setOpen, addressData, addressId, isNewAddress, setDefaultAddress }) => {
  const { t } = useTranslation("checkout")
  const router = useRouter()

  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors = {} },
    watch,
    getValues,
    clearErrors,
    reset,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(checkOutAddressSchema(t)),
  })
  // const { loading, onSubmit } = useAddAddress({ address: addressData[index], addressId, setValue })
  const { userData } = useContext(AppContext)
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (addressData) {
      // const index = addressData?.findIndex((object) => {
      //   return object._id === addressId
      // })
      const address = addressData
      setValue("addrLine1", address.addrLine1)
      setValue("addrLine2", address.addrLine2)
      setValue("cityId", address.cityId)
      setValue("cityNm", address.cityNm)
      setValue("countryId", address.countryId)
      setValue("countryNm", address.countryNm)
      setValue("stateId", address.stateId)
      setValue("stateNm", address.stateNm)
      setValue("zipcode", address.zipcode)
    }
  }, [open, addressData])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      await commonApi({
        action: isNewAddress ? "addAddress" : "updateAddress",
        data: values,
        parameters: [addressId],
      }).then(async ([error, { message, data }]) => {
        if (error) return false
        Toast(message)
        if (isNewAddress) {
          amplitude.track(ANALYTICS_EVENT.ADD_ADDRESS, {
            email: userData?.email,
            userId: userData?.id,
            addressId: data?._id,
          })
        } else {
          amplitude.track(ANALYTICS_EVENT.EDIT_ADDRESS, {
            email: userData?.email,
            userId: userData?.id,
            addressId: data?._id,
          })
        }

        const redirectRoute = LocalStorage.get("addressRedirection") || routes.yourAddresses
        LocalStorage.remove("addressRedirection")
        router.push(redirectRoute)
        setOpen(false)
        setDefaultAddress(data)

        await commonApi({
          action: "addressList",
          data: {
            options: {
              pagination: false,
            },
            query: {},
          },
        }).then((res) => {
          const [addressListError] = res

          if (addressListError) {
            return false
          }
          reset()
          return false
        })
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  const buttonClose = () => {
    setOpen(false)
    reset(defaultValues)
  }

  return (
    <form>
      <DrawerWrapper
        open={open}
        setOpen={setOpen}
        title={
          <div className="flex items-center justify-between">
            <h3 className="font-bold">{isNewAddress ? t("address:addAddress") : t("address:editAddress")} </h3>
          </div>
        }
        modalFooter={
          <>
            <Button
              title={t("canCel")}
              className="bg-transparent border-primary hover:border-primary-focus hover:bg-primary text-primary hover:text-white rounded-lg"
              onClick={() => buttonClose()}
            />
            <Button
              title={isNewAddress ? t("address:add") : t("address:update")}
              // primaryShadowBTN
              onClick={handleSubmit(onSubmit)}
              loading={loading}
            />
          </>
        }
      >
        <div className="grid gap-3">
          <Input
            placeholder={t("EnterAddress1")}
            label={t("address1")}
            mandatory
            rest={register("addrLine1")}
            error={errors?.addrLine1?.message}
          />
          <Input
            rest={register("addrLine2")}
            error={errors?.addrLine2?.message}
            placeholder={t("EnterAddress2")}
            label={t("address2")}
          />

          <DynamicDataDropdown
            mount
            parameters={["country/all"]}
            action="commonPost"
            label={t("Country")}
            placeholder={t("selectCountry")}
            onChange={(opt) => {
              setValue("countryNm", opt?.name, { shouldValidate: true })
              setValue("countryId", opt?.value, { shouldValidate: true })
              clearErrors("countryId")
              clearErrors("countryNm")
              setValue("stateId")
              setValue("stateNm")
              setValue("cityId")
              setValue("cityNm")
            }}
            value={watch("countryId") ? { label: watch("countryNm"), value: watch("countryId") } : t("Country")}
            isClearable
            error={errors?.countryId?.message}
            mandatory
          />

          <DynamicDataDropdown
            mount={!!watch("countryId")}
            state="countryId"
            watch={getValues("countryId")}
            parameters={["state/get-state-list"]}
            action="commonPost"
            label={t("State")}
            placeholder={t("selectState")}
            onChange={(opt) => {
              setValue("stateId", opt?.value, { shouldValidate: true })
              setValue("stateNm", opt?.name, { shouldValidate: true })
              clearErrors("stateId")
              clearErrors("stateNm")
              setValue("cityId")
              setValue("cityNm")
            }}
            value={watch("stateId") ? { label: watch("stateNm"), value: watch("stateId") } : t("State")}
            isClearable
            error={errors?.stateId?.message}
            mandatory
          />

          <DynamicDataDropdown
            mount={!!watch("stateId") && !!watch("countryId")}
            state="stateId"
            watch={getValues("stateId")}
            parameters={["city/get-city-list"]}
            action="commonPost"
            label={t("city")}
            placeholder={t("selectCity")}
            onChange={(opt) => {
              setValue("cityId", opt?.value, { shouldValidate: true })
              setValue("cityNm", opt?.name, { shouldValidate: true })
              clearErrors("cityId")
              clearErrors("cityNm")
            }}
            value={watch("cityId") ? { label: watch("cityNm"), value: watch("cityId") } : t("city")}
            isClearable
            isSearch
            error={errors?.cityId?.message}
            mandatory
          />

          <Input
            rest={register("zipcode")}
            error={errors?.zipcode?.message}
            placeholder={t("enterZip")}
            label={t("zipCode")}
            type="number"
            mandatory
            isZipCode
          />
        </div>
      </DrawerWrapper>
    </form>
  )
}

export default AddAddress
