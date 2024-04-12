import { useRouter } from "next/router"
import React, { useEffect, useState } from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import routes from "utils/routes"
import Button from "widgets/button"

const PaymentFail = ({ msg }) => {
  const router = useRouter()

  const [loading, setLoading] = useState(false)

  useEffect(() => {
    return setLoading(false)
  }, [])

  return (
    <LayoutWrapper>
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="flex flex-col items-center justify-center">
          <img src="/images/remove.png" height={50} width={50} alt="" />
          <h1 className="text-red text-4xl pt-3 font-bold text-red-500">Payment Failed</h1>
          <p className="my-5 text-gray-500 border-solid border-2 border-dark-gray p-4 max-w-4xl text-centerlg:mt-12 mt-7 lg:px-16">
            {msg}
          </p>
          <Button
            title="Retry Payment"
            className="bg-red border-none"
            darkHoverKind="red"
            loading={loading}
            onClick={() => {
              setLoading(true)
              router.push({
                pathname: routes.cart,
                permanent: true,
              })
            }}
          />
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default PaymentFail
