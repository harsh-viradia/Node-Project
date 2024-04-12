/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/no-duplicate-string */
import React from "react"
import getImgUrl from "utils/util"
import Card from "widgets/card"
import Paginate from "widgets/pagination"

const WishListTab = ({ courses = [], paginate = {}, onPaginationChange = {}, addToWishList }) => {
  return (
    <>
      <div className="grid grid-cols-1 xl:grid-cols-3 lg:grid-cols-3 sm:grid-cols-2 gap-4">
        {courses.map(({ courseId = {} }) => {
          return (
            <Card
              src={getImgUrl(courseId.imgId?.uri)}
              category={courseId.parCategory?.[0]?.name}
              title={courseId.title}
              star
              reviews={courseId.avgStars || 0}
              totalReviews={courseId.totalReviews}
              price={courseId.price?.sellPrice}
              originalPrice={courseId.price?.MRP}
              slug={courseId.slug}
              wishList
              addToWishList={() => addToWishList(courseId)}
              isSaved={!courseId.isSaved}
              bestSeller={courseId.badgeId?.name || false}
            />
          )
        })}
      </div>
      <div className="mt-5">
        <Paginate paginate={paginate} onPaginationChange={onPaginationChange} />
      </div>
    </>
  )
}

export default WishListTab
