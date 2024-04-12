import commonApi from "api/index"
import RewardPointsHistory from "components/ProfileSetting/rewardPointHistory"
import { getCookie } from "cookies-next"
import React from "react"
import { DEFAULT_LIMIT } from "utils/constant"
import routes from "utils/routes"

const PurchaseHistoryIndex = ({ orderData, userRewardPoints }) => {
  return <RewardPointsHistory listData={JSON.parse(orderData)} userRewardPoints={userRewardPoints} />
}

export default PurchaseHistoryIndex

export async function getServerSideProps({ query, req, res, locale }) {
  const token = getCookie("token", { req, res })
  if (!token) {
    return {
      redirect: {
        destination: routes.home,
        permanent: false,
      },
    }
  }
  const [purchaseHistoryData, userRewardPoints] = await Promise.all([
    commonApi({
      action: "purchaseHistory",
      config: {
        token,
        locale,
      },
      data: {
        options: {
          page: query?.page || 1,
          limit: DEFAULT_LIMIT,
        },
        filter: {
          sts: 1,
        },
        query: {
          $or: [{ usedRewardsForOrder: { $gt: 0 } }, { earnedRewardsForOrder: { $gt: 0 } }],
        },
      },
    }),
    commonApi({
      action: "getProfile",
      config: {
        token,
        locale,
      },
    })
      .then((data) => data?.[1]?.data?.earnedRewards || 0)
      .catch(() => 0),
  ])
  const [orderData] = await Promise.all([JSON.stringify(purchaseHistoryData?.[1]?.data || {})])
  return { props: { orderData, userRewardPoints } }
}
