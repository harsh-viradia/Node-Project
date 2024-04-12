/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable promise/always-return */
/* eslint-disable no-undef */
import commonApi from "api"
import Toast from "utils/toast"
import { dateDisplay } from "utils/util"

const useAddPayout = ({ setOpen, setLoading, reset, defaultValues, payoutUserId, getList, paginate }) => {
  const onSubmit = async (value) => {
    if (new Date(dateDisplay(value.month, "MMM-YYYY")) >= new Date(dateDisplay(value.transferDate, "MMM-YYYY"))) {
      Toast("The transfer date should not be earlier than the selected month", "error")
      return false
    }
    setLoading(true)
    const payload = {
      ...value,
      desc: value.desc || undefined,
      month: dateDisplay(value.month, "MM YYYY"),
      user: payoutUserId,
      currencyNm: undefined,
    }
    try {
      await commonApi({
        action: "create",
        module: "payout",
        common: true,
        data: payload,
      }).then(async ([error, { message = "" }]) => {
        if (error) return
        Toast(message, "success")
        getList({
          options: {
            offset: 0,
            limit: paginate?.perPage || DEFAULT_LIMIT,
          },
        })
        setOpen(false)
        reset(defaultValues)
      })
      return false
    } finally {
      setLoading(false)
    }
  }

  return {
    onSubmit,
  }
}

export default useAddPayout
