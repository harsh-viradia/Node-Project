import React from "react"
import Slider from "react-slick"

const BrandCarousel = ({ data }) => {
  const { headerTitle } = data
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 7,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    nextArrow: false,
    prevArrow: false,
    arrows: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 2,
          initialSlide: 3,
        },
      },
      {
        breakpoint: 480,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <div className="my-12 lg:my-16">
      <div className="container">
        <h2 className="mb-4 font-bold">{headerTitle}</h2>
        <Slider {...settings}>
          <div>
            <img src="/images/netappLogo.svg" alt="" />
          </div>
          <div>
            <img src="/images/netappLogo.svg" alt="" />
          </div>
          <div>
            <img src="/images/netappLogo.svg" alt="" />
          </div>
          <div>
            <img src="/images/netappLogo.svg" alt="" />
          </div>
          <div>
            <img src="/images/netappLogo.svg" alt="" />
          </div>
          <div>
            <img src="/images/netappLogo.svg" alt="" />
          </div>
          <div>
            <img src="/images/netappLogo.svg" alt="" />
          </div>
          <div>
            <img src="/images/netappLogo.svg" alt="" />
          </div>
        </Slider>
      </div>
    </div>
  )
}

export default BrandCarousel
