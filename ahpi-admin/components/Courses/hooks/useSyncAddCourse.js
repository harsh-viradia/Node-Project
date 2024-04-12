import { hasAccessTo } from "@knovator/can"
import React, { useState } from "react"
import AppContext from "utils/appContext"
import { MODULES } from "utils/constant"

const useSyncAddCourse = ({ permission }) => {
  const { courseData, sectionData } = React.useContext(AppContext)

  const [basicInfoTab, setBasicInfoTab] = useState(true)
  const [messagesTab, setMessagesTab] = useState(false)
  const [sectionTab, setSectionTab] = useState(false)
  const [pricingTab, setPricingTab] = useState(false)
  const [courseApproval, setCourseApproval] = useState(false)
  const isAllow = (key) => hasAccessTo(permission, MODULES.COURSE, key)

  const basicInfo = () => {
    setBasicInfoTab(true)
    setSectionTab(false)
    setMessagesTab(false)
    setPricingTab(false)
  }

  const messages = () => {
    setSectionTab(false)
    setBasicInfoTab(false)
    setMessagesTab(true)
    setPricingTab(false)
  }

  const section = () => {
    setSectionTab(true)
    setBasicInfoTab(false)
    setPricingTab(false)
    setMessagesTab(false)
  }
  const pricing = () => {
    setSectionTab(false)
    setBasicInfoTab(false)
    setPricingTab(true)
    setMessagesTab(false)
  }

  return {
    basicInfoTab,
    pricingTab,
    messagesTab,
    sectionTab,
    pricing,
    section,
    messages,
    basicInfo,
    courseData,
    sectionData,
    isAllow,
    courseApproval,
    setCourseApproval,
  }
}

export default useSyncAddCourse
