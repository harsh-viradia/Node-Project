/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable jsx-a11y/media-has-caption */
import CallingPhoneIcon from "icons/callingPhoneIcon"
import LocationIcon from "icons/locationIcon"
import MailIcon from "icons/mailIcon"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import Button from "widgets/button"
import Input from "widgets/input"
import SingleSelect from "widgets/searchSelect"
import Textarea from "widgets/textarea"

const ContactUs = () => {
  const { t } = useTranslation("contactUs")

  const options = [
    {
      label: "Learner Support",
      value: "Learner Support",
    },
    {
      label: "University Partnership Inquiries",
      value: "University Partnership Inquiries",
    },
    {
      label: "For Campus Inquiries",
      value: "For Campus Inquiries",
    },
    {
      label: "Industry Partnership Inquiries",
      value: "Industry Partnership Inquiries",
    },
  ]

  return (
    <LayoutWrapper>
      <div className="container mt-6">
        <div className="relative">
          <div className="px-6 pt-10 text-white sm:px-16 lg:py-40 sm:py-20 pb-72 bg-primary">
            <div className="absolute bottom-0 left-0 right-0 mx-auto md:right-10">
              <img
                src="/images/student3.png"
                alt="contact-banner"
                title="Contact Us"
                loading="lazy"
                className="mx-auto sm:ml-auto sm:mr-0 lg:h-96 h-60"
              />
            </div>
            <div className="w-full sm:max-w-md sm:text-left text-center z-[1] relative">
              <h1>{t("contactBanner")}</h1>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 my-10 lg:grid-cols-2 gap-y-10 gap-x-6 md:my-16">
          <div className="relative">
            <h2 className="mb-4 lg:mb-8">{t("contactUs")}</h2>
            <div className="flex flex-col max-w-xl gap-5 lg:gap-6">
              <div className="flex items-start gap-4">
                <div className=" text-primary min-w-6">
                  <LocationIcon />
                </div>
                <p className="font-medium">
                  DBS Bank Tower 28th Floor Ciputra World One Complex, jl.Prof Dr.Satrio No. 18 Jakarta, Indonesia
                </p>
              </div>
              <div className="flex items-start gap-4">
                <div className=" text-primary min-w-6">
                  <CallingPhoneIcon />
                </div>
                <p className="font-medium"> 011 43095694 </p>
              </div>
              <div className="flex items-start gap-4">
                <div className=" text-primary min-w-6">
                  <MailIcon />
                </div>
                <p className="font-medium">info@orbitfutureacademy.sch.id</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <h2 className="mb-4 lg:mb-8">{t("getInTouch")}</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:gap-5">
              <Input label={t("Name")} placeholder={t("enterName")} />
              <Input label={t("Email")} placeholder={t("enterEmail")} />
              <Input label={t("Phone")} placeholder={t("enterPhone")} />
              <SingleSelect label={t("Regarding")} data={options} placeholder={t("SelectRegarding")} />
              <div className="grid-cols-1 sm:col-span-2">
                <Textarea label={t("Message")} placeholder={t("enterMessage")} />
              </div>
              <div className="grid-cols-1 sm:col-span-2">
                <Button title={t("Submit")} primaryShadowBTN className="px-9" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default ContactUs
