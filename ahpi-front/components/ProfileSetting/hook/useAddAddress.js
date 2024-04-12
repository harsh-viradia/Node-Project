/* eslint-disable camelcase */
/* eslint-disable promise/no-nesting */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import * as amplitude from "@amplitude/analytics-browser"
import commonApi from "api/index"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import Toast from "utils/toast"

const useAddAddress = ({ setValue, address, addressId }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { userData } = useContext(AppContext)

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    if (address) {
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
  }, [address])

  const onSubmit = async (values) => {
    setLoading(true)
    try {
      await commonApi({
        action: addressId ? "updateAddress" : "addAddress",
        data: values,
        parameters: [addressId],
      }).then(async ([error, { message, data }]) => {
        if (error) return false
        Toast(message)
        if (addressId) {
          amplitude.track(ANALYTICS_EVENT.EDIT_ADDRESS, {
            email: userData?.email,
            userId: userData?.id,
            addressId: data?._id,
          })
        } else {
          amplitude.track(ANALYTICS_EVENT.ADD_ADDRESS, {
            email: userData?.email,
            userId: userData?.id,
            addressId: data?._id,
          })
        }
        const redirectRoute = LocalStorage.get("addressRedirection") || routes.yourAddresses
        LocalStorage.remove("addressRedirection")
        router.push(redirectRoute)
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  return { loading, onSubmit }
}

export default useAddAddress
