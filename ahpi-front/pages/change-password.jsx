import ProfileSetting from "components/ProfileSetting/changePassword"
import React from "react"
import privateRoute from "utils/privateRoute"

const ChangePassword = () => {
  return <ProfileSetting />
}

export default ChangePassword
export const getServerSideProps = privateRoute()
