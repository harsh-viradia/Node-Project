/* eslint-disable promise/always-return */
/* eslint-disable no-shadow */
/* eslint-disable camelcase */
/* eslint-disable promise/no-nesting */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import * as amplitude from "@amplitude/analytics-browser"
import commonApi from "api/index"
import { getCookies } from "cookies-next"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"

const useCheckOut = ({ cartData, addressData, t }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const { fcmToken, deviceToken, token } = getCookies()
  const [defaultAddress, setDefaultAddress] = useState()
  const [addressPopup, setAddressPopup] = useState(false)
  const { userData, setCountData } = useContext(AppContext)

  const handleTransactionStatus = async ({ data, config }) => {
    const { STATUS, RESPMSG } = data
    const { amount, orderId } = config.data

    switch (STATUS) {
      case "TXN_FAILURE": {
        amplitude.track(ANALYTICS_EVENT.PAYMENT_Fail, {
          userEmail: userData?.email,
          userId: userData?.id,
          amount,
          orderId,
        })
        router.push({
          pathname: routes.paymentFail,
          query: { msg: RESPMSG },
        })
        break
      }

      case "TXN_SUCCESS": {
        amplitude.track(ANALYTICS_EVENT.PAYMENT_SUCCESSFULL, {
          userEmail: userData?.email,
          userId: userData?.id,
          amount,
          orderId,
        })
        await router.push({
          pathname: routes.myLearning,
        })
        await commonApi({
          action: "cartCount",
          data: { deviceToken, fcmToken },
          config: { token },
        }).then(([, { data }]) => {
          return setCountData(data)
        })
        break
      }

      default: {
        break
      }
    }
  }

  const onSubmit = async () => {
    try {
      if (!defaultAddress?._id) {
        Toast(t("common:selectAddress"), "error")
        return
      }

      setLoading(true)
      const address = {
        addrLine1: defaultAddress?.addrLine1,
        addrLine2: defaultAddress?.addrLine2,
        cityNm: defaultAddress?.cityNm,
        stateNm: defaultAddress?.stateNm,
        countryNm: defaultAddress?.countryNm,
        zipcode: defaultAddress?.zipcode,
        id: defaultAddress?._id,
      }

      const payload = {
        orderNo: router?.query?.orderNo,
        amt: (cartData?.grandTotal < 0 ? 0 : cartData?.grandTotal) || 0,
        channelId: "WEB",
        address,
      }
      const courseIds = cartData.courses.map((course) => course._id)

      amplitude.track(ANALYTICS_EVENT.COMPLETED_CHECKOUT, {
        userEmail: userData?.email,
        userId: userData?.id,
        courseIds,
      })

      // eslint-disable-next-line consistent-return
      await commonApi({ action: "generateTrans", data: payload }).then(async ([error, response]) => {
        if (error) {
          router.push(routes.cart)
          return false
        }
        if (response?.data?.flag === "FREEPURCHASE") {
          amplitude.track(ANALYTICS_EVENT.PAYMENT_SUCCESSFULL, {
            userEmail: userData?.email,
            userId: userData?.id,
            amount: 0,
            orderId: router?.query?.orderNo,
          })
          await router.push(routes.myLearning)
          await commonApi({
            action: "cartCount",
            data: { deviceToken, fcmToken },
            config: { token },
          }).then(([, { data }]) => {
            return setCountData(data)
          })
        } else {
          const config = {
            root: "",
            flow: "DEFAULT",
            data: {
              orderId: response?.data?.paytmResp?.orderId,
              token: response?.data?.paytmResp?.txntoken,
              tokenType: "TXN_TOKEN",
              amount: response?.data?.paytmResp?.amount,
            },
            merchant: {
              /* When redirect false that time handler is call otherwise hanlder is not working */
              redirect: false,
            },
            handler: {
              // eslint-disable-next-line no-unused-vars
              notifyMerchant(eventName, data) {},
              transactionStatus(data) {
                handleTransactionStatus({ data, config })
                /* window.Paytm.CheckoutJS.close() used for close paytm popup */
                window.Paytm.CheckoutJS.close()
                return false
              },
            },
          }
          // eslint-disable-next-line promise/always-return
          if (window.Paytm && window.Paytm.CheckoutJS) {
            // initialze configuration using init method
            window.Paytm.CheckoutJS.init(config)
              .then(function onSuccess() {
                window.Paytm.CheckoutJS.invoke()
                setLoading(false)
              })
              .catch(function onError() {
                amplitude.track(ANALYTICS_EVENT.PAYMENT_Fail, {
                  userEmail: userData?.email,
                  userId: userData?.id,
                  amount: config.data.amount,
                  orderId: config.data.orderId,
                })
              })
          }
        }
      })
    } catch (error) {
      Toast(t("PaytmNotWorking"), "error")
      setLoading(false)
      console.log("error", error)
    }
  }

  const handlePopup = () => {
    window.history.pushState("", "", `?selection=${!addressPopup}`)
    setAddressPopup(!addressPopup)
  }
  useEffect(() => {
    setDefaultAddress(addressData?.find((a) => a.isDefault))
    setAddressPopup(router.query?.selection === "true")
  }, [])
  return { loading, onSubmit, defaultAddress, addressPopup, handlePopup, setDefaultAddress }
}

export default useCheckOut
