/* eslint-disable no-underscore-dangle */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable jsx-a11y/media-has-caption */
import React from "react"
import useCategory from "shared/Header/hook/useCategory"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import { capitalizeFirstLetter } from "utils/constant"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"

const PrivacyPolicy = () => {
  const { category = [] } = useCategory()
  const pagesLink = [
    { href: "/", title: "Home" },
    // { href: "/", title: "Courses" },
    { href: "/about-us", title: "About Us" },
    { href: "/contact-us", title: "Contact Us" },
    { href: "/privacy-policy", title: "Privacy Policy" },
    { href: "/terms", title: "Terms & Conditions" },
  ]

  return (
    <LayoutWrapper>
      <div className="container mt-6">
        <h1>Sitemap</h1>

        <div className="relative mt-6">
          <h2 className="mb-5">Pages</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {pagesLink.map((items) => (
              <OrbitLink href={items.href} className="text-primary hover:underline">
                {items.title}
              </OrbitLink>
            ))}
          </div>
        </div>
        <div className="relative mt-10">
          <h2 className="mb-4">Categories</h2>
          {category.map((items) => {
            return (
              <div className="mb-8">
                <h4 className="mb-4">{capitalizeFirstLetter(items?.name)}</h4>
                {items?.subCategory?.map((x) => (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
                    <OrbitLink
                      href={`${routes.category}/${x?.slug}?name=${x?.name}`}
                      className="text-primary hover:underline"
                    >
                      {x?.name}
                    </OrbitLink>
                  </div>
                ))}
              </div>
            )
          })}
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default PrivacyPolicy
