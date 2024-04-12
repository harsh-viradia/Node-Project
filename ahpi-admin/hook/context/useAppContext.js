import React from "react"

const useAppContext = () => {
  const [loginData, setLoginData] = React.useState({})
  const [userData, setUserData] = React.useState({})
  const [selectedRows, setSelectedRows] = React.useState([])
  const [courseData, setCourseData] = React.useState({})
  const [sectionData, setSectionData] = React.useState([])
  const [collapsed, setCollapsed] = React.useState()

  return {
    loginData,
    setLoginData,
    userData,
    setUserData,
    selectedRows,
    setSelectedRows,
    courseData,
    setCourseData,
    setSectionData,
    sectionData,
    setCollapsed,
    collapsed,
  }
}

export default useAppContext
