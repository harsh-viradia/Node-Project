import ProfileSetting from "components/ProfileSetting/index"
import React from "react"
import privateRoute from "utils/privateRoute"

const ProfileSettingIndex = ({ pageProps }) => {
  return <ProfileSetting {...pageProps} />
}

export default ProfileSettingIndex
export const getServerSideProps = privateRoute()
