/* eslint-disable no-underscore-dangle */
/* eslint-disable consistent-return */
/* eslint-disable unicorn/prevent-abbreviations */

import commonApi from "api/index"
import { useEffect, useState } from "react"

const useReview = ({ courseId, reviewWithPagination, showAddReviewBlock }) => {
  const [loading, setLoading] = useState(false)
  const [reviewList, setReviewList] = useState([])
  const [showYourReview, setShowYourReview] = useState({})
  const [showNext, setShowNext] = useState()
  const [page, setPage] = useState()

  const getReviewList = async (currentPage = 1) => {
    try {
      setLoading(true)
      await commonApi({
        action: "getReviewList",
        data: {
          query: { courseId, isActive: true, stars: { $gt: 0 } },
          options: {
            page: currentPage,
            limit: 10,
            sort: {
              createdAt: -1,
            },
            populate: [
              {
                path: "userId",
                populate: { path: "profileId" },
                select: "profileId",
              },
            ],
          },
        },
      }).then(async ([error, { data: responseData = [] }]) => {
        if (error) return
        setShowYourReview(responseData?.userReview?.[0])
        setShowNext(responseData?.paginator?.hasNextPage)
        setPage(responseData?.paginator?.currentPage)
        if (currentPage === 1) {
          setReviewList(responseData?.data)
        } else {
          setReviewList([...reviewList, ...responseData.data])
        }
        return false
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setShowNext(reviewWithPagination?.paginator?.hasNextPage)
    setPage(reviewWithPagination?.paginator?.currentPage)
    setReviewList(reviewWithPagination?.data)
    setShowYourReview(reviewWithPagination?.userReview?.[0])
  }, [])
  useEffect(() => {
    if (showAddReviewBlock === 0) getReviewList()
  }, [showAddReviewBlock])
  return {
    loading,
    reviewList,
    getReviewList,
    showYourReview,
    showNext,
    page,
    setPage,
  }
}

export default useReview
