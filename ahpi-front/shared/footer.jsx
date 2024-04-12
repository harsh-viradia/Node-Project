/* eslint-disable jsx-a11y/img-redundant-alt */
/* eslint-disable jsx-a11y/anchor-is-valid */
import MailIcon from "icons/mailIcon"
import PhoneIcon from "icons/phoneIcon"
import getConfig from "next/config"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"

const { publicRuntimeConfig } = getConfig()

const Footer = ({ className }) => {
  const { t } = useTranslation("common")
  return (
    <div className={`footer bg-thin-gray ${className}`}>
      <div className="container ">
        <div className="grid flex-wrap justify-center gap-4 md:justify-between md:flex  border-gray pt-8 pb-6 mt-6 ">
          <div className="md:col-span-2 col-span-12">
            <OrbitLink href={routes.home} className=" h-[37px] w-28">
              <img
                src="/images/logo_white.png"
                loading="lazy"
                className="mx-auto md:m-0 cursor-pointer h-14"
                height={56}
                alt=""
              />
            </OrbitLink>
          </div>
          <div className="col-span-12 md:col-span-4">
            <div className="grid gap-2 text-xs sm:text-sm">
              <div>
                <p className="text-sm font-semibold text-mute text-light-gray">{t("Connect with us")}</p>
                <div className="flex items-center gap-2 mt-2 ">
                  <PhoneIcon />
                  <OrbitLink
                    href={`tel:${
                      publicRuntimeConfig.NEXT_PUBLIC_PHONE_NUMBER
                        ? publicRuntimeConfig.NEXT_PUBLIC_PHONE_NUMBER.replaceAll(" ", "")
                        : ""
                    }`}
                    className="font-semibold text-light-gray"
                  >
                    {publicRuntimeConfig.NEXT_PUBLIC_PHONE_NUMBER || ""}
                  </OrbitLink>
                  {/* <p className="font-semibold text-light-gray"> 011 43095694</p> */}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mt-2">
                  <MailIcon />
                  <OrbitLink href="mailto:contact@ahpi.in" className="font-semibold text-light-gray">
                    contact@ahpi.in
                  </OrbitLink>
                </div>
              </div>
            </div>
          </div>
          <div className="">
            <div className="grid gap-7 mt-3 sm:mt-0 ">
              <div className="text-light-gray">
                <p className="text-xs sm:text-sm mb-1">Delhi Office (Head Office)</p>
                <p className="text-xs sm:text-sm mb-1">404, 4th Floor, Ashoka Estate,</p>
                <p className="text-xs sm:text-sm mb-1"> Barakhamba Road,</p>
                <p className="text-xs sm:text-sm mb-1">New Delhi - 110001</p>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="grid gap-6 mt-3 sm:mt-0 ">
              <div className="mb-3 font-semibold text-light-gray">
                <OrbitLink
                  href={routes.aboutUs}
                  className="block text-light-gray mb-2  hover:text-primary cursor-pointer"
                >
                  {t("aboutUs")}
                </OrbitLink>
                <OrbitLink
                  href={routes.privacy}
                  className="block text-light-gray mb-2 hover:text-primary cursor-pointer"
                >
                  {t("privacyPolicy")}
                </OrbitLink>
                <OrbitLink href={routes.terms} className="block text-light-gray   hover:text-primary cursor-pointer">
                  {t("terms")}
                </OrbitLink>
              </div>
            </div>
          </div>
          <div className="col-span-12 md:col-span-3">
            <div className="p-4 border rounded-lg border-dark-gray min-w-fit">
              <p className="text-sm font-semibold text-light-gray">{t("Click here to download the mobile app")}</p>
              <p className="mt-1 text-xs text-mute text-light-gray">{t("Get high level skills training on our app")}</p>
              <div className="flex items-center gap-3 mt-3">
                <OrbitLink
                  //  href="https://apps.apple.com/us/app/orbit-jobs-candidate/id1627209250"
                  // target="_blank"
                  href="#"
                >
                  <img src="/images/app-store.png" alt="App Store" className="w-32" />
                </OrbitLink>
                <OrbitLink
                  // href="https://play.google.com/store/apps/details?id=com.orbitjobs.candidate.knovator"
                  // target="_blank"
                  href="#"
                >
                  <img src="/images/playstore.png" alt="Play Store" className="w-32" />
                </OrbitLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="container text-white border-t border-gray-600 pt-4" />
      <div className=" container grid-cols-1 grid md:grid-cols-3 text-white w-full gap-3 text-center py-6">
        <div />
        <div className="flex flex-col gap-1 sm:flex-row  sm:gap-2 items-center text-center justify-center pb-3">
          <p className="text-xs sm:text-sm font-light">Powered by</p>
          <a
            className="text-lg sm:text-sm bg-inherit border-0  text-primary font-bold"
            href="https://knovator.com/"
            title="Shiksha Skills"
          >
            Shiksha Skills
          </a>
          <p className="text-xs text-right">
            <a
              className="text-lg sm:text-sm bg-inherit border-0  text-primary font-bold"
              href="https://knovator.com/"
              title="hello"
            >
              <img src="/images/knovator.svg" alt="logo" />
            </a>
          </p>
        </div>
        <p className="text-sm text-center sm:text-sm sm:text-right">
          <p>{t("copyright")}</p>
          <OrbitLink href="/" className="pl-1 text-primary">
            {t("AhpiAcademy")}
          </OrbitLink>
          <p>{t("AllRightsReservedby")}</p>
        </p>
      </div>
    </div>
  )
}

export default Footer
