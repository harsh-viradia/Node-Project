/* eslint-disable unicorn/no-useless-undefined */
import commonApi from "api"
import { useState } from "react"
import { DEFAULT_LIMIT, DEFAULT_SORT, INFINITY_LIMIT } from "utils/constant"

const usePaginate = (properties) => {
  const [list, setList] = useState()
  const [loading, setLoading] = useState(false)
  const [paginate, setPaginate] = useState({})

  const {
    module,
    limit = DEFAULT_LIMIT,
    populate,
    fixedQuery = {},
    sort = {
      createdAt: DEFAULT_SORT,
    },
    search = undefined,
    unVerified = undefined,
    setOpenFilter = () => false,
    action = "list",
    select,
    parameters,
    common = true,
  } = properties
  const getList = async (parameter = {}) => {
    const { query = {}, options = {}, filter = "", isActive = undefined } = parameter
    const page = options?.offset ? options.offset / (options.limit || limit) + 1 : 1
    setLoading(true)
    try {
      const [, { data = {} }] = await commonApi({
        module,
        common,
        data: {
          isActive,
          unVerified: unVerified || parameter?.unVerified,
          filter: filter || undefined,
          search,
          query: {
            ...fixedQuery,
            ...query,
          },
          options: {
            populate,
            select,
            ...(limit === INFINITY_LIMIT ? {} : { offset: 0, limit, page, sort, ...options }),
          },
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
      setOpenFilter(false)
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
  }
}

export default usePaginate
