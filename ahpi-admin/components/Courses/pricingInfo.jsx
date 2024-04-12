import { yupResolver } from "@hookform/resolvers/yup"
import InfoIcon from "icons/infoIcon"
import { useRouter } from "next/router"
import React from "react"
import { useForm } from "react-hook-form"
import { pricingInfoSchema } from "schema/common"
import { MODULE_ACTIONS, SYSTEM_USERS } from "utils/constant"
import routes from "utils/routes"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"
import OrbitLoader from "widgets/loader"

import useSyncPricingInfo from "./hooks/useSyncPricingInfo"

const defaultValues = {
  MRP: "",
  sellPrice: "",
  rewardPoints: undefined,
  InAppPurchaseSellPrice: "",
  InAppPurchaseMRP: "",
  InAppPurchaseProductId: "",
}

const PricingInfo = ({ isAllow, user, courseApproval }) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    resetField,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(pricingInfoSchema),
  })

  const { loading, saveAsDraft, publishNow, requestForReview, retailPriceData, retailPriceList } = useSyncPricingInfo({
    setValue,
  })
  return (
    <div className="grid max-w-4xl grid-cols-2 gap-3 mx-auto mt-8">
      {loading && <OrbitLoader relative />}
      <Input
        rest={register("MRP", {
          onBlur: () => {
            if (watch("sellPrice") && Number(watch("sellPrice")) > Number(watch("MRP"))) {
              resetField("sellPrice")
            }
          },
        })}
        error={errors.MRP?.message}
        type="number"
        min={0}
        label="Retail Price"
        placeholder="Enter Retail Price"
        mandatory
      />
      <Input
        rest={register("sellPrice")}
        error={errors.sellPrice?.message}
        type="number"
        min={0}
        label="Selling Price"
        placeholder="Enter Selling Price"
        mandatory
      />
      {user?.role === SYSTEM_USERS.ADMIN && (
        <Input
          rest={register("rewardPoints")}
          error={errors.rewardPoints?.message}
          type="number"
          min={0}
          label="Reward Points"
          placeholder="Enter Reward Points"
        />
      )}
      <Dropdown
        placeholder="Enter Retail Price Tier"
        className="w-full"
        label="Retail Price Tier"
        mandatory
        id="InAppPurchaseMRP"
        value={watch("InAppPurchaseMRP") ? { label: watch("InAppPurchaseMRP"), value: watch("InAppPurchaseMRP") } : ""}
        rest={register("InAppPurchaseMRP")}
        defaultOptions={retailPriceData}
        loadOptions={retailPriceList}
        onChange={async (opt) => {
          setValue("InAppPurchaseMRP", opt?.label)
        }}
        // onKeyDown={(event) => onKeyDown(event)}
        error={errors?.InAppPurchaseMRP?.message}
        isClearable
        isSearch={false}
      />
      <Dropdown
        placeholder="Enter Selling Price Tier"
        className="w-full"
        label="Selling Price Tier"
        mandatory
        id="InAppPurchaseSellPrice"
        value={
          watch("InAppPurchaseSellPrice")
            ? { label: watch("InAppPurchaseSellPrice"), value: watch("InAppPurchaseSellPrice") }
            : ""
        }
        rest={register("InAppPurchaseSellPrice")}
        defaultOptions={retailPriceData}
        loadOptions={retailPriceList}
        onChange={async (opt) => {
          setValue("InAppPurchaseProductId", opt?.value, { shouldValidate: true })
          setValue("InAppPurchaseSellPrice", opt?.label)
          // getSubCategoryList()
        }}
        // onKeyDown={(event) => onKeyDown(event)}
        error={errors?.InAppPurchaseSellPrice?.message}
        isClearable
        isSearch={false}
      />

      <div className="flex items-center justify-end col-span-2 gap-3 mt-3">
        <Button
          onClick={() =>
            router.push({
              pathname: routes.course,
              query: { limit: router?.query?.limit, offset: router?.query?.offset },
            })
          }
          title="Close"
          outline
          className="hover:border-primary"
        />
        <Button title="Save as Draft" onClick={handleSubmit(saveAsDraft)} loading={loading} disabled={loading} />
        {courseApproval ? (
          isAllow(MODULE_ACTIONS.APPROVE_COURSE) ? (
            <Button
              onClick={handleSubmit(requestForReview)}
              title="Request for review"
              kind="dark-gray"
              hoverKind="white"
              className="hover:border-primary"
              loading={loading}
              disabled={loading}
            />
          ) : (
            ""
          )
        ) : (
          isAllow(MODULE_ACTIONS.PUBLISH) && (
            <Button
              onClick={handleSubmit(publishNow)}
              title="Publish Now"
              kind="dark-gray"
              hoverKind="white"
              className="hover:border-primary"
              loading={loading}
              disabled={loading}
            />
          )
        )}
      </div>
      {user?.role === SYSTEM_USERS.INSTRUCTOR && (
        <div className="flex gap-2 mt-5 items-center justify-start col-span-2">
          <InfoIcon size="18" className="text-primary" />
          <p className="text-sm">
            Contact our product team if you would like to feature your course on the home page or offer reward points
            for purchasing your course.
          </p>
        </div>
      )}
    </div>
  )
}

export default PricingInfo
