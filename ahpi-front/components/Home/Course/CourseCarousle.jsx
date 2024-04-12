import useTranslation from "next-translate/useTranslation"
import { useRouter } from "node_modules/next/router"
import React from "react"
import Slider from "react-slick"
import routes from "utils/routes"
import { getLevel } from "utils/util"
import Card from "widgets/card"
import MediumCard from "widgets/mediumCard"
import MiniCard from "widgets/miniCard"
import OrbitLink from "widgets/orbitLink"

const CourseCarousle = ({ data }) => {
  const { t } = useTranslation("common")
  const { locale } = useRouter()
  const { headingTitle, tabs, rowPerWeb, headingTitleID } = data
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: rowPerWeb,
    slidesToScroll: 2,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    centerPadding: "60px",
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
          slidesToShow: 2,
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
    <div className="mb-10 lg:mb-12 mdSliderVisible">
      <div className="container">
        <h2 className="mb-2 font-bold">{locale === "en" ? headingTitle : headingTitleID}</h2>
        <Slider {...settings}>
          {tabs.map((item) => {
            return item?.cardType?.code === "BIG" ? (
              item?.course.map((x) => {
                return (
                  <div className="slidePadding">
                    <OrbitLink href={`${routes.courseDetail}/${x?.slug}`}>
                      <Card
                        src={x?.imgId?.uri}
                        title={x?.title}
                        category={x?.parCategory?.[0]?.name}
                        price={x?.price?.sellPrice}
                        originalPrice={x?.price?.MRP}
                        reviews={x?.avgStars}
                        totalReviews={x?.totalReviews}
                        slug={x?.slug}
                        bestSeller={x?.badgeId?.name || false}
                      />
                    </OrbitLink>
                  </div>
                )
              })
            ) : item?.cardType?.code === "MEDIUM" ? (
              item?.course.map((x) => {
                return (
                  <div className="slidePadding">
                    <OrbitLink href={`${routes.courseDetail}/${x?.slug}`}>
                      <MediumCard
                        src={x?.imgId?.uri}
                        title={x?.title}
                        category={x?.parCategory?.[0]?.name}
                        price={x?.price?.sellPrice}
                        originalPrice={x?.price?.MRP}
                      />
                    </OrbitLink>
                  </div>
                )
              })
            ) : item?.cardType?.code === "SMALL" ? (
              item?.course.map((x) => {
                return (
                  <div className="slidePadding">
                    <OrbitLink href={`${routes.courseDetail}/${x?.slug}`}>
                      <MiniCard
                        category={x?.parCategory?.[0]?.name}
                        title={x?.title}
                        lecture={x?.lang?.name}
                        price={x?.price?.sellPrice}
                        originalPrice={x?.price?.MRP}
                        src={x?.imgId?.uri}
                        totalLength={x?.totalLessons}
                        level={getLevel(x?.levelId?.name, x?.levelId?.code, false)}
                        reviews={x?.avgStars}
                        totalReviews={x?.totalReviews}
                        bestSeller={x?.badgeId?.name || false}
                      />
                    </OrbitLink>
                  </div>
                )
              })
            ) : (
              <>{t("noWidgetSize")}</>
            )
          })}
        </Slider>
      </div>
    </div>
  )
}

export default CourseCarousle
