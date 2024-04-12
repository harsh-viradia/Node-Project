// import CloseIcon from "icons/closeIcon"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React, { useEffect, useState } from "react"
import routes from "utils/routes"
import DevToolsPopup from "widgets/alertPopup"
import Button from "widgets/button"

const CertificateNotFoundIndex = () => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    setLoading(false)
  }, [])

  return (
    <DevToolsPopup open>
      <div className="flex flex-col justify-center items-center ">
        <img src="/images/cross.gif" loading="lazy" className="w-40 h-40 rounded-md justify-center" alt="" />
        <div className="text-lg font-semibold text-center mb-3">Certificate not verified by AHPI</div>
        <Button
          title={t("home")}
          loading={loading}
          onClick={() => {
            setLoading(true)
            router.push(routes.home)
          }}
        />
      </div>
    </DevToolsPopup>
  )
}

export default CertificateNotFoundIndex
