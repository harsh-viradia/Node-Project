/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-console */
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import routes from "utils/routes"

import TopicCard from "../../widgets/topicCard"

const cardData = [
  {
    title: "Artificial Intelligence",
    courses: 20,
  },
  {
    title: "Business Intelligence",
    courses: 25,
  },
  {
    title: "Python",
    courses: 30,
  },
  {
    title: "Weka",
    courses: 22,
  },
  {
    title: "Tensorflow",
    courses: 23,
  },
  {
    title: "Deep Learning",
    courses: 21,
  },
]
const PopularTopic = () => {
  const router = useRouter()
  const { t } = useTranslation("home")
  return (
    <div className="mb-10 lg:mb-12">
      <div className="container">
        <h2 className="mb-4 font-bold">{t("popularTopics")}</h2>
        <div className="grid grid-cols-1 gap-3 lg:grid-cols-3 sm:grid-cols-2">
          {cardData.map((item) => {
            return (
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events
              <div onClick={() => router.push(`${routes.category}/${item?.slug}?id=${item?._id}&name=${item?.name}`)}>
                <TopicCard courses={item?.courses} title={item?.title} src={item?.image?.uri} />
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default PopularTopic
