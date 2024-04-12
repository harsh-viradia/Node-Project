import commonApi from "api/index"
import AddAddress from "components/ProfileSetting/addAddress"
import { getCookie } from "cookies-next"
import React from "react"
import routes from "utils/routes"

const yourAddresses = ({ addressData, addressId }) => {
  return <AddAddress addressData={addressData && JSON.parse(addressData)} addressId={addressId} />
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
  if (!query?.id) {
    return { props: {} }
  }
  const [data] = await Promise.all([
    commonApi({
      action: "getAddress",
      parameters: [query?.id],
      config: {
        token,
        locale,
      },
    }),
  ])
  const [addressData] = await Promise.all([JSON.stringify(data?.[1]?.data || {})])
  return { props: { addressData, addressId: query?.id } }
}
