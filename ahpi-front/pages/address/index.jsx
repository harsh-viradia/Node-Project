import commonApi from "api/index"
import Address from "components/ProfileSetting/address"
import { getCookie } from "cookies-next"
import React from "react"
import { DEFAULT_LIMIT } from "utils/constant"
import routes from "utils/routes"

const yourAddresses = ({ addressData }) => {
  return <Address addressData={JSON.parse(addressData)} />
}

export default yourAddresses

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
  const [data] = await Promise.all([
    commonApi({
      action: "addressList",
      config: {
        token,
        locale,
      },
      data: {
        options: {
          page: query?.page || 1,
          limit: DEFAULT_LIMIT,
          sort: { createdAt: -1 },
        },
        query: {},
      },
    }),
  ])
  const [addressData] = await Promise.all([JSON.stringify(data?.[1]?.data || {})])
  return { props: { addressData } }
}
