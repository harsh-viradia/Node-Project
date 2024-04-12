/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/iframe-has-title */
import commonApi from "api"
import React, { useEffect, useState } from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import OrbitLoader from "widgets/loader"

const PreviewCertificate = ({ certificateId, open, setOpen, title = "Preview Certificate" }) => {
  const [loading, setLoading] = useState()
  const [certificate, setCertificate] = useState()
  const closeModal = () => {
    setOpen()
    setCertificate("")
  }
  useEffect(() => {
    if (certificateId && open) {
      setLoading(true)
      try {
        commonApi({ action: "add", module: `certificate/get-certificate/${certificateId}`, common: true })
          .then(([error, { data = {} }]) => {
            if (error) return false
            setCertificate(data)
            setLoading(false)
            return false
          })
          .catch(() => {})
      } catch {
        setLoading(false)
      }
    }
  }, [open])
  return (
    <DrawerWrapper
      width="max-w-6xl"
      title={title}
      modalFooter={
        <Button
          onClick={closeModal}
          title="Close"
          kind="dark-gray"
          hoverKind="white"
          className="hover:border-primary"
        />
      }
      open={open}
      setOpen={closeModal}
    >
      {loading ? (
        <OrbitLoader relative />
      ) : certificate ? (
        <div dangerouslySetInnerHTML={{ __html: certificate }} />
      ) : (
        <div>Preview not available.</div>
      )}
    </DrawerWrapper>
  )
}

export default PreviewCertificate
