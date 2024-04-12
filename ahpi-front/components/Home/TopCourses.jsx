/* eslint-disable sonarjs/no-duplicate-string */
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Slider from "react-slick"
import MiniCard from "widgets/miniCard"

const TopCourses = () => {
  const settings = {
    dots: false,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
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
        breakpoint: 991,
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

  const cardData = [
    {
      src: "https://picsum.photos/200/303",
      title: "Data Science & Machine Learning(Theory+Projects)A - Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures",
      totalLength: "156h total length",
      level: "Beginner",
    },
    {
      src: "https://picsum.photos/200/305",
      title: "Data Science & Machine (Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures",
      totalLength: "156h total length",
      level: "Beginner",
    },
    {
      src: "https://picsum.photos/200/306",
      title: " Machine (Theory+Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures",
      totalLength: "156h total length",
      level: "Beginner",
    },
    {
      src: "https://picsum.photos/200/302",
      title: " Science & Machine (Theory+Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures",
      totalLength: "156h total length",
      level: "Beginner",
    },
    {
      src: "https://picsum.photos/200/304",
      title: "Data Science & Machine (Theory+Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures",
      totalLength: "156h total length",
      level: "Beginner",
    },
    {
      src: "https://picsum.photos/200/304",
      title: "Data Science & Machine (Theory+Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures",
      totalLength: "156h total length",
      level: "Beginner",
    },
    {
      src: "https://picsum.photos/200/300",
      title: "Data Science & Machine Learning(Theory+Projects)A-Z ",
      category: "Artificial Intelligence",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures",
      totalLength: "156h total length",
      level: "Beginner",
    },
    {
      src: "https://picsum.photos/200/300",
      title: "Data Science & Machine Learning(Theory+Projects)A-Z ",
      category: "Artificial Intelligence",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures",
      totalLength: "156h total length",
      level: "Beginner",
    },
  ]
  const { t } = useTranslation("home")
  return (
    <div className="mb-10 lg:mb-12 mdSliderVisible">
      <div className="container">
        <h2 className="mb-2 font-bold">{t("topCourses")}</h2>
        <Slider {...settings}>
          {cardData.map((item) => {
            return (
              <div className="slidePadding">
                <MiniCard
                  category={item.category}
                  title={item.title}
                  lecture={item.lecture}
                  price={item.price}
                  originalPrice={item.originalPrice}
                  src={item.src}
                  totalLength={item.totalLength}
                  level={item.level}
                />
              </div>
            )
          })}
        </Slider>
      </div>
    </div>
  )
}

export default TopCourses
