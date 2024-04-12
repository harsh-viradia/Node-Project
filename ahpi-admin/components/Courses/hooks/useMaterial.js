/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import commonApi from "api"
import { useRouter } from "next/router"
import { useState } from "react"
import { DEFAULT_LIMIT } from "utils/constant"

const useMaterial = ({ secId }) => {
  const router = useRouter()
  const [materialList, setMaterialList] = useState([])
  const [deleteMaterial, setDeleteMaterial] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const getMaterialList = async () => {
    const payload = {
      options: {
        offset: 0,
        limit: DEFAULT_LIMIT,
        populate: ["docId", "vidId"],
        sort: { seq: 1 },
      },
      query: {
        userId: router?.query?.coachId || undefined,
        courseId: router?.query?.courseId,
        secId,
      },
    }
    try {
      setLoading2(true)
      await commonApi({ action: "add", module: "courses/sections/materials", common: true, data: payload }).then(
        ([, { data = {} }]) => {
          setMaterialList(data.data)
          return false
        }
      )
    } finally {
      setLoading2(false)
    }
  }

  const handleConfirmation = async () => {
    const data = {
      ids: [deleteMaterial?.id],
    }
    await commonApi({
      action: "deleteMaterials",
      data,
    }).then(async () => {
      // Toast(message, "success")
      getMaterialList()
      return false
    })
  }
  const onDragEnd = async (result) => {
    if (!result.destination || result.destination.index === result.source.index) return
    await commonApi({
      action: "edit",
      module: "courses/sections/materials/partial-update",
      parameters: [result.draggableId],
      common: true,
      data: {
        seq: result.destination.index,
      },
    }).then(([error]) => {
      if (error) return false
      getMaterialList()
      return false
    })
  }
  return {
    getMaterialList,
    materialList,
    handleConfirmation,
    deleteMaterial,
    setDeleteMaterial,
    setMaterialList,
    loading2,
    onDragEnd,
  }
}
export default useMaterial
