/* eslint-disable prettier/prettier */
import React from "react"

const useAppContext = () => {
  const [countData, setCountData] = React.useState()
  const [userData, setUserData] = React.useState()
  const [category, setCategory] = React.useState([])
  const [currentCourseContent, setCurrentCourseContent] = React.useState()
  const [videoURL, setVideoUrl] = React.useState()
  const [notificationList, setNotificationList] = React.useState()
  const [notificationCount, setNotificationCount] = React.useState()

  return {
    countData,
    setCountData,
    userData,
    setUserData,
    category,
    setCategory,
    currentCourseContent,
    setCurrentCourseContent,
    videoURL,
    setVideoUrl,
    notificationList,
    setNotificationList,
    notificationCount,
    setNotificationCount,
  }
}

export default useAppContext
