/* eslint-disable sonarjs/no-duplicate-string */
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Slider from "react-slick"
import HorizontalCard from "widgets/horizontalCard"

const FeaturedCourses = () => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    initialSlide: 0,

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

  const cardData = [
    {
      src: "https://picsum.photos/200/303",
      title: "Data Science & Machine Learning(Theory+Projects)A - Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures  |  156h total length",
    },
    {
      src: "https://picsum.photos/200/305",
      title: "Data Science & Machine (Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures  |  158h total length",
    },
    {
      src: "https://picsum.photos/200/306",
      title: " Machine (Theory+Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "145 lectures  |  155h total length",
    },
    {
      src: "https://picsum.photos/200/302",
      title: " Science & Machine (Theory+Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "142 lectures  |  155h total length",
    },
    {
      src: "https://picsum.photos/200/304",
      title: "Data Science & Machine (Theory+Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures  |  155h total length",
    },
    {
      src: "https://picsum.photos/200/304",
      title: "Data Science & Machine (Theory+Projects)A-Z ",
      category: "Artificial ",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures  |  155h total length",
    },
    {
      src: "https://picsum.photos/200/300",
      title: "Data Science & Machine Learning(Theory+Projects)A-Z ",
      category: "Artificial Intelligence",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures  |  150h total length",
    },
    {
      src: "https://picsum.photos/200/300",
      title: "Data Science & Machine Learning(Theory+Projects)A-Z ",
      category: "Artificial Intelligence",
      price: "2400",
      originalPrice: "2600",
      lecture: "146 lectures  |  150h total length",
    },
  ]
  const { t } = useTranslation("category")
  return (
    <div>
      <h2 className="mb-4 font-bold">{t("FeaturedCourses")}</h2>
      <Slider {...settings}>
        {cardData.map((item) => {
          return (
            <div className="slidePadding">
              <HorizontalCard
                category={item.category}
                title={item.title}
                lecture={item.lecture}
                price={item.price}
                originalPrice={item.originalPrice}
                src={item.src}
              />
            </div>
          )
        })}
      </Slider>
    </div>
  )
}

export default FeaturedCourses
