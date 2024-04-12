/* eslint-disable sonarjs/no-duplicate-string */
import React from "react"
import Button from "widgets/button"

const ExploreCourses = () => {
  const categoriesList = [
    { title: "Design" },
    { title: "Development" },
    { title: "Marketing" },
    { title: "IT and Software" },
    { title: "Personal Development" },
    { title: "Music" },
    { title: "Business" },
    { title: "Photography" },
  ]
  return (
    <div className="mt-20">
      <h2 className="font-bold mb-4">Explore more topics</h2>
      <div className="sm:!grid flex flex-wrap lg:grid-cols-4 sm:grid-cols-2 grid-cols-1 gap-4">
        {categoriesList.map((items) => (
          <Button
            className="sm:text-base font-semibold sm:!py-3"
            title={items.title}
            kind="thin-gray"
            hoverKind="white"
            outline
          />
        ))}
      </div>
    </div>
  )
}

export default ExploreCourses
