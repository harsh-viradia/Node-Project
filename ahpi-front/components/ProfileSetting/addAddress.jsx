/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { useForm } from "react-hook-form"
import { checkOutAddressSchema } from "schema/common"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import Button from "widgets/button"
import DynamicDataDropdown from "widgets/dynamicDataDropdown"
import Input from "widgets/input"

import useAddAddress from "./hook/useAddAddress"
import ProfileSettingSidebar from "./profileSettingSidebar"

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
const AddAddress = ({ addressData, addressId }) => {
  const { t } = useTranslation("checkout")
  const {
    handleSubmit,
    setValue,
    register,
    formState: { errors = {} },
    watch,
    getValues,
    clearErrors,
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(checkOutAddressSchema(t)),
  })

  const { loading, onSubmit } = useAddAddress({ address: addressData, addressId, setValue })

  return (
    <LayoutWrapper>
      <div className="container lg:my-16 sm:my-12 my-9">
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden md:col-span-4 md:block">
            <ProfileSettingSidebar />
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center relative">
              <h2>{addressId ? t("address:editAddress") : t("address:addAddress")}</h2>
            </div>
            {/* {loading && <OrbitLoader relative />} */}
            <div className="grid grid-cols-12 gap-3 mt-6">
              <div className="col-span-12 sm:col-span-6">
                <Input
                  placeholder={t("EnterAddress1")}
                  label={t("address1")}
                  mandatory
                  rest={register("addrLine1")}
                  error={errors?.addrLine1?.message}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
                <Input
                  rest={register("addrLine2")}
                  error={errors?.addrLine2?.message}
                  placeholder={t("EnterAddress2")}
                  label={t("address2")}
                />
              </div>
              <div className="col-span-12 sm:col-span-6">
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
              </div>

              <div className="col-span-12 sm:col-span-6">
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
              </div>
              <div className="col-span-12 sm:col-span-6">
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
              </div>
              <div className="col-span-12 sm:col-span-6">
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
            </div>
            <div className="mt-6">
              <Button
                title={addressId ? t("address:update") : t("address:add")}
                primaryShadowBTN
                onClick={handleSubmit(onSubmit)}
                loading={loading}
              />
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default AddAddress
