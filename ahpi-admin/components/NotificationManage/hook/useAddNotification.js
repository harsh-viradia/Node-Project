/* eslint-disable no-underscore-dangle */
import commonApi from "api"
import dayjs from "dayjs"
import { useState } from "react"
import Toast from "utils/toast"
import { capitalizeFirstLetter, removeNullAndUndefinedFromObj } from "utils/util"

const useAddNotification = ({ getList, setOpen, editId = {}, setEditId, limit, offset }) => {
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onSubmit = async (values) => {
    const startDt = values.startDt
      ? dayjs(values.startDt)
          .set("hours", values.startTime?.split(":")?.[0])
          .set("minutes", values.startTime?.split(":")?.[1])
      : undefined
    const endDt = values.endDt
      ? dayjs(values.endDt)
          .set("hours", values.endTime?.split(":")?.[0])
          .set("minutes", values.endTime?.split(":")?.[1])
      : undefined
    if (startDt && endDt && (dayjs(startDt).isAfter(dayjs(endDt)) || dayjs(startDt).isSame(dayjs(endDt)))) {
      Toast("End time should be greater than start time.", "error")
      return
    }
    const payload = {
      ...values,
      startTime: undefined,
      endTime: undefined,
      startDt,
      endDt,
      nm: capitalizeFirstLetter(values.nm),
      imgId: values?.imgId?.id || undefined,
      typeId: values.typeId.value,
      criteriaId: values.criteriaId.value,
      users: values.users?.map((a) => a.value) || [],
      courses: values.courses?.map((a) => a.value) || [],
      categories: values.categories?.map((a) => a.value) || [],
      pages: values.pages?.map((a) => a.value) || [],
      userTypeId: values.userTypeId?.value,
    }
    try {
      setLoading(true)
      await commonApi({
        action: editId._id ? "update" : "create",
        parameters: [editId._id],
        module: "notification",
        common: true,
        data: removeNullAndUndefinedFromObj(payload),
      }).then(async ([error, response]) => {
        if (error) {
          return
        }
        const { message = "" } = response
        Toast(message, "success")
        setOpen(false)
        setEditId()
        // getList(offset, limit)
        getList({
          options: {
            limit,
            offset,
          },
        })
        // eslint-disable-next-line consistent-return
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  const onSaveAndSend = (values) => {
    onSubmit({ ...values, sendNotification: true })
  }

  return {
    onSubmit,
    loading,
    onSaveAndSend,
  }
}
export default useAddNotification
