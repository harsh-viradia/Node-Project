/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable no-console */
/* eslint-disable no-underscore-dangle */
import { useRouter } from "next/router"
import React from "react"
import Slider from "react-slick"

const BannerCarousle = ({ data }) => {
  const { imgType, img } = data
  const { locale } = useRouter()
  const settings = {
    dots: false,
    slidesToShow: 1,
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
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 767,
        settings: {
          arrows: false,
          slidesToShow: 1,
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

  // eslint-disable-next-line unicorn/consistent-function-scoping
  const redirect = (uri) => {
    const win = window.open(uri)
    win.open()
  }

  return (
    <div className="banner">
      <div
        className={`cursor-pointer ${
          imgType?.code === "FULL" ? "container-fluid set-slick-prev set-slick-next" : "container"
        }`}
      >
        <Slider {...settings}>
          {img.map((ele) => {
            return (
              <div className="relative" key={ele?._id}>
                {/*= ==== 
                
                *** Important Note For Developers ***

                *If you are use tile and buttons in banner then use above div  
                <div className="text-white lg:pt-80 sm:py-16 bg-primary ">
                  <div className="absolute bottom-0 left-0 right-0 mx-auto">
                    <img
                        src={`${ele.fileId?.uri}`}
                        alt={ele?.alt}
                        title={ele?.alt}
                        className="object-cover w-full lg:h-96"
                        onClick={() => redirect(ele?.link)}
                      />
                  </div>
                </div>
                
                 ===== */}

                {
                  // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions, jsx-a11y/mouse-events-have-key-events
                  <img
                    src={locale === "en" ? `${ele.fileId?.uri}` : `${ele.fileIdIndo?.uri}`}
                    alt={locale === "en" ? ele?.alt : ele?.altID}
                    title={locale === "en" ? ele?.alt : ele?.altID}
                    className="block object-cover w-full h-full"
                    onClick={() => redirect(ele?.link)}
                    loading="lazy"
                  />
                }
              </div>
            )
          })}
        </Slider>
      </div>
    </div>
  )
}

export default BannerCarousle
