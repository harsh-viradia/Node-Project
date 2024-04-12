import commonApi from "api"
import React, { useEffect, useState } from "react"
import ReactHtmlParser from "react-html-parser"
import OrbitLoader from "widgets/loader"

const TermsOfUse = () => {
  const [termsData, setTermsData] = useState([])
  const [loading, setLoading] = useState(false)
  const privacyPolicy = async () => {
    try {
      setLoading(true)
      await commonApi({ action: "termsCondtion", common: true, module: "TERMS_AND_CONDITIONS" }).then(([, data = {}]) =>
        setTermsData(data)
      )
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    privacyPolicy()
  }, [])

  return (
    <div className="w-full px-4 py-10 mx-auto max-w-7xl sm:px-6 lg:px-8">
      {loading && <OrbitLoader relative />}
      <div className="container my-6">{ReactHtmlParser(termsData?.data?.details)}</div>
    </div>
  )
}

export default TermsOfUse
