/* eslint-disable react/button-has-type */
import PaymentFail from "components/PaymentFail/index"
import { getCookie } from "cookies-next"
import React from "react"
import routes from "utils/routes"

const PaymentFailIndex = ({ msg }) => {
  return <PaymentFail msg={msg} />
}

export default PaymentFailIndex

export async function getServerSideProps({ req, res, query }) {
  const { msg } = query
  const token = getCookie("token", { req, res })

  if (!token) {
    return {
      redirect: {
        destination: routes.login,
        permanent: false,
      },
    }
  }

  if (!msg) {
    return {
      redirect: {
        destination: routes.home,
        permanent: true,
      },
    }
  }

  return {
    props: {
      msg,
    },
  }
}
