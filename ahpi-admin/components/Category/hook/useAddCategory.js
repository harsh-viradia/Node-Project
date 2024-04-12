/* eslint-disable no-underscore-dangle */
import commonApi from "api"
import { useEffect, useState } from "react"
import { CACHE_KEY } from "utils/constant"
import Toast from "utils/toast"
import { capitalizeFirstLetter, debounce } from "utils/util"

const useAddCategory = ({ list, getList, open, setOpen, editId = {}, limit, offset, setEditId, searchValue }) => {
  const [categoryOptions, setCategoryOptions] = useState([])
  const [selectedImg, setSelectedImg] = useState()
  const [selectedParentCategory, setSelectedParentCategory] = useState()
  const [loading, setLoading] = useState(false)

  const getAllParentCategory = debounce(async (inputValue, callback) => {
    if (!list) return false
    const payload = {
      exclude: editId?._id,
      query: {
        _id: editId?._id ? { $nin: editId?._id } : undefined,
        searchColumns: ["name"],
        search: inputValue,
        filter: {
          isActive: true,
        },
      },
    }
    await commonApi({ action: "list", module: "category", common: true, data: payload }).then(([, { data = {} }]) => {
      const listData = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        // eslint-disable-next-line promise/no-callback-in-promise
        callback?.(listData)
      } else {
        setCategoryOptions(listData)
      }
      return false
    })

    return false
  }, 500)

  useEffect(() => {
    if (open && list) {
      getAllParentCategory()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const onSubmit = async (values) => {
    const payload = {
      name: capitalizeFirstLetter(values.name),
      description: values.description,
      image: selectedImg?.id || undefined,
      topics: values.topics ? values.topics.map((a) => a.value) : [],
      parentCategory: selectedParentCategory ? [selectedParentCategory.value] : [],
    }
    try {
      setLoading(true)
      await commonApi({
        action: editId._id ? "update" : "add",
        parameters: [editId._id],
        module: "category",
        common: true,
        data: payload,
        config: {
          headers: {
            [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.CATEGORY,
          },
        },
      }).then(async ([error, response]) => {
        if (error) {
          return
        }
        const { message = "" } = response
        Toast(message, "success")
        setOpen(false)
        setEditId()
        getList({
          options: {
            limit,
            offset,
          },
          query: {
            searchColumns: ["name", "parentCategory.name"],
            search: searchValue,
          },
        })
        // eslint-disable-next-line consistent-return
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  return {
    getAllParentCategory,
    categoryOptions,
    selectedParentCategory,
    setSelectedParentCategory,
    onSubmit,
    selectedImg,
    setSelectedImg,
    loading,
  }
}
export default useAddCategory
