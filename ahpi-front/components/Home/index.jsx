/* eslint-disable sonarjs/cognitive-complexity */
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import { WIDGET } from "utils/constant"

import BannerCarousle from "./Banner/BannerCarousle"
import CompanyLogo from "./Banner/CompanyLogo"
import FixedBanner from "./Banner/FixedBanner"
import BrandCarousel from "./Brands/BrandCarousel"
import CategoryCard from "./Category/CategoryCard"
import CategoryCarosle from "./Category/CategoryCarosle"
import CourseCarousle from "./Course/CourseCarousle"
import CourseTab from "./Course/CourseTab"
import FixedCourse from "./Course/FixedCourse"
import ReviewCarousel from "./Review/ReviewCarousel"

const Home = ({ widgetData = [], metaData }) => {
  return (
    <LayoutWrapper meta={metaData}>
      {widgetData.length > 0 ? (
        widgetData.map((ele) => {
          return ele.widget.map((widget) => {
            switch (widget.type?.code) {
              case WIDGET.TYPE.IMAGE: {
                if (WIDGET.SECTION_TYPE.CAROUSEL === widget.secType?.code) {
                  if (widget.imgType.code === "LOGO") return <CompanyLogo data={widget} />
                  return <BannerCarousle data={widget} />
                }
                if (WIDGET.SECTION_TYPE.FIX_CARD === widget.secType?.code) {
                  return <FixedBanner data={widget} />
                }
                break
              }
              case WIDGET.TYPE.COURSE: {
                if (WIDGET.SECTION_TYPE.CAROUSEL === widget.secType?.code) {
                  return <CourseCarousle data={widget} />
                }
                if (WIDGET.SECTION_TYPE.TAB === widget.secType?.code) {
                  return <CourseTab data={widget} />
                }
                if (WIDGET.SECTION_TYPE.FIX_CARD === widget.secType?.code) {
                  return <FixedCourse data={widget} />
                }
                break
              }
              case WIDGET.TYPE.CATEGORY: {
                if (WIDGET.SECTION_TYPE.FIX_CARD === widget.secType?.code) {
                  return <CategoryCard data={widget} />
                }
                if (WIDGET.SECTION_TYPE.CAROUSEL === widget.secType?.code) {
                  return <CategoryCarosle data={widget} />
                }
                break
              }
              case WIDGET.TYPE.REVIEW: {
                if (WIDGET.SECTION_TYPE.CAROUSEL === widget.secType?.code) {
                  return <ReviewCarousel data={widget} />
                }
                break
              }
              case WIDGET.TYPE.COMPONIES: {
                if (WIDGET.SECTION_TYPE.CAROUSEL === widget.secType?.code) {
                  return <BrandCarousel data={widget} />
                }
                break
              }
              default: {
                return <div className="flex items-center justify-center py-5" />
              }
            }
            return ""
          })
        })
      ) : (
        <div className="flex items-center justify-center py-5">No widget found</div>
      )}
    </LayoutWrapper>
  )
}

export default Home
