/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable no-underscore-dangle */
import { useRouter } from "next/router"
import React from "react"

const FixedBanner = ({ data }) => {
  const { imgType, img } = data
  const { locale } = useRouter()
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const redirect = (uri) => {
    const win = window.open(uri)
    win.open()
  }
  return (
    <div className="my-10 banner lg:my-12">
      <div className={`cursor-pointer ${imgType.code === "FULL" ? "container-fluid" : "container"}`}>
        {img.map((ele) => (
          <div className="relative" key={ele?._id}>
            {/*= ==== 
                
                *** Important Note For Developers ***

                *If you are use tile and buttons in banner then use above div  
                <div className="text-white lg:pt-80 sm:py-16 bg-primary ">
                  <div className="absolute bottom-0 left-0 right-0 mx-auto">
                    {
                      // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
                      <img
                        src={`${ele.fileId?.uri}`}
                        alt=""
                        className="object-cover w-full lg:h-96"
                        onClick={() => redirect(ele?.link)}
                      />
                    }
                  </div>
                </div>
                
                 ===== */}

            {
              // eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-noninteractive-element-interactions
              <img
                src={locale === "en" ? `${ele.fileId?.uri}` : `${ele.fileIdIndo?.uri}`}
                alt=""
                className="block object-cover w-full h-auto "
                onClick={() => redirect(ele?.link)}
                loading="lazy"
              />
            }
          </div>
        ))}
      </div>
    </div>
  )
}

export default FixedBanner
