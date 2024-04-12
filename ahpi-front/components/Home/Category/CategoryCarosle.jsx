/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable react/jsx-boolean-value */
/* eslint-disable no-underscore-dangle */
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Slider from "react-slick"
import routes from "utils/routes"
import Button from "widgets/button"
import TopicCard from "widgets/topicCard"

const CategoryCarosle = ({ data }) => {
  const { t } = useTranslation("common")
  const router = useRouter()
  const { locale } = useRouter()
  const { headingTitle, tabs, rowPerWeb, headingTitleID } = data

  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: rowPerWeb,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerPadding: "0px",
    nextArrow: (
      <div>
        <img src="/images/next.svg" alt="" />
      </div>
    ),
    prevArrow: (
      <div>
        <img src="/images/prev.svg" alt="" />
      </div>
    ),
    responsive: [
      {
        breakpoint: 1199,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 840,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          arrows: false,
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          arrows: false,
          slidesToShow: 1,
          slidesToScroll: 1,
          variableWidth: true,
        },
      },
    ],
  }

  return (
    <div className="mb-10 lg:mb-12">
      <div className="container">
        <h2 className="mb-4 font-bold">{locale === "en" ? headingTitle : headingTitleID}</h2>
        {tabs.map((item) => {
          return item?.cardType?.code === "SMALL" ? (
            <div className="w-full">
              <Slider {...settings}>
                {item?.categories?.map((x) => (
                  <div className="p-1.5">
                    <Button
                      className="w-full sm:text-base font-semibold sm:!py-3 h-[50px] sm:h-[74px] flex justify-center"
                      title={x.name}
                      kind="thin-gray"
                      hoverKind="white"
                      outline
                      onClick={() => router.push(`${routes.category}/${x?.slug}?name=${x?.name}`)}
                    />
                  </div>
                ))}
              </Slider>
            </div>
          ) : item?.cardType?.code === "MEDIUM" ? (
            <div className="w-full">
              <Slider {...settings}>
                {item?.categories?.map((x) => (
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events
                  <div
                    className="h-full p-1.5"
                    onClick={() => router.push(`${routes.category}/${x?.slug}?id=${x?._id}&name=${x?.name}`)}
                  >
                    <TopicCard courses={x?.courses} title={x?.name} src={x?.image?.uri} />
                  </div>
                ))}
              </Slider>
            </div>
          ) : (
            <>{t("noWidgetFound")}</>
          )
        })}
      </div>
    </div>
  )
}

export default CategoryCarosle
