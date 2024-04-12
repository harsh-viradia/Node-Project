/* eslint-disable unicorn/prevent-abbreviations */
import commonApi from "api/index"
import { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
// import { CACHE_KEY } from "utils/constant"

const useCategory = () => {
  const [category, setCategory] = useState([])
  const [subCategory, setSubCategory] = useState([])
  const [page, setPage] = useState(1)
  const [restrict, setRestrict] = useState(true)
  const [selectedCategoryName, setSelectedCategoryName] = useState()
  const { category: Category } = useContext(AppContext)

  const getCategories = async () => {
    await commonApi({
      action: "getCategory",
      data: {
        options: { select: ["name", "slug"], pagination: false },
      },
      config: {
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.CATEGORY,
        // },
      },
    }).then(([error, { data: responseData }]) => {
      if (error) return false
      const { data, paginator } = responseData
      setRestrict(!paginator?.hasNextPage)
      if (page === 1) setCategory(data)
      else setCategory([...Category, ...data])
      return false
    })
  }

  const handleClickParentCategory = (sub, name) => {
    setSubCategory(sub)
    setSelectedCategoryName(name)
  }

  const nextPageData = () => {
    setPage(page + 1)
  }

  useEffect(() => {
    getCategories()
  }, [page])

  return { category, setRestrict, subCategory, selectedCategoryName, handleClickParentCategory, nextPageData, restrict }
}

export default useCategory
