import commonApi from "api/index"
import Checkout from "components/Checkout"
import { getCookie } from "cookies-next"
import React from "react"
import { SETTINGS_CODE } from "utils/constant"
import routes from "utils/routes"

const CheckoutIndex = ({ cartData, addressData, rewardPointValue }) => {
  return (
    <Checkout
      rewardPointValue={JSON.parse(rewardPointValue)}
      cartData={JSON.parse(cartData)}
      addressData={JSON.parse(addressData)}
    />
  )
}

export default CheckoutIndex
export async function getServerSideProps({ params, req, res, locale }) {
  const token = getCookie("token", { req, res })
  if (!token) {
    return {
      redirect: {
        destination: routes.home,
        permanent: false,
      },
    }
  }

  const { orderNo } = params
  const [getCartData, data, rewardPointVal] = await Promise.all([
    commonApi({
      action: "orderGet",
      config: {
        token,
        locale,
      },
      parameters: [orderNo],
    }),
    commonApi({
      action: "addressList",
      config: {
        token,
        locale,
      },
      data: {
        options: {
          pagination: false,
        },
        query: {},
      },
    }),
    commonApi({
      action: "settings",
      parameters: [SETTINGS_CODE.rewardPointValue],
    }),
  ])
  if (!getCartData?.[1]?.data?.[0]) {
    return {
      redirect: {
        destination: routes.cart,
        permanent: false,
      },
    }
  }
  const [cartData, addressData, rewardPointValue] = await Promise.all([
    JSON.stringify(getCartData?.[1]?.data?.[0] || {}),
    JSON.stringify(data?.[1]?.data?.data || {}),
    JSON.stringify(rewardPointVal?.[1]?.data?.details || {}),
  ])
  return { props: { cartData, addressData, rewardPointValue } }
}
