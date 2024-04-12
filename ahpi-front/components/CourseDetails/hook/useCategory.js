/* eslint-disable unicorn/prevent-abbreviations */
import commonApi from "api/index"
import { useEffect, useState } from "react"
// import { CACHE_KEY } from "utils/constant"

const useCategory = () => {
  const [categoryList, setCategoryList] = useState([])

  const getCategories = async () => {
    await commonApi({
      action: "getCategory",
      config: {
        // headers: {
        //   [CACHE_KEY.KEY.CASHING_KEY]: CACHE_KEY.VALUE.CATEGORY,
        // },
      },
      data: { options: { page: 1 } },
    }).then(
      ([
        error,
        {
          data: { data = [] },
        },
      ]) => {
        if (error) return
        setCategoryList(data)
        // eslint-disable-next-line consistent-return
        return false
      }
    )
  }
  useEffect(() => {
    getCategories()
  }, [])
  return { categoryList }
}

export default useCategory
