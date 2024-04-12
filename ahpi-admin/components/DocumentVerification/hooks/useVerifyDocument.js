/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useEffect, useState } from "react"
import Toast from "utils/toast"

const useVerifyDocument = ({ userDetails, setOpen, getList, pagination }) => {
  const [documentDetails, setDocument] = useState()
  const [documentList, setDocumentList] = useState()
  const [paginate, setPaginate] = useState()
  const [reason, setReason] = useState()
  const [loading, setLoading] = useState()

  useEffect(() => {
    if (userDetails?.documents?.length > 0) {
      setDocumentList(userDetails.documents.filter((x) => x.isVerified !== true))
      setDocument(userDetails.documents.find((x) => x.isVerified !== true))
      setPaginate(0)
    }
  }, [userDetails.documents])

  const closeModal = () => {
    setOpen(false)
    setDocument()
    setDocumentList()
    setPaginate()
    setReason()
    getList({
      options: {
        offset: pagination.offset,
        limit: pagination.perPage,
      },
      unVerified: true,
    })
  }

  const onSubmit = async (isVerified) => {
    const payload = {
      reason,
      isVerified,
      userId: userDetails._id,
    }
    try {
      setLoading(true)
      await commonApi({
        action: "verifyDocument",
        parameters: [documentDetails._id],
        data: payload,
      }).then(async ([, { message = "" }]) => {
        if (documentList?.length !== paginate + 1) {
          setReason()
          if (isVerified === true) {
            Toast(message, "success")
          } else {
            Toast("Document rejection successfully.", "success")
          }
          setPaginate(paginate + 1)
          setDocument(documentList.find((x, index) => index === paginate + 1))
        } else {
          closeModal()
          Toast("All documents verified successfully.", "success")
          getList({
            options: {
              offset: pagination.offset,
              limit: pagination.perPage,
            },
            unVerified: true,
          })
        }
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  return {
    onSubmit,
    closeModal,
    documentDetails,
    setReason,
    loading,
    reason,
    paginate,
    documentList,
  }
}
export default useVerifyDocument
