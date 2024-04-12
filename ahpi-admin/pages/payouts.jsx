import AddPayout from "components/Instructor/addPayout"
import React from "react"
import privateRoute from "utils/privateRoute"

const AddPayoutIndex = ({ pageProps }) => {
  return <AddPayout {...pageProps} />
}

export default AddPayoutIndex

export const getServerSideProps = privateRoute({
  moduleName: false,
})
