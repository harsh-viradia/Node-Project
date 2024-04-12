/* eslint-disable no-underscore-dangle */
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import routes from "utils/routes"
import Button from "widgets/button"
import TopicCard from "widgets/topicCard"

const CategoryCard = ({ data }) => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const { locale } = useRouter()
  const { headingTitle, tabs, headingTitleID, rowPerWeb } = data
  return (
    <div className="mb-10 lg:mb-12">
      <div className="container">
        <h2 className="mb-4 font-bold">{locale === "en" ? headingTitle : headingTitleID}</h2>
        {tabs.map((item) => {
          return item?.cardType?.code === "SMALL" ? (
            <div
              className={`flex flex-wrap items-center grid-cols-1 gap-4 sm:grid lg:grid-cols-${rowPerWeb} sm:grid-cols-2`}
            >
              {item?.categories.map((x) => (
                <Button
                  className="sm:text-base font-semibold sm:!py-3 h-20 flex justify-center"
                  title={x.name}
                  kind="thin-gray"
                  hoverKind="white"
                  outline
                  onClick={() => router.push(`${routes.category}/${x?.slug}?id=${x?._id}&name=${x?.name}`)}
                />
              ))}
            </div>
          ) : item?.cardType?.code === "MEDIUM" ? (
            <div className={`grid grid-cols-1 gap-3 lg:grid-cols-${rowPerWeb} sm:grid-cols-2`}>
              {item?.categories.map((x) => (
                // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions
                <div onClick={() => router.push(`${routes.category}/${x?.slug}?id=${x?._id}&name=${x?.name}`)}>
                  <TopicCard courses={x?.courses} title={x?.name} src={x?.image?.uri} />
                </div>
              ))}
            </div>
          ) : (
            <>{t("noWidgetFound")}</>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryCard
