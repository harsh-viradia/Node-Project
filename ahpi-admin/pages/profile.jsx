/* eslint-disable react/jsx-filename-extension */
/* eslint-disable import/no-unresolved */
/* eslint-disable prettier/prettier */
import Profile from "components/Profile"
import React from "react"
import privateRoute from "utils/privateRoute"

const ProfileIndex = ({ pageProps }) => {
  return <Profile {...pageProps} />
}
export default ProfileIndex
export const getServerSideProps = privateRoute()
