/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-duplicate-string */
import { useRouter } from "next/router"
import React, { useContext } from "react"
import AppContext from "utils/AppContext"
import routes from "utils/routes"
import Button from "widgets/button"

const ExploreCourses = () => {
  const router = useRouter()
  const { category: categoryList } = useContext(AppContext)
  return (
    <div className="container">
      <h2 className="font-bold mb-4">Topics recommended for you</h2>
      <div className="w-full">
        <div className="flex flex-wrap items-center grid-cols-1 gap-4 sm:grid lg:grid-cols-4 sm:grid-cols-2">
          {categoryList?.map((x) => (
            <Button
              className="sm:text-base font-semibold sm:!py-3"
              title={x.name}
              kind="thin-gray"
              hoverKind="white"
              outline
              onClick={() => router.push(`${routes.category}/${x?.slug}?id=${x?._id}&name=${x?.name}`)}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ExploreCourses
