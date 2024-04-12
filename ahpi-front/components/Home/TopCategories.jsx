import useTranslation from "next-translate/useTranslation"
import React from "react"
import Button from "widgets/button"

const categoriesList = [
  { title: "Artificial Intelligence" },
  { title: "Machine Learning" },
  { title: "Python" },
  { title: "Data Science" },
  { title: "Deep Learning" },
  { title: "Business intelligence" },
  { title: "Tensor flow" },
  { title: "Weka" },
]

const TopCategories = () => {
  const { t } = useTranslation("home")
  return (
    <div className="mb-10 lg:mb-12">
      <div className="container">
        <h2 className="mb-4 font-bold">{t("topCategories")}</h2>
        <div className="flex flex-wrap items-center grid-cols-1 gap-4 sm:grid lg:grid-cols-4 sm:grid-cols-2">
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
    </div>
  )
}

export default TopCategories
