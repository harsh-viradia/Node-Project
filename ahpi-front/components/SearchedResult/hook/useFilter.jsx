/* eslint-disable no-shadow */
/* eslint-disable default-param-last */
/* eslint-disable array-callback-return */
/* eslint-disable promise/always-return */
/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable unicorn/prevent-abbreviations */
import * as amplitude from "@amplitude/analytics-browser"
import commonApi from "api/index"
import { getCookie } from "cookies-next"
import { useRouter } from "next/router"
import { useContext, useEffect, useState } from "react"
import usePaginate from "shared/hook/usePaginate"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT, LOCALES, SETTINGS_CODE } from "utils/constant"

const useFilter = ({ courseList }) => {
  const [filterList, setFilterList] = useState([])
  const [filter, setFilter] = useState([])
  const [selectList, setSelectList] = useState([])
  const [defaultValue, setDefaultValue] = useState()
  const [handleSSR, setHandleSSR] = useState(false)
  const [courseData, setCourseData] = useState()
  const [checked, setChecked] = useState()
  const [selectId, setSelectId] = useState()
  const [options, setOptions] = useState()
  const [selectOption, setSelectOption] = useState()
  const deviceId = getCookie("deviceToken")
  const [isSetData, setData] = useState(false)
  const router = useRouter()
  const { locale } = useRouter()
  const [optList, setOptList] = useState([])
  const { userData } = useContext(AppContext)

  const getFilterList = async () => {
    const payload = {
      options: {
        page: 1,
        limit: 8,
        sort: {
          createdAt: -1,
        },
      },
      query: {
        searchColumns: ["title", "briefDesc"],
        search: router.query.search ? decodeURIComponent(router.query?.search) : undefined,
        isActive: true,
      },
      filter: {
        categories: router.query?.search ? [] : [decodeURIComponent(router.query?.slug)],
        levels: [],
        lang: [],
        topics: [],
      },
    }
    await commonApi({
      action: "courseFilter",
      parameters: [deviceId],
      data: { ...payload },
    }).then(([error, { code, data }]) => {
      if (error) return
      /* Change data according to the project need, and there is single language and topic, so we are not using the whole data here. */

      const filterData = {
        levels: data.levels,
        priceRange: data.priceRange,
        ratings: data.ratings,
      }
      setFilterList(filterData)
    })
  }

  const { list, getList, paginate, loading } = usePaginate({
    action: "getCategoryDetail",
    parameters: [deviceId],
  })

  const getContent = (page = 1, select) => {
    const ratings = selectList?.filter((x) => x?.parentCode === "RATINGS").pop()
    const selectFilterlist = selectList?.filter((x) => x?.parentCode !== "RATINGS")
    setSelectOption(ratings ? selectFilterlist?.concat([ratings]) : selectFilterlist)
    setHandleSSR(true)
    getList({
      options: {
        page,
        sort: defaultValue?.value,
      },
      query: {
        searchColumns: ["title", "briefDesc"],
        search: router.query.search ? decodeURIComponent(router.query?.search) : undefined,
        isActive: true,
      },
      filter: {
        categories: router.query?.search ? [] : [decodeURIComponent(router.query?.slug)],
        levels: selectList
          ?.map((x) => {
            if (x?.parentCode === "LEVEL") return x?.code
          })
          .filter(Boolean),
        lang: selectList
          ?.map((x) => {
            if (x?.parentCode === "LANGUAGES") return x?.code
          })
          .filter(Boolean),
        topics: selectList
          ?.map((x) => {
            if (x?.parentCode === "TOPICS") return x?.code
          })
          .filter(Boolean),
        ratings: ratings?.code && Number(ratings?.code),
        prices: selectList
          ?.map((x) => {
            if (!x?.parentCode) return x
          })
          .filter(Boolean),
      },
    })
  }

  const getSortByList = async () => {
    await commonApi({ action: "settings", parameters: [SETTINGS_CODE.sortBy] }).then(([error, { code, data }]) => {
      if (error) return
      const sortByList = data?.details.map((details) => ({
        label: details.name,
        value: details?.keyObj,
        name: details?.name,
        // label: locale === LOCALES.ENGLISH ? details?.ENname : details?.name,
        // eName: details?.ENname,
      }))
      setDefaultValue(sortByList?.[0])
      setOptions(sortByList)
    })
  }

  // useEffect(() => {
  //   console.log("line 181", locale === LOCALES.ENGLISH, options)
  //   setOptions(options?.map((item) => ({ ...item, label: locale === LOCALES.ENGLISH && item?.name })))
  //   // setOptions(options?.map((item) => ({ ...item, label: locale === LOCALES.ENGLISH ? item?.eName : item?.name })))
  // }, [locale])

  useEffect(() => {
    getFilterList()
    getContent()
    getSortByList()
  }, [router.query?.slug])

  useEffect(() => {
    return () => {
      localStorage.removeItem("title")
    }
  }, [])

  useEffect(() => {
    const parameter = {
      options: {
        sort: {
          createdAt: -1,
        },
      },
      query: {
        searchColumns: ["title", "briefDesc"],
        search: router.query.search ? decodeURIComponent(router.query?.search) : undefined,
        isActive: true,
      },
      filter: {
        categories: router.query?.search ? [] : [decodeURIComponent(router.query?.slug)],
      },
    }
    getList(parameter)
    setCourseData(courseList?.data)
  }, [])

  useEffect(() => {
    if (handleSSR) {
      setCourseData(list)
    }
  }, [list])

  useEffect(() => {
    setChecked()
  }, [selectOption])

  const onChange = (e) => {
    const courseList = []
    const courseContent = Object.entries(filterList)
      ?.map(([key, val]) => ({ name: key, description: val }))
      .filter((x) => x.description?.length > 0)
    courseContent.map((x) => {
      courseList.push(...x.description)
    })

    const select = []
    if (e.target.checked) {
      const addObj = courseList.find((x) => (x?.parentCode ? x?._id === e.target.id : x === e.target.id))
      select.push(...filter, addObj)
      setFilter(select)
      if (getCookie("token")) {
        const filterIds = select
          .filter((item) => !item.parentCode || item.parentCode !== "RATINGS")
          .map((item) => item._id)
          .filter((id) => id !== null)
        amplitude.track(ANALYTICS_EVENT.APPLY_FILTER, {
          userEmail: userData?.email,
          userId: userData?.id,
          filterIds,
        })
      }
    } else {
      const removeObj = filter?.filter((x) => (x?.parentCode ? x?._id !== e.target.id : x !== e.target.id))
      select.push(...removeObj)
      setFilter(select)
    }
    const ratings = select?.filter((x) => x?.parentCode === "RATINGS").pop()
    const selectFilterlist = select?.filter((x) => x?.parentCode !== "RATINGS")
    setFilter(ratings ? selectFilterlist?.concat([ratings]) : selectFilterlist)
    setSelectId(ratings)
    setSelectList(select)
  }

  useEffect(() => {
    getContent(1, selectList)
  }, [selectList, defaultValue])

  const handleCheck = () => {
    if (selectOption?.length) {
      if (getCookie("token")) {
        amplitude.track(ANALYTICS_EVENT.CLEAR_FILTER, {
          userEmail: userData?.email,
          userId: userData?.id,
        })
      }
      setData(true)
      setChecked(false)
      setSelectOption([])
      setFilter([])
      setSelectList([])
    }
  }

  const onChangeSelect = (value) => {
    setDefaultValue(value)
  }

  return {
    getFilterList,
    filterList,
    onChange,
    paginate,
    courseData,
    selectOption,
    setSelectOption,
    setChecked,
    selectId,
    checked,
    handleCheck,
    loading,
    options,
    defaultValue,
    setFilter,
    setData,
    isSetData,
    onChangeSelect,
    onPaginationChange: getContent,
  }
}

export default useFilter
