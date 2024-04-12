import CategoryAnalytics from "components/Analytics/CategoryAnalytics"
import React from "react"
import privateRoute from "utils/privateRoute"

const CategoryAnalyticsIndex = ({ pageProps }) => {
  return <CategoryAnalytics {...pageProps} />
}
export default CategoryAnalyticsIndex
export const getServerSideProps = privateRoute()
