import commonApi from "api/index"
import PurchaseHistory from "components/ProfileSetting/PurchaseHistory"
import { getCookie } from "cookies-next"
import React from "react"
import { DEFAULT_LIMIT, POPULATE_PARAMS } from "utils/constant"
import routes from "utils/routes"

const PurchaseHistoryIndex = ({ orderData }) => {
  return <PurchaseHistory orderData={JSON.parse(orderData)} />
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
  const [purchaseHistoryData] = await Promise.all([
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
          populate: POPULATE_PARAMS.PURCHASE_HISTORY_PARAMS,
        },
        query: {
          orderNo: query?.orderNo || undefined,
        },
        filter: {
          sts: 1,
        },
      },
    }),
  ])
  const [orderData] = await Promise.all([JSON.stringify(purchaseHistoryData?.[1]?.data || {})])
  return { props: { orderData } }
}
