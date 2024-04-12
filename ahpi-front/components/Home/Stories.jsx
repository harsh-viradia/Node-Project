import useTranslation from "next-translate/useTranslation"
import React from "react"
import Slider from "react-slick"

import ReviewCard from "../../widgets/reviewCard"

const settings = {
  dots: false,
  infinite: true,
  slidesToShow: 3,
  slidesToScroll: 1,
  autoplay: true,
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
      breakpoint: 992,
      settings: {
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 767,
      settings: {
        arrows: false,
        slidesToShow: 2,
        slidesToScroll: 2,
        initialSlide: 2,
      },
    },
    {
      breakpoint: 575,
      settings: {
        arrows: false,
        slidesToShow: 1,
        slidesToScroll: 1,
        initialSlide: 1,
        variableWidth: true,
      },
    },
  ],
}

const Stories = () => {
  const { t } = useTranslation("home")
  return (
    <div className="mt-10 lg:mt-12 storySlider mdSliderVisible">
      <div className="container">
        <h2 className="mb-4 font-bold">{t("storiesInspired")}</h2>
        <Slider {...settings}>
          <div className="slidePadding">
            <ReviewCard mdBottomName />
          </div>
          <div className="slidePadding">
            <ReviewCard mdBottomName />
          </div>
          <div className="slidePadding">
            <ReviewCard mdBottomName />
          </div>
          <div className="slidePadding">
            <ReviewCard mdBottomName />
          </div>
        </Slider>
      </div>
    </div>
  )
}

export default Stories
