/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable unicorn/prevent-abbreviations */
import * as amplitude from "@amplitude/analytics-browser"
import commonApi from "api/index"
import { useRouter } from "next/router"
import { useContext, useEffect, useRef, useState } from "react"
import usePaginate from "shared/hook/usePaginate"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"
import routes from "utils/routes"
import Toast from "utils/toast"

const filterData = [
  { Key: "createdAt", value: -1, label: "Recently Purchased" },
  { Key: "avgStars", value: -1, label: "Most Rated" },
]
const useCourses = ({ myLearning }) => {
  const isMountRef = useRef(false)
  const router = useRouter()
  const [searchValue, setSearchValue] = useState(router.query.search)
  // const [filter, setFilter] = useState(filterData[0])
  const [activeTab, setActiveTab] = useState(
    router.query.tab === "wishList" ? 1 : router.query.tab === "completed" ? 2 : 0
  )
  const [value, setValue] = useState(searchValue)
  const { userData = {} } = useContext(AppContext)
  const {
    list: allCourseList = [],
    getList: getAllCourseList,
    paginate: allCoursePaginate,
    loading,
    setList: setAllCourseList,
    setPaginate: setAllCoursePaginate,
  } = usePaginate({
    action: "myLearning",
    fixedQuery: { searchColumns: ["course.title", "course.briefDesc"] },
  })
  const {
    list: wishlist = [],
    getList: getWishList,
    paginate: wishListPaginate,
    loading: wishlistLoading,
    setList: setWishList,
    setPaginate: setWishListPaginate,
  } = usePaginate({
    action: "getWishlist",
    fixedQuery: {
      searchColumns: ["courseNm"],
    },
  })
  const {
    list: completedList = [],
    getList: getCompletedList,
    paginate: completedListPaginate,
    loading: completedListLoading,
    setList: setCompletedList,
    setPaginate: setCompletedListPaginate,
  } = usePaginate({
    action: "myLearning",
    fixedQuery: {
      sts: 2,
      searchColumns: ["course.title", "course.briefDesc"],
    },
  })
  const getContent = (page = 1) => {
    window.scrollTo({ top: 0, behavior: "smooth" })
    switch (activeTab) {
      case 0: {
        router.push(
          {
            pathname: routes.myLearning,
            query: { page, search: searchValue },
          },
          undefined,
          { shallow: true }
        )
        // router.history.push("", "", `?page=${page}&search=${searchValue}`)
        getAllCourseList({
          query: {
            search: searchValue,
          },
          options: {
            page,
          },
        })

        break
      }
      case 1: {
        router.push(
          {
            pathname: routes.myLearning,
            query: { page, search: searchValue, tab: "wishList" },
          },
          undefined,
          { shallow: true }
        )
        // router.history.push("", "", `?page=${page}&search=${searchValue}&tab=wishList`)
        getWishList({
          query: {
            search: searchValue,
          },
          options: {
            page,
          },
        })

        break
      }
      case 2: {
        router.push(
          {
            pathname: routes.myLearning,
            query: { page, search: searchValue, tab: "completed" },
          },
          undefined,
          { shallow: true }
        )
        // router.history.push("", "", `?page=${page}&search=${searchValue}&tab=completed`)
        getCompletedList({
          query: {
            search: searchValue,
          },
          options: {
            page,
          },
        })

        break
      }
      default: {
        break
      }
    }
  }
  const onTabChange = (index) => {
    setActiveTab(index)
    setSearchValue("")
    setValue("")
  }
  useEffect(() => {
    if (isMountRef.current) {
      getContent()
    }
    isMountRef.current = true
  }, [searchValue, activeTab])
  useEffect(() => {
    switch (activeTab) {
      case 0: {
        setAllCourseList(myLearning.data)
        setAllCoursePaginate(myLearning.paginator)
        break
      }
      case 1: {
        setWishList(myLearning.data)
        setWishListPaginate(myLearning.paginator)
        break
      }
      case 2: {
        setCompletedList(myLearning.data)
        setCompletedListPaginate(myLearning.paginator)
        break
      }
      default: {
        break
      }
    }
  }, [])

  const addToWishList = async (courseDetails) => {
    const payload = {
      type: 1,
      userId: userData.id,
      courseId: courseDetails._id,
      courseNm: courseDetails.title,
    }

    await commonApi({
      action: "addToWishList",
      data: payload,
    }).then(([error, { message }]) => {
      if (error) return
      Toast(message)
      getContent()
      amplitude.track(ANALYTICS_EVENT.REMOVE_WISHLIST, {
        email: userData.email,
        courseId: payload.courseId,
        courseName: payload.courseNm,
      })
      setWishList(
        wishlist.map((a) => {
          return {
            ...a,
            courseId: {
              ...a.courseId,
              isSaved: a.courseId._id === courseDetails._id ? !a.courseId?.isSaved : a.courseId?.isSaved,
            },
          }
        })
      )
      return false
    })
  }

  return {
    loading,
    activeTab,
    allCourseList,
    searchValue,
    // filter,
    onPaginationChange: getContent,
    allCoursePaginate,
    setActiveTab,
    wishlistLoading,
    setSearchValue,
    // setFilter,
    wishlist,
    wishListPaginate,
    onTabChange,
    filterData,
    value,
    setValue,
    completedList,
    completedListLoading,
    completedListPaginate,
    addToWishList,
  }
}

export default useCourses
