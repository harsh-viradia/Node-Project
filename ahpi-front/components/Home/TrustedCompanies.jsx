import useTranslation from "next-translate/useTranslation"
import React from "react"
import Slider from "react-slick"

const TrustedCompanies = () => {
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
  const { t } = useTranslation("common")
  return (
    <div className="my-12 lg:my-16">
      <div className="">
        <h2 className="mb-4 font-bold">{t("trustedByCompanies")}</h2>
        <Slider {...settings}>
          <div>
            <img className="h-20 w-30" src="/images/orbitLogo.png" alt="Trusted-company" loading="lazy" />
          </div>
          <div>
            <img className="h-20 w-30" src="/images/orbitLogo.png" alt="Trusted-company" loading="lazy" />
          </div>
          <div>
            <img className="h-20 w-30" src="/images/orbitLogo.png" alt="Trusted-company" loading="lazy" />
          </div>
          <div>
            <img className="h-20 w-30" src="/images/orbitLogo.png" alt="Trusted-company" loading="lazy" />
          </div>
          <div>
            <img className="h-20 w-30" src="/images/orbitLogo.png" alt="Trusted-company" loading="lazy" />
          </div>
          <div>
            <img className="h-20 w-30" src="/images/orbitLogo.png" alt="Trusted-company" loading="lazy" />
          </div>
          <div>
            <img className="h-20 w-30" src="/images/orbitLogo.png" alt="Trusted-company" loading="lazy" />
          </div>
          <div>
            <img className="h-20 w-30" src="/images/orbitLogo.png" alt="Trusted-company" loading="lazy" />
          </div>
        </Slider>
      </div>
    </div>
  )
}

export default TrustedCompanies
