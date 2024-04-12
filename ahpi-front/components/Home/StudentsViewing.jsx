/* eslint-disable react/no-array-index-key */
/* eslint-disable sonarjs/no-duplicate-string */
import useTranslation from "next-translate/useTranslation"
import React from "react"
import Slider from "react-slick"

import MediumCard from "../../widgets/mediumCard"

const cardData = [
  {
    src: "https://picsum.photos/200/300",
    title: "TensorFlow Developer Certificate in 2022",
    category: "Artificial ",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/301",
    title: "TensorFlow Developer Certificate in 2023",
    category: "Artificial ",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/302",
    title: "TensorFlow Developer Certificate in 2024",
    category: "Artificial ",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/304",
    title: "TensorFlow Developer Certificate in 2024",
    category: "Artificial ",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/303",
    title: "TensorFlow Developer Certificate in 2025",
    category: "Artificial Intelligence",
    price: "2400",
    originalPrice: "2600",
  },
  {
    src: "https://picsum.photos/200/303",
    title: "TensorFlow Developer Certificate in 2025",
    category: "Artificial Intelligence",
    price: "2400",
    originalPrice: "2600",
  },
]
const settings = {
  dots: false,
  infinite: true,
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

const StudentViewing = () => {
  const { t } = useTranslation("home")
  return (
    <div className="mb-10 lg:mb-12 mdSliderVisible">
      <div className="container">
        <h2 className="mb-4 font-bold">{t("studentViewing")}</h2>
        <div className="">
          <Slider {...settings}>
            {cardData.map((item) => {
              return (
                <div className="slidePadding">
                  <MediumCard
                    src={item.src}
                    title="TensorFlow Developer Certificate in 2022..."
                    category="Artificial Intelligence"
                    price="2400"
                    originalPrice="2600"
                  />
                </div>
              )
            })}
          </Slider>
        </div>
      </div>
    </div>
  )
}

export default StudentViewing
