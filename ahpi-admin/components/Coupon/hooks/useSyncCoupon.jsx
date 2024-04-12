/* eslint-disable unicorn/no-null */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import dayjs from "dayjs"
import { useState } from "react"
import { COUPON_DATE_FORMAT, COUPON_TYPE_NAME } from "utils/constant"
import Toast from "utils/toast"
import { dateDisplay } from "utils/util"

const useSyncCoupon = ({ setOpen, getList, defaultValues, reset, pagination = {}, couponType, oldCouponCode }) => {
  const [loading, setLoading] = useState(false)

  const onSubmit = async (values) => {
    const {
      id,
      name,
      typeId,
      code,
      appliedDate,
      expireDate,
      totalUse,
      totalPurchase,
      users,
      details,
      criteriaId,
      buyCourses,
      getCourses,
      buyCategories,
      getCategories,
      discountAmount,
      discountPercentage,
    } = values

    if (dayjs(appliedDate).isAfter(dayjs(expireDate)) || dayjs(appliedDate).isSame(dayjs(expireDate))) {
      Toast("The applied date should be before the expire date", "error")
      return
    }

    const payload = {
      name,
      typeId,
      code: id ? oldCouponCode : code,
      appliedDate: dateDisplay(appliedDate, COUPON_DATE_FORMAT),
      expireDate: dateDisplay(expireDate, COUPON_DATE_FORMAT),
      totalUse: totalUse ? Number(totalUse) : id ? null : undefined,
      totalPurchase: totalPurchase ? Number(totalPurchase) : id ? null : undefined,
      users: users?.length ? users?.map((x) => x.value) : id ? [] : undefined,
      details: details || undefined,
      criteriaId,
      buyCourses: buyCourses?.length ? buyCourses?.map((x) => x.value) : id ? [] : undefined,
      getCourses: getCourses?.length ? getCourses?.map((x) => x.value) : id ? [] : undefined,
      buyCategories: buyCategories?.length ? buyCategories?.map((x) => x.value) : id ? [] : undefined,
      getCategories: getCategories?.length ? getCategories?.map((x) => x.value) : id ? [] : undefined,
      discountAmount:
        couponType === COUPON_TYPE_NAME.FLAT_DISCOUNT
          ? discountAmount
            ? Number(discountAmount)
            : id
            ? null
            : undefined
          : id
          ? null
          : undefined,
      discountPercentage:
        couponType === COUPON_TYPE_NAME.PERCENTAGE_DISCOUNT
          ? discountPercentage
            ? Number(discountPercentage)
            : id
            ? null
            : undefined
          : id
          ? null
          : undefined,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "create",
        parameters: [id],
        module: "coupon",
        common: true,
        data: payload,
      }).then(async ([error, { message = "" }]) => {
        if (error) return false
        Toast(message, "success")
        reset({ ...defaultValues })
        if (id) {
          getList({
            options: {
              offset: pagination.offset,
              limit: pagination.perPage,
            },
          })
        } else {
          getList()
        }
        setOpen(false)
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    onSubmit,
    loading,
  }
}
export default useSyncCoupon
