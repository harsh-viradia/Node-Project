import useTranslation from "next-translate/useTranslation"
import React from "react"

import Button from "../../widgets/button"

const Help = () => {
  const { t } = useTranslation("common")
  return (
    <div className="mt-10 bg-primary lg:mt-24">
      <div className="container">
        <div className="relative">
          <div className="px-6 pt-10 text-white sm:px-0 md:py-36 sm:py-16 pb-96 bg-primary ">
            <div className="absolute bottom-0 sm:right-0 sm:left-auto right-0 left-0 sm:ml-auto sm:mx-0 mx-auto z-[1]">
              <img
                src="/images/helpSecPerson.png"
                alt=""
                loading="lazy"
                className=" lg:h-[508px] md:h-[380px] h-80 mx-auto"
              />
            </div>

            <div className="sm:w-6/12 lg:w-4/12 w-full sm:text-left text-center z-[1] relative">
              <h2 className="font-bold ">{t("happyToHelpYou")}</h2>
              <p className="mt-2">{t("happyToHelpYouDetail")}</p>
              <div className="mt-5">
                <Button title={t("exploreMore")} whiteShadowBTN />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Help
