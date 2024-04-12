import { yupResolver } from "@hookform/resolvers/yup"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { payoutSchema } from "schema/master"
import DrawerWrapper from "shared/drawer"
import { DATE_FORMAT, MASTER_CODES } from "utils/constant"
import { getLastdayOfLastMonth } from "utils/util"
import Button from "widgets/button"
import DateInput from "widgets/dateInput"
import Input from "widgets/input"
import MasterSelect from "widgets/masterSelect"

import useAddPayout from "./hook/useAddPayout"

const CreatePayout = ({ open, setOpen, payoutUserId, getList, paginate }) => {
  const [loading, setLoading] = useState(false)
  const defaultValues = {
    month: "",
    desc: "",
    amt: "",
    trnsType: "",
    transferDate: "",
    currency: "",
  }

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    defaultValues,
    resolver: yupResolver(payoutSchema),
  })

  const { onSubmit } = useAddPayout({ setOpen, setLoading, reset, defaultValues, payoutUserId, getList, paginate })

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  useEffect(() => {
    // eslint-disable-next-line no-restricted-syntax
    if (open) {
      reset({ ...defaultValues })
    }
  }, [open])

  return (
    <DrawerWrapper
      modalFooter={
        <div className="flex gap-3 ">
          <Button
            onClick={() => {
              setOpen(false)
              reset(defaultValues)
            }}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          <Button loading={loading} title="Add" onClick={handleSubmit(onSubmit)} />{" "}
        </div>
      }
      title="Add Payout"
      open={open}
      setOpen={() => {
        setOpen(false)
      }}
    >
      <div className="grid gap-3">
        <DateInput
          label="Transfer Date"
          mandatory
          date={watch("transferDate")}
          setDate={(value) => setValue("transferDate", value, { shouldValidate: true })}
          // disabled={loading}
          error={errors?.transferDate?.message}
          maxDate={new Date()}
          format={DATE_FORMAT}
        />
        <Input
          label="Transaction type"
          placeholder="Enter Transaction type. ex. bank-transfer, UPI payment, NET_Banking"
          rest={register("trnsType")}
          error={errors.trnsType?.message}
          mandatory
        />
        <Input
          label="Amount"
          placeholder="Enter Transferred amount"
          rest={register("amt")}
          mandatory
          type="number"
          min={0}
          onKeyDown={(event) => onKeyDown(event)}
          error={errors.amt?.message}
        />
        <DateInput
          label="Month"
          placeholder="Enter month number of which you've Transferred amount"
          mandatory
          date={watch("month")}
          setDate={(value) => setValue("month", value, { shouldValidate: true })}
          maxDate={getLastdayOfLastMonth()}
          error={errors?.month?.message}
          format="MM YYYY"
          shownDate={getLastdayOfLastMonth()}
        />
        <Input
          label="Description"
          placeholder="Enter description"
          rest={register("desc")}
          error={errors.desc?.message}
        />
        <MasterSelect
          placeholder="Select Currency"
          className="w-full"
          showCode
          label="Currency"
          id="currency"
          mandatory
          code={MASTER_CODES.currency}
          isClearable
          value={watch("currency") ? { value: watch("currency"), label: watch("currencyNm") } : ""}
          error={errors?.currency?.message}
          name="currency"
          onChange={(opt) => {
            setValue("currency", opt?.value, { shouldValidate: true })
            setValue("currencyNm", opt?.label)
          }}
        />
      </div>
    </DrawerWrapper>
  )
}

export default CreatePayout
