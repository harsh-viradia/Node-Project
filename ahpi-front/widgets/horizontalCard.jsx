import DownloadIcon2 from "icons/downloadIcon2"
import EyeIcon from "icons/eyeIcon"
import useTranslation from "next-translate/useTranslation"
import React from "react"

import StarIcon from "../icons/starIcon"
import OrbitLink from "./orbitLink"

const HorizontalCard = ({
  src,
  title,
  category,
  price,
  originalPrice,
  star = true,
  process,
  completed,
  status,
  viewCertificate,
  downloadCertificate,
}) => {
  const { t } = useTranslation("common")
  return (
    <div className="items-center h-full overflow-hidden border rounded-lg border-primary-border sm:flex">
      <div>
        <img
          src={src}
          className="object-cover lg:min-w-[384px] sm:min-w-[184px] sm:w-96 w-full h-[200px]"
          alt=""
          loading="lazy"
        />
      </div>
      <div className="w-full">
        <div className="grid gap-2 px-6 py-4 sm:py-4 sm:px-10">
          <div className="flex items-center justify-between">
            <p className="text-xs text-dark-gray">{category}</p>
            <div className="px-2 py-1 text-xs text-white rounded bg-primary">{t("bestSeller")}</div>
          </div>
          <h4 className="font-semibold ">{title}</h4>
          {star && (
            <div className="flex items-center gap-2">
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <StarIcon />
              <p className="text-xs text-dark-gray">
                <span className="text-yellow">3.4</span> (22)
              </p>
            </div>
          )}
          <div className="flex items-center gap-3">
            {price && <h2 className="font-bold text-primary">₹ {price}</h2>}
            {originalPrice && <p className="text-sm line-through text-dark-gray">₹ {originalPrice}</p>}
          </div>
        </div>
      </div>
    </div>
  )
}

export default HorizontalCard
