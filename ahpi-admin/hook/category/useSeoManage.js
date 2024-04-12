/* eslint-disable no-underscore-dangle */
/* eslint-disable promise/always-return */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import { useEffect, useState } from "react"
import { API_ERROR_RESPONSE, API_SUCCESS_RESPONSE, CACHE_KEY, MODULE_ACTIONS, MODULES } from "utils/constant"
import Toast from "utils/toast"
import { checkEmptyStringInsideObject } from "utils/util"

const useSeoManage = ({ reset, defaultValues, open, setOpen, categoryDetail, module, permission }) => {
  const [selectedImage, setSelectedImage] = useState()
  const [checkExsist, setCheckExsist] = useState()
  const [seoData, setSeoData] = useState({})
  const [loading, setLoading] = useState(false)
  const [index, setIndex] = useState(0)
  const [hasPermissions, setPermissions] = useState(false)

  const onSubmit = async (values) => {
    setLoading(true)
    const payload = checkEmptyStringInsideObject(values)
    try {
      await commonApi({
        action: !checkExsist ? "createSeo" : "updateSeo",
        parameters: [seoData?._id],
        data: {
          ...payload,
          // slug: !checkExsist ? categoryDetail.slug : undefined,
          entityNm: module,
          entityId: categoryDetail._id,
        },
        config: {
          headers: {
            [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.SEO_CATEGORY,
          },
        },
      }).then(([, { code, message }]) => {
        if (API_SUCCESS_RESPONSE === code) {
          setOpen(false)
          setCheckExsist(false)
          Toast(message, "success")
        }
      })
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setOpen(false)
    setIndex(0)
  }

  const getSeoData = async () => {
    await commonApi({
      action: "getSeoData",
      parameters: [categoryDetail?.slug, module],
      errorToast: false,
    }).then(async ([error, result]) => {
      const { response } = error || {}
      const { data } = result || {}
      if (response?.data?.code === API_ERROR_RESPONSE) {
        setCheckExsist(false)
      } else {
        setCheckExsist(true)
        setSeoData(data)
      }
    })
  }

  useEffect(() => {
    setSeoData()
    reset({ ...defaultValues })
    setSelectedImage()
    if (open) getSeoData()
  }, [open])
  useEffect(() => {
    setPermissions(
      checkExsist
        ? hasAccessTo(permission, MODULES.SEO, MODULE_ACTIONS.UPDATE)
        : hasAccessTo(permission, MODULES.SEO, MODULE_ACTIONS.CREATE)
    )
  }, [open, checkExsist])

  return { selectedImage, setSelectedImage, onSubmit, closeModal, seoData, loading, setIndex, index, hasPermissions }
}

export default useSeoManage
