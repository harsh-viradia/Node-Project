import useTranslation from "next-translate/useTranslation"
import React from "react"

import Button from "../../widgets/button"

const InspiredStudent = () => {
  const { t } = useTranslation("home")
  return (
    <div className="mt-10 sm:mt-24">
      <div className="container !px-0 sm:!px-5">
        <div className="relative inspiredStudent">
          <div className="px-6 pt-10 text-white lg:px-24 sm:px-14 md:py-36 sm:py-16 pb-96">
            <div className="absolute bottom-0 lg:right-20 sm:right-10 sm:left-auto right-0 left-0 sm:ml-auto sm:mx-0 mx-auto z-[1]">
              <img
                src="/images/inspired-student.png"
                alt="inspired-student"
                loading="lazy"
                className=" lg:h-[450px] md:h-[380px] h-80 mx-auto"
              />
            </div>

            <div className="sm:w-7/12 w-full sm:text-left text-center z-[1] relative">
              <h2 className="font-bold">{t("inspireStudent")}</h2>
              <p className="mt-2">{t("inspireStudentDesc")}</p>
              <div className="mt-5">
                <Button title={t("exploreMore")} primaryShadowBTN />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default InspiredStudent
