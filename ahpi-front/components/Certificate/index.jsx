/* eslint-disable react/no-danger */
/* eslint-disable import/default */
import CertificateNotFoundIndex from "components/CertificateNotFound/index"
import ShareIcon from "icons/shareIcon"
import SmallRightIcon from "icons/smallRightIcon"
import getConfig from "next/config"
import dynamic from "next/dynamic"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import ReactTooltip from "react-tooltip"
import { RWebShare } from "react-web-share"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import routes from "utils/routes"
import { dateDisplay } from "utils/util"
import OrbitLink from "widgets/orbitLink"

const { publicRuntimeConfig } = getConfig()
// eslint-disable-next-line no-unused-vars
const Confetti = dynamic(() => import("./confetti"), {
  ssr: false,
})

const Certificate = ({ certificateData: data = {}, materialData }) => {
  const { t } = useTranslation("certificate")
  return (
    <LayoutWrapper>
      {/* <Confetti /> */}
      {data?.certiCode ? (
        <div className="container">
          <div className="flex items-center gap-3 my-6 text-sm text-dark-gray">
            <OrbitLink href={routes.home} className="text-primary">
              {t("common:home")}
            </OrbitLink>
            <SmallRightIcon />
            <OrbitLink href={routes.myLearning} className="text-primary">
              {t("common:myLearning")}
            </OrbitLink>
            <SmallRightIcon />
            <OrbitLink>{t("common:certiFicate")}</OrbitLink>
          </div>
          <div className="relative p-0 md:p-16 bg-primary">
            <div className="grid items-center grid-cols-12 md:gap-6">
              <div className="flex flex-col col-span-12 gap-4 lg:md:col-span-5 md:gap-5 p-7 sm:p-10 md:p-0">
                <img src={data.courseId?.imgId?.uri} loading="lazy" className="w-16 h-16 rounded-md" alt="" />
                <div className="flex flex-col gap-1.5 text-white">
                  <p>{data.courseId?.parCategory?.[0]?.name}</p>
                  <h2>{data.courseId?.title}</h2>
                </div>
              </div>

              <div className="col-span-12 p-10 pt-0 text-xl font-bold lg:md:col-span-7 md:p-0">
                {data.certiId?.uri && (
                  <iframe
                    scrolling="no"
                    title={data.certiId?.oriNm}
                    src={`${data.certiId?.uri}#embedded=true&toolbar=0&navpanes=0`}
                    width="100%"
                    height={500}
                    className="w-full max-w-6xl mx-auto"
                    // controlsList="nodownload"
                    frameBorder="0"
                  />
                )}
              </div>
            </div>
          </div>
          <div className="grid justify-center grid-cols-12 gap-4 my-6">
            <div className="col-span-12 lg:col-span-8 certificate-content">
              <div dangerouslySetInnerHTML={{ __html: data.courseId?.briefDesc }} />
              <h2 className="text-xl font-bold">{t("materialsStudied")}:</h2>
              {materialData?.map((item = {}) => {
                return (
                  <>
                    <h2 className="text-xl font-bold">{item.nm}</h2>
                    <div dangerouslySetInnerHTML={{ __html: item.desc }} />
                  </>
                )
              })}
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="sticky w-full max-w-2xl mx-auto top-16">
                <div className="relative w-full py-6 pt-20 pb-10 mt-8 px-4 text-center bg-white border rounded-lg border-gray">
                  <div className="absolute h-[100px] w-[100px] -top-[50px] left-2/4 -translate-x-2/4 m-0 border border-gray rounded-full overflow-hidden bg-white flex items-center justify-center">
                    <img
                      src={data.courseId?.userId?.profileId?.uri || "/images/orbitLogo.png"}
                      className="w-20 h-20"
                      alt="logo"
                    />
                  </div>
                  <div className="flex flex-col gap-6">
                    <h3 className="text-xl font-semibold">{data.courseId?.userId?.name}</h3>
                    <p
                      className="text-dark-gray flex items-center whitespace-nowrap justify-center gap-1.5 cursor-help"
                      data-tip={data.certiCode}
                    >
                      ID : <span className="relative inline-block w-full max-w-xs truncate">{data.certiCode}</span>
                    </p>
                    <p className="font-medium">Awarded : {dateDisplay(data.awardedAt)}</p>
                    <ReactTooltip effect="solid" />
                  </div>
                </div>
                <div className="col-span-12 mt-2 lg:col-span-4">
                  <div className="border rounded-lg border-light-gray">
                    <RWebShare
                      data={{
                        text: t("shareMessage"),
                        url: `${publicRuntimeConfig.NEXT_PUBLIC_DOMAIN_URL}${routes.certificate}/${data.certiCode}/`,
                      }}
                      // onClick={() => Toast("Link Copied!")}
                    >
                      <div className="flex items-center justify-center gap-3 px-1 py-4 text-sm cursor-pointer sm:py-3 md:py-4">
                        <ShareIcon />
                        <span>{t("share")}</span>
                      </div>
                    </RWebShare>
                    {/* <OrbitLink href="#" className="flex items-center justify-center gap-3 px-1 py-4 text-sm sm:py-3 md:py-4">
            <CouponIcon />
            <span>{t("applyCoupon")}</span>
          </OrbitLink> */}
                  </div>
                </div>
                {/* <div className="flex items-center justify-between py-6 sm:gap-6 sm:justify-center">
                  <p className="font-semibold sm:text-base">{t("share")}</p>
                  <OrbitLink href="" className="text-dark-gray hover:text-primary" data-tip="Share on Facebook">
                    <FacebookIcon size="22px" />
                  </OrbitLink>
                  <ReactTooltip effect="solid" />
                  <OrbitLink href="" className="text-dark-gray hover:text-primary" data-tip="Share on LinkedIn">
                    <LinkedinIcon size="22px" />
                  </OrbitLink>
                  <ReactTooltip effect="solid" />
                  <OrbitLink href="" className="text-dark-gray hover:text-primary" data-tip="Share on Whatsapp">
                    <WhatsappIcon size="22px" />
                  </OrbitLink>
                  <ReactTooltip effect="solid" />
                  <OrbitLink href="" className="text-dark-gray hover:text-primary" data-tip="Share on Twitter">
                    <TwitterIcon size="22px" />
                  </OrbitLink>
                  <ReactTooltip effect="solid" />
                  <OrbitLink href="" className="text-dark-gray hover:text-primary" data-tip="Click To Copy Link">
                    <LinkIcon size="22px" />
                  </OrbitLink>
                  <ReactTooltip effect="solid" />
                </div> */}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <CertificateNotFoundIndex />
      )}
    </LayoutWrapper>
  )
}

export default Certificate
