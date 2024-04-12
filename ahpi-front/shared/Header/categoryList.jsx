/* eslint-disable no-underscore-dangle */
import SmallRightIcon from "icons/smallRightIcon"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"

import useCategory from "./hook/useCategory"

const Category = () => {
  const { t } = useTranslation("category")
  const { category = [], subCategory, selectedCategoryName, handleClickParentCategory } = useCategory()

  const VirtualScrollChildren = category?.map((categoryItem) => {
    return (
      <li className="relative">
        <OrbitLink
          href={`${routes.category}/${encodeURIComponent(categoryItem?.slug)}?name=${encodeURIComponent(
            categoryItem?.name
          )}`}
          className={`flex items-center justify-between gap-2 hover:text-primary ${
            selectedCategoryName === categoryItem.name && "text-primary"
          } transition py-3 px-4 text-sm font-normal capitalize`}
          onMouseOver={() => {
            handleClickParentCategory(categoryItem.subCategory, categoryItem.name)
          }}
        >
          {categoryItem.name} <SmallRightIcon size="12" />
        </OrbitLink>
      </li>
    )
  })

  return (
    <div className="relative flex text-sm font-medium bg-white border rounded shadow-lg subMenu border-primary-border">
      <ul className="px-0 py-2  lg:w-[340px] w-[200px] max-h-80 overflow-auto">
        {category.length > 0 ? (
          VirtualScrollChildren
        ) : (
          <ul className="px-0 py-2  lg:w-[340px] w-[200px] overflow-auto">
            <li className="relative">
              <div className="flex items-center justify-between gap-2 px-4 py-3 transition">
                {t("common:NoDataFound")}
              </div>
            </li>
          </ul>
        )}
      </ul>
      {subCategory?.length > 0 && (
        <ul className="px-0 py-2 lg:w-[400px] w-[300px] max-h-80 overflow-auto border-l ">
          {subCategory.map((categoryItem) => (
            <li className="relative">
              <OrbitLink
                href={`${routes.category}/${encodeURIComponent(categoryItem?.slug)}?name=${encodeURIComponent(
                  categoryItem?.name
                )}`}
                className="flex items-center justify-between gap-2 px-4 py-3 transition hover:text-primary"
              >
                {categoryItem.name} <SmallRightIcon size="12" />
              </OrbitLink>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default Category
