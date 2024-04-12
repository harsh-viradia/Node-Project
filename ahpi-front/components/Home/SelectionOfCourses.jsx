/* eslint-disable sonarjs/no-identical-functions */
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Slider from "react-slick"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"

import routes from "../../utils/routes"
import Button from "../../widgets/button"
import Card from "../../widgets/card"
import OrbitLink from "../../widgets/orbitLink"

const cardData = [
  {
    src: "https://picsum.photos/200/300",
    title: "TensorFlow Developer Certificate in  2022",
    category: "Artificial",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/301",
    title: "TensorFlow Developer Certificate in  2023",
    category: "Artificial ",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/302",
    title: "TensorFlow Developer Certificate in  2024",
    category: "Artificial ",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/303",
    title: "TensorFlow Developer Certificate in  2025",
    category: "Artificial ",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/302",
    title: "TensorFlow Developer Certificate in  2024",
    category: "Artificial Intelligence",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/303",
    title: "TensorFlow Developer Certificate in  2025",
    category: "Artificial Intelligence",
    price: "2400",
    originalPrice: "2600",
  },
]
const SelectionOfCourses = () => {
  const { t } = useTranslation("home")
  const settings = {
    dots: false,
    infinite: false,
    slidesToShow: 4,
    slidesToScroll: 1,
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
    <div className="container pb-2 mb-10 lg:mb-12 mdSliderVisible">
      <div className="">
        <h2 className="mb-4 font-bold">{t("broadSelection")}</h2>
        <Tabs>
          <TabList>
            <Tab>Popular</Tab>
            <Tab>AI & Digital Transformation</Tab>
            <Tab>Business Management & Strategy</Tab>
            <Tab>Education</Tab>
            <Tab>Data Science & Analysis</Tab>
          </TabList>

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
        </Tabs>
      </div>
      <div className="flex items-center justify-center mt-5">
        <Button title={t("exploreMore")} primaryShadowBTN />
      </div>
    </div>
  )
}

export default SelectionOfCourses
