/* eslint-disable no-underscore-dangle */
/* eslint-disable unicorn/consistent-function-scoping */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import usePaginate from "hook/common/usePaginate"
import { useEffect, useState } from "react"
import { DEFAULT_CURRENT_PAGE, DEFAULT_LIMIT, MODULE_ACTIONS, MODULES } from "utils/constant"
import { debounce } from "utils/util"

const useLearner = ({ permission }) => {
  const [searchValue, setSearchValue] = useState("")
  const [openFilter, setOpenFilter] = useState(false)
  const [cityOptions, setCityOptions] = useState([])
  const [stateOptions, setStateOptions] = useState([])
  const [filter, setFilter] = useState()
  const isAllow = (key) => hasAccessTo(permission, MODULES.LEARNER, key)

  const {
    list = [],
    getList,
    paginate,
    loading,
    setList,
  } = usePaginate({
    module: "lerner",
    fixedQuery: {
      search: searchValue,
      searchColumns: ["name", "email", "mobNo"],
    },
    setOpenFilter,
  })

  const onPaginationChange = (offset, limit) => {
    return getList({
      options: {
        offset,
        limit,
      },
      query: {
        search: searchValue,
      },
    })
  }
  const handleApplyFilter = (sendObject) => {
    setFilter(sendObject)
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
      },
      filter: sendObject,
    })
  }

  const onClickClearFilter = () => {
    setFilter()
    getList({
      options: {
        offset: 0,
        limit: paginate?.perPage || DEFAULT_LIMIT,
      },
      query: {
        search: searchValue,
      },
    })
  }

  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL))
      getList({
        options: {
          offset: 0,
          limit: paginate?.perPage || DEFAULT_LIMIT,
        },
        query: {
          search: searchValue,
        },
        filter,
      })
  }, [searchValue])

  const getAllCities = debounce(async (inputValue, callback) => {
    const payload = {
      page: DEFAULT_CURRENT_PAGE,
      limit: DEFAULT_LIMIT,
      query: {},
    }
    if (inputValue) {
      payload.query.search = inputValue
      payload.query.searchColumns = ["name"]
    }
    await commonApi({ action: "findAllCities", data: payload }).then(([, response = {}]) => {
      const { data = {} } = response
      const citiesList = data.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))
      if (inputValue) {
        callback?.(citiesList)
      } else {
        setCityOptions(citiesList)
      }
      return false
    })
  }, 500)

  const getAllStates = debounce(async (inputValue, callback) => {
    const payload = {
      page: DEFAULT_CURRENT_PAGE,
      limit: DEFAULT_LIMIT,
      query: {},
    }
    if (inputValue) {
      payload.query.search = inputValue
      payload.query.searchColumns = ["name", "code", "ISOCode2"]
    }
    await commonApi({ action: "provinceList", module: "state", common: true, data: payload }).then(
      ([, response = {}]) => {
        const { data = {} } = response
        const stateList = data.data?.map(({ _id, name }) => ({
          value: _id,
          label: name,
        }))
        if (inputValue) {
          callback?.(stateList)
        } else {
          setStateOptions(stateList)
        }
        return false
      }
    )
  }, 500)

  useEffect(() => {
    if (hasAccessTo(permission, MODULES.PROVINCE, MODULE_ACTIONS.GETALL)) getAllStates()
    if (hasAccessTo(permission, MODULES.CITY, MODULE_ACTIONS.GETALL)) getAllCities()
  }, [])

  return {
    ...paginate,
    loading,
    getList,
    onPaginationChange,
    list,
    setSearchValue,
    isAllow,
    setList,
    openFilter,
    setOpenFilter,
    filter,
    cityOptions,
    stateOptions,
    setFilter,
    handleApplyFilter,
    getAllStates,
    getAllCities,
    onClickClearFilter,
  }
}

export default useLearner
