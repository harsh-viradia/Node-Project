/* eslint-disable no-underscore-dangle */
import React from "react"
import Slider from "react-slick"
import OrbitLink from "widgets/orbitLink"

const CompanyLogo = ({ data }) => {
  const { img, headingTitle, rowPerWeb } = data
  const settings = {
    dots: false,
    slidesToShow: rowPerWeb,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 3000,
    pauseOnHover: true,
    infinite: false,
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
          slidesToShow: 4,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 575,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }
  return (
    <div className="my-12 lg:my-16">
      <div className="container">
        <h2 className="mb-4 font-bold">{headingTitle}</h2>
        <Slider {...settings}>
          {img?.map((ele) => {
            return (
              <OrbitLink style={{ width: "30px" }} key={ele?._id} onClick={() => window.open(ele?.link)}>
                <img src={ele.fileId?.uri} alt={ele?.alt} title={ele?.alt} loading="lazy" className="h-20 w-30" />
              </OrbitLink>
            )
          })}
        </Slider>
      </div>
    </div>
  )
}

export default CompanyLogo
