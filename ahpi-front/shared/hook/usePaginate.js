/* eslint-disable unicorn/no-useless-undefined */
import commonApi from "api"
import { useState } from "react"
import { DEFAULT_LIMIT } from "utils/constant"

const usePaginate = (properties) => {
  const [list, setList] = useState()
  const [loading, setLoading] = useState(false)
  const [paginate, setPaginate] = useState({})

  const {
    limit = DEFAULT_LIMIT,
    populate,
    fixedQuery = {},
    sort = {
      createdAt: -1,
    },
    search = undefined,
    action = "",
    page = 1,
    parameters,
  } = properties

  const getList = async (parameter = {}) => {
    const { query = {}, options = {}, filter = "", others = {} } = parameter
    setLoading(true)
    try {
      const [, { data = {} }] = await commonApi({
        data: {
          filter: filter || undefined,
          search,
          query: {
            ...fixedQuery,
            ...query,
          },
          options: {
            populate,
            limit,
            page,
            sort,
            ...options,
          },
          ...others,
        },
        action,
        parameters,
      })
      const { data: rows = [], paginator } = data
      setPaginate({
        ...paginator,
      })
      setList(rows)
      setLoading(false)
    } catch {
      // eslint-disable-next-line no-console
      setLoading(false)
    }
  }

  return {
    list,
    loading,
    paginate,
    getList,
    setList,
    setPaginate,
  }
}

export default usePaginate
