import { useRouter } from "node_modules/next/router"
import React from "react"
import Slider from "react-slick"
import ReviewCard from "widgets/reviewCard"

const ReviewCarousel = ({ data }) => {
  const { locale } = useRouter()
  const { headingTitle, reviews, rowPerWeb, headingTitleID } = data
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: rowPerWeb,
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

  return (
    <div className="mb-10 lg:mb-12 storySlider mdSliderVisible">
      <div className="container">
        <h2 className="mb-2 font-bold">{locale === "en" ? headingTitle : headingTitleID}</h2>
        <Slider {...settings}>
          {reviews.map((x) => (
            <div className="slidePadding">
              <ReviewCard mdBottomName fullName={x?.fullName} desc={x?.desc} stars={x?.stars} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  )
}

export default ReviewCarousel
