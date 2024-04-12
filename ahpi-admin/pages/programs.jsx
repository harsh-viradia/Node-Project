import Category from "components/Category"
import React from "react"
import { MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const CategoryIndex = ({ pageProps }) => {
  return <Category {...pageProps} />
}

export default CategoryIndex
export const getServerSideProps = privateRoute({ moduleName: MODULES.CATEGORY })
