/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useRouter } from "next/router"
import { useState } from "react"
import { MATERIAL_TYPES } from "utils/constant"

const useDocs = ({ reset, defaultValues, setSectionTitle, setOpen, secId, getMaterialList }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [isChecked, setIsChecked] = useState(false)

  const addUpdateDocs = async (values) => {
    const { id, ...rest } = values
    const data = {
      ...rest,
      courseId: router?.query?.courseId,
      userId: router?.query?.coachId,
      secId,
      type: MATERIAL_TYPES.DOCS,
      docDetails: undefined,
    }
    try {
      setLoading(true)
      await commonApi({
        action: id ? "update" : "addMaterial",
        module: id ? "courses/sections/materials" : "",
        common: !!id,
        parameters: [id],
        data,
      }).then(async ([error]) => {
        // eslint-disable-next-line promise/always-return
        if (error) {
          return ""
        }
        setOpen(false)
        reset({ ...defaultValues })
        setSectionTitle("Add")
        getMaterialList(secId)
        return ""
      })
    } finally {
      setLoading(false)
    }
  }

  const updateCanDownloadToggle = async (values, canDownload) => {
    const { _id: id } = values
    const data = {
      canDownload,
    }
    setIsChecked(!isChecked)
    try {
      setLoading(true)
      await commonApi({
        action: "partialUpdateMaterial",
        parameters: [id],
        data,
      }).then(async ([error]) => {
        // eslint-disable-next-line promise/always-return, no-useless-return
        if (error) {
          setIsChecked(!isChecked)
          return false
        }
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  return {
    addUpdateDocs,
    loading,
    updateCanDownloadToggle,
    isChecked,
  }
}
export default useDocs
