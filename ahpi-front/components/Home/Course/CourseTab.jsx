/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-identical-functions */
// import useTranslation from "next-translate/useTranslation"
import useTranslation from "next-translate/useTranslation"
import { useRouter } from "node_modules/next/router"
import React, { useState } from "react"
import Slider from "react-slick"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import routes from "utils/routes"
import { getLevel } from "utils/util"
// import Button from "widgets/button"
import Card from "widgets/card"
import MediumCard from "widgets/mediumCard"
import MiniCard from "widgets/miniCard"
import OrbitLink from "widgets/orbitLink"

const CourseTab = ({ data }) => {
  const { t } = useTranslation("common")
  const [tabIndex, setTabIndex] = useState(0)
  const { locale } = useRouter()
  const { headingTitle, tabs, rowPerWeb, headingTitleID } = data
  // const { t } = useTranslation("home")
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: rowPerWeb,
    slidesToScroll: 1,
    // autoplay: true,
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

  const getCard = (size, item) => {
    return size === "BIG" ? (
      <OrbitLink href={`${routes.courseDetail}/${item?.slug}`}>
        <Card
          src={item?.imgId?.uri}
          title={item?.title}
          category={item?.parCategory?.[0]?.name}
          price={item?.price?.sellPrice}
          originalPrice={item?.price?.MRP}
          reviews={item?.avgStars}
          totalReviews={item?.totalReviews}
          slug={item?.slug}
          bestSeller={item?.badgeId?.name || false}
        />
      </OrbitLink>
    ) : size === "MEDIUM" ? (
      <OrbitLink href={`${routes.courseDetail}/${item?.slug}`}>
        <MediumCard
          src={item?.imgId?.uri}
          title={item?.title}
          category={item?.parCategory?.[0]?.name}
          price={item?.price?.sellPrice}
          originalPrice={item?.price?.MRP}
          reviews={item?.avgStars}
          totalReviews={item?.totalReviews}
          totalLessons={item?.totalLessons}
          level={getLevel(
            // locale === "en" ? item?.levelId?.names?.en : item?.levelId?.names?.id,
            item?.levelId?.name,
            item?.levelId?.code,
            false
          )}
          badge={item?.badgeId?.name}
        />
      </OrbitLink>
    ) : size === "SMALL" ? (
      <OrbitLink href={`${routes.courseDetail}/${item?.slug}`}>
        <MiniCard
          src={item?.imgId?.uri}
          title={item?.title}
          category={item?.parCategory?.[0]?.name}
          price={item?.price?.sellPrice}
          originalPrice={item?.price?.MRP}
          reviews={item?.avgStars}
          totalReviews={item?.totalReviews}
          bestSeller={item?.badgeId?.name || false}
        />
      </OrbitLink>
    ) : (
      <>{t("noWidgetSize")}</>
    )
  }

  return (
    <div className="container pb-2 mb-10 lg:mb-12 mdSliderVisible">
      <div className="">
        <h2 className="mb-4 font-bold">{locale === "en" ? headingTitle : headingTitleID}</h2>
        <Tabs selectedIndex={tabIndex} onSelect={(index) => setTabIndex(index)}>
          <TabList>
            {tabs?.map((x) => {
              return <Tab>{x?.name}</Tab>
            })}
          </TabList>

          {tabs?.map((item) => (
            <TabPanel className="mt-5" key={item?._id}>
              <Slider {...settings}>
                {item?.course?.length ? (
                  item?.course?.map((x) => <div className="slidePadding">{getCard(item?.cardType?.code, x)}</div>)
                ) : (
                  <>{t("noWidget")}</>
                )}
              </Slider>
            </TabPanel>
          ))}

          {/* <TabPanel className="mt-5">
            <Slider {...settings}>
              {cardData.map((item) => {
                return (
                  <div className="slidePadding">
                    <OrbitLink href={routes.courseDetail}>
                      <Card
                        src={item.src}
                        title="TensorFlow Developer Certificate in 2022..."
                        category="Artificial Intelligence"
                        price="2400"
                        originalPrice="2600"
                      />
                    </OrbitLink>
                  </div>
                )
              })}
            </Slider>
          </TabPanel>
          <TabPanel className="mt-5">
            <Slider {...settings}>
              {cardData.map((item) => {
                return (
                  <div className="slidePadding">
                    <OrbitLink href={routes.courseDetail}>
                      <Card
                        src={item.src}
                        title="TensorFlow Developer Certificate in 2022..."
                        category="Artificial Intelligence"
                        price="2400"
                        originalPrice="2600"
                      />
                    </OrbitLink>
                  </div>
                )
              })}
            </Slider>
          </TabPanel>
          <TabPanel className="mt-5">
            <Slider {...settings}>
              {cardData.map((item) => {
                return (
                  <div className="slidePadding">
                    <OrbitLink href={routes.courseDetail}>
                      <Card
                        src={item.src}
                        title="TensorFlow Developer Certificate in 2022..."
                        category="Artificial Intelligence"
                        price="2400"
                        originalPrice="2600"
                      />
                    </OrbitLink>
                  </div>
                )
              })}
            </Slider>
          </TabPanel>
          <TabPanel className="mt-5">
            <Slider {...settings}>
              {cardData.map((item) => {
                return (
                  <div className="slidePadding">
                    <OrbitLink href={routes.courseDetail}>
                      <Card
                        src={item.src}
                        title="TensorFlow Developer Certificate in 2022..."
                        category="Artificial Intelligence"
                        price="2400"
                        originalPrice="2600"
                      />
                    </OrbitLink>
                  </div>
                )
              })}
            </Slider>
          </TabPanel>
          <TabPanel className="mt-5">
            <Slider {...settings}>
              {cardData.map((item) => {
                return (
                  <div className="slidePadding">
                    <OrbitLink href={routes.courseDetail}>
                      <Card
                        src={item.src}
                        title="TensorFlow Developer Certificate in 2022..."
                        category="Artificial Intelligence"
                        price="2400"
                        originalPrice="2600"
                      />
                    </OrbitLink>
                  </div>
                )
              })}
            </Slider>
          </TabPanel> */}
        </Tabs>
      </div>
      {/* <div className="flex items-center justify-center mt-5">
        <Button title={t("exploreMore")} primaryShadowBTN />
      </div> */}
    </div>
  )
}

export default CourseTab
