import useTranslation from "next-translate/useTranslation"
import { useRouter } from "node_modules/next/router"
import React from "react"
import routes from "utils/routes"
import { getLevel } from "utils/util"
import Card from "widgets/card"
import MediumCard from "widgets/mediumCard"
import MiniCard from "widgets/miniCard"
import OrbitLink from "widgets/orbitLink"

const FixedCourse = ({ data }) => {
  const { t } = useTranslation("common")
  const { locale } = useRouter()
  const { headingTitle, tabs, headingTitleID } = data

  return (
    <div className="mb-10 lg:mb-12 mdSliderVisible">
      <div className="container">
        <h2 className="mb-2 font-bold">{locale === "en" ? headingTitle : headingTitleID}</h2>
        <div className="flex">
          {tabs.map((item) => {
            return item?.cardType?.code === "BIG" ? (
              item?.course.map((x) => {
                return (
                  <div className="slidePadding px-3">
                    <OrbitLink href={`${routes.courseDetail}/${x?.slug}`}>
                      <Card
                        src={x?.imgId?.uri}
                        title={x?.title}
                        category={x?.parCategory?.[0]?.name}
                        price={x?.price?.sellPrice}
                        originalPrice={x?.price?.MRP}
                        reviews={x?.avgStars}
                        totalReviews={x?.totalReviews}
                        bestSeller={x?.badgeId?.name || false}
                      />
                    </OrbitLink>
                  </div>
                )
              })
            ) : item?.cardType?.code === "MEDIUM" ? (
              item?.course.map((x) => {
                return (
                  <div className="slidePadding px-3">
                    <OrbitLink href={`${routes.courseDetail}/${x?.slug}`}>
                      <MediumCard
                        src={x?.imgId?.uri}
                        title={x?.title}
                        category={x?.parCategory?.[0]?.name}
                        price={x?.price?.sellPrice}
                        originalPrice={x?.price?.MRP}
                        reviews={x?.avgStars}
                        totalReviews={x?.totalReviews}
                      />
                    </OrbitLink>
                  </div>
                )
              })
            ) : item?.cardType?.code === "SMALL" ? (
              item?.course.map((x) => {
                return (
                  <div className="slidePadding px-3">
                    <OrbitLink href={`${routes.courseDetail}/${x?.slug}`}>
                      <MiniCard
                        category={x?.parCategory?.[0]?.name}
                        title={x?.title}
                        lecture={x?.lang?.name}
                        price={x?.price?.sellPrice}
                        originalPrice={x?.price?.MRP}
                        src={x?.imgId?.uri}
                        totalLength={x?.totalLessons}
                        level={getLevel(
                          // locale === "en" ? x?.levelId?.names?.en : x?.levelId?.names?.id,
                          x?.levelId?.name,
                          x?.levelId?.code,
                          false
                        )}
                        reviews={x?.avgStars}
                        totalReviews={x?.totalReviews}
                      />
                    </OrbitLink>
                  </div>
                )
              })
            ) : (
              <>{t("noWidgetSize")}</>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default FixedCourse
