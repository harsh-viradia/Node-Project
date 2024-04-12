import SearchedResultContent from "components/SearchedResult/SearchedResultContent"
import { useRouter } from "next/router"
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"

const Category = (props) => {
  const { metaData, categoryDetail } = props
  const meta = metaData?.[1]?.data
  const courseList = categoryDetail?.[1]?.data
  const router = useRouter()

  return (
    <LayoutWrapper meta={meta}>
      <div className="container mdSliderVisible">
        <div className="sm:my-14 my-9">
          <SearchedResultContent courseList={courseList} title={router.query?.name || ""} />
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default Category
