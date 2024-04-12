import useTranslation from "next-translate/useTranslation"
import React from "react"

import RightArrowIcon from "../icons/rightArrowIcon"
import OrbitLink from "./orbitLink"

const TopicCard = ({ courses, title, src, alt }) => {
  const { t } = useTranslation("home")
  return (
    <OrbitLink className="flex items-center justify-between h-full gap-3 p-5 transition-all border rounded-lg border-primary-border hover:border-dark-border hover:shadow-md">
      <div className="grid gap-1">
        <p className="text-xs font-medium sm:text-sm text-primary">{courses} Courses</p>
        <h3 className="font-semibold ">{title}</h3>
        <OrbitLink className="flex items-center gap-3 text-xs font-medium sm:text-sm text-dark-gray">
          {t("takeLook")}
          <RightArrowIcon />
        </OrbitLink>
      </div>
      <img src={src} alt={alt} className="object-cover object-center w-20 h-20 rounded-md" loading="lazy" />
    </OrbitLink>
  )
}

export default TopicCard
