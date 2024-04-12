/* eslint-disable unicorn/prefer-array-some */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable unicorn/better-regex */
/* eslint-disable prefer-regex-literals */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */

import commonApi from "api"
import { useEffect, useState } from "react"
import { API_ERROR_RES, DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT, MODULE_ACTIONS } from "utils/constant"
import Toast from "utils/toast"

const useQuestionsAndDocuments = ({
  setValue,
  reset,
  setValue2,
  reset2,
  defaultValues,
  userDetails,
  open,
  setOpen,
  tabIndex,
  setTabIndex,
  getListData,
  pagination,
  isAllow,
}) => {
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [updatedBy, setUpdatedBy] = useState()
  const [deletedData, setDeletedData] = useState([])

  const getAllQuestion = async (offset = DEFAULT_CURRENT_PAGE) => {
    const payload = {
      userId: userDetails?._id,
      options: {
        offset,
        limit: DEFAULT_LIMIT,
      },
    }

    try {
      setLoading(true)
      await commonApi({ action: "list", module: "questions", common: true, data: payload }).then(
        async ([, { code, message = "", data = {} }]) => {
          if (code === API_ERROR_RES) {
            Toast(message, "error")
          } else {
            const newData = data.data?.map((x) => {
              return {
                ...x,
                ansIds: x?.answer?.[0]?.ansIds?.[0],
              }
            })
            setUpdatedBy(data?.data?.[0]?.answer?.[0]?.updatedBy?.emails?.[0]?.email)
            setValue("data", newData)
          }
          return false
        }
      )
    } finally {
      setLoading(false)
    }
  }

  const onSubmit = async (values) => {
    const valueData = values?.data?.map((itm) => {
      return {
        userId: userDetails?._id,
        queType: 1,
        queId: itm._id,
        ansIds: [itm.ansIds],
        takenTime: "00:00:00",
        sts: 1,
      }
    })
    try {
      setLoading2(true)

      await commonApi({ action: "saveQuestions", data: { data: valueData }, common: false }).then(
        async ([, { code, message = "" }]) => {
          if (code === API_ERROR_RES) {
            Toast(message, "error")
          } else {
            Toast(message)
            reset({ ...defaultValues })
            reset2({ ...defaultValues })
            setOpen(false)
            setUpdatedBy()
            getListData({ offset: pagination?.offset || 0, limit: pagination?.perPage || DEFAULT_LIMIT })
          }
          return false
        }
      )
    } finally {
      setLoading2(false)
    }
  }

  const getAllDocuments = async () => {
    const payload = {
      userId: userDetails?._id,
      options: {
        offset: DEFAULT_CURRENT_PAGE,
        limit: DEFAULT_LIMIT,
      },
    }

    try {
      setLoading(true)
      await commonApi({ action: "getDocList", data: payload }).then(async ([, { code, message = "", data = {} }]) => {
        if (code === API_ERROR_RES) {
          Toast(message, "error")
        } else {
          const newData = data?.data?.map((x) => {
            return {
              ...x,
              documentId: x?.documents[0]?.fileId?.[0],
            }
          })
          setUpdatedBy(data?.data?.[0]?.documents?.[0]?.updatedBy?.emails?.[0]?.email)
          setValue2("data", newData)
        }
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  const onSubmit2 = async (values) => {
    if (values?.data?.length > 0 && values.data.find((x) => x.documentId)) {
      const filterData = values.data.filter((x) => x.documentId)
      const valueData = filterData?.map((itm) => {
        return {
          userId: itm.documentId?.userId || itm.documents?.[0]?.userId,
          fileId: itm.documentId?.id || itm.documentId?._id,
          documentId: itm.documentId?.fileId || itm.documents?.[0]?.documentId,
          docNm: itm.documentId?.name,
        }
      })

      let removeDocuments = []
      if (deletedData?.length) {
        const removed = deletedData.filter((x) => x.documents)
        removeDocuments = removed?.map((x) => {
          return {
            userId: userDetails?._id,
            documentId: x.documents?.[0]?.documentId,
          }
        })
      }
      try {
        setLoading2(true)
        await commonApi({ action: "uploadDoc", data: { documents: valueData, removeDocuments } }).then(
          async ([, { code, message }]) => {
            if (code === "ERROR") {
              Toast(message, "error")
            } else {
              Toast(message)
              reset({ ...defaultValues })
              reset2({ ...defaultValues })
              setOpen(false)
              setTabIndex(1)
              setUpdatedBy()
              getListData({ offset: pagination?.offset || 0, limit: pagination?.perPage || DEFAULT_LIMIT })
            }
            return false
          }
        )
      } finally {
        setLoading2(false)
      }
    } else {
      Toast("Upload atleast one document.", "error")
    }
  }

  useEffect(() => {
    if (tabIndex === 2 && open && isAllow(MODULE_ACTIONS.DOCUMENTLIST)) {
      getAllDocuments()
    }
  }, [tabIndex, open])

  useEffect(() => {
    if (tabIndex === 1 && open && isAllow(MODULE_ACTIONS.QUESTIONLIST)) {
      getAllQuestion()
    }
  }, [tabIndex, open])

  return {
    loading,
    onSubmit,
    loading2,
    onSubmit2,
    updatedBy,
    setUpdatedBy,
    setDeletedData,
    deletedData,
  }
}

export default useQuestionsAndDocuments
