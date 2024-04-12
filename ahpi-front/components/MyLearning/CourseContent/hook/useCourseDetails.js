/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import commonApi from "api/index"
import { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"

const useCourseDetails = ({ courseDetails, section, token, isFromAdmin }) => {
  const [loading, setLoading] = useState(false)
  const [sectionData, setSectionData] = useState([])
  const [progressData, setProgressData] = useState({})
  const [showAddReviewBlock, setShowAddReviewBlock] = useState(0)
  const [activeSection, setActiveSection] = useState()
  const [videoPromotionalURL, setPromotionalVideoUrl] = useState()
  const [goBackToOGM, setGoBackToOGM] = useState(false)
  const [quizReset, setQuizReset] = useState(false)
  const [learnerMarks, setLearnerMarks] = useState()
  const { userData = {}, videoURL, setVideoUrl, setCurrentCourseContent } = useContext(AppContext)
  const getSectionByCourse = async (currentId, isCompleted) => {
    let foundCurrent = !currentId
    let activeSec
    const shareData = section?.map((sec, index) => {
      sec.materials = sec.materials?.map((mat) => {
        mat.isLocked = foundCurrent
        mat.isLast = false
        if (mat._id === currentId && !isCompleted) {
          mat.isLast = true
          foundCurrent = true
          activeSec = index
        }
        return mat
      })
      if (index === 0 && (!currentId || isCompleted) && sec.materials?.[0]) {
        sec.materials[0].isLast = true
        sec.materials[0].isLocked = false
        activeSec = 0
      }
      return sec
    })
    setActiveSection(activeSec)
    setSectionData(shareData)
  }
  const getProgressData = async (courseId, showReviewBlock = false) => {
    await commonApi({
      action: "myLearning",
      config: { token },
      data: {
        query: { courseId: [courseId] },
        options: {
          page: 1,
          limit: 1,
        },
      },
    }).then(async ([, { data: responseData = {} }]) => {
      setShowAddReviewBlock(responseData.data?.[0]?.sts === 2 && showReviewBlock ? 1 : showAddReviewBlock + 1)
      setProgressData(responseData.data?.[0] || {})
      if (responseData.data?.[0]?.sts === 2 && showReviewBlock) return false
      getSectionByCourse(responseData.data?.[0]?.currentId, responseData.data?.[0]?.sts === 2)
      return responseData
    })
  }

  const updateProgress = async ({
    secId,
    materialId,
    nextId,
    sts,
    playFrom,
    showReviewBlock = false,
    quizObj,
    callback = () => {},
  }) => {
    if (progressData.sts === 2 || isFromAdmin) return
    const payload = {
      userId: userData.id,
      courseId: courseDetails._id,
      secId,
      materialId,
      totalMaterial: courseDetails.totalLessons,
      nextId,
      playFrom: playFrom || "00:00:00",
      sts,
      quizObj,
    }
    await commonApi({
      action: "courseProgress",
      config: { token },
      data: payload,
    }).then(async ([, { data }, error]) => {
      if (error) return error
      // eslint-disable-next-line promise/no-callback-in-promise
      callback()
      getProgressData(courseDetails._id, showReviewBlock)
      if (data?.resetQuiz) {
        setQuizReset(true)
        setLearnerMarks(data?.totalMarks)
      }

      return false
    })
  }

  useEffect(() => {
    if (isFromAdmin) getSectionByCourse(true, true)
    else getProgressData(courseDetails?._id)
    setPromotionalVideoUrl({
      mpdUrl: courseDetails?.vidId?.vidObj?.mpdUrl,
      hslUrl: courseDetails?.vidId?.vidObj?.hslUrl,
      id: courseDetails?.vidId?._id,
      autoPlay: false,
      isPosterVideo: true,
    })
    return () => setCurrentCourseContent()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const updateVideoProgress = (sts, time) => {
    updateProgress({
      secId: videoURL.secId,
      materialId: videoURL.materialId,
      nextId: videoURL.nextId,
      sts,
      playFrom: time,
    })
    if (sts) {
      setVideoUrl({
        ...videoURL,
        isPosterVideo: true,
      })
    }
  }

  const closeReviewBox = () => {
    setShowAddReviewBlock(0)
    if (progressData?.isFromOgm || progressData?.isFromOsc) setGoBackToOGM(true)
  }
  return {
    loading,
    section,
    progressData,
    updateProgress,
    setLoading,
    sectionData,
    videoURL,
    setVideoUrl,
    updateVideoProgress,
    showAddReviewBlock,
    setShowAddReviewBlock,
    activeSection,
    videoPromotionalURL,
    closeReviewBox,
    goBackToOGM,
    setGoBackToOGM,
    quizReset,
    setQuizReset,
    learnerMarks,
  }
}

export default useCourseDetails
