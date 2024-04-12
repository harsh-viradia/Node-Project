import commonApi from "api/index"
import CartDetail from "components/Cart/index"
import { getCookies } from "cookies-next"
import React from "react"
import { SETTINGS_CODE } from "utils/constant"

const CartIndex = ({ cartList, couponAndRewardApply, rewardPointValue, userRewardPoints }) => {
  return (
    <CartDetail
      cartList={JSON.parse(cartList)}
      couponAndRewardApply={JSON.parse(couponAndRewardApply)}
      rewardPointValue={JSON.parse(rewardPointValue)}
      userRewardPoints={userRewardPoints}
    />
  )
}

export default CartIndex
export async function getServerSideProps({ req, res, locale }) {
  const { deviceToken = "", token = "", fcmToken = "" } = getCookies({ req, res })

  const [cartData, couponAndReward, rewardPointVal] = await Promise.all([
    commonApi({
      action: "getCart",
      config: {
        token,
        locale,
      },
      data: { deviceToken, fcmToken },
    }),
    commonApi({
      action: "settings",
      parameters: [SETTINGS_CODE.couponAndRewardApply],
      config: {
        locale,
      },
    }),
    commonApi({
      action: "settings",
      parameters: [SETTINGS_CODE.rewardPointValue],
      config: {
        locale,
      },
    }),
  ])
  const userRewardPoints = await commonApi({
    action: "getProfile",
    config: {
      token,
      locale,
    },
  })
    .then((data) => data?.[1]?.data?.earnedRewards || 0)
    .catch(() => 0)
  const [cartList, couponAndRewardApply, rewardPointValue] = await Promise.all([
    JSON.stringify(cartData?.[1]?.data || []),
    JSON.stringify(couponAndReward?.[1]?.data?.details || {}),
    JSON.stringify(rewardPointVal?.[1]?.data?.details || {}),
  ])
  return { props: { cartList, couponAndRewardApply, rewardPointValue, userRewardPoints } }
}
