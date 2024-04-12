import BsStar from "icons/bsStar"
import BsStarFill from "icons/bsStarFill"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import ReactStars from "react-rating-stars-component"
import Button from "widgets/button"
import Textarea from "widgets/textarea"

import useAddReview from "./hook/useAddReview"

const AddReview = ({ courseId, getReviewList, getReviewData, setShowAddReviewBlock, courseName }) => {
  const { ...other } = useAddReview({ courseId, getReviewList, getReviewData, setShowAddReviewBlock, courseName })
  const { t } = useTranslation("courseDetail")

  return (
    <div className="mt-3 flex justify-center items-center flex-col">
      <div className="mb-2">
        <ReactStars
          a11y
          count={5}
          color="#F0B826"
          activeColor="#F0B826"
          value={other?.starValue}
          classNames="flex gap-2.5"
          emptyIcon={<BsStar size="18px" />}
          filledIcon={<BsStarFill size="18px" />}
          onChange={other?.setStarValue}
        />
        {other?.errors?.stars && (
          <p className="mt-2 text-left text-xs font-medium text-red">{t(other?.errors?.stars?.message)}</p>
        )}
      </div>
      <Textarea rest={other.register("desc")} placeholder={t("writeHereFeedback")} />
      <div className="mt-4">
        <Button title={t("submit")} onClick={other?.handleSubmit(other?.onSubmit)} />
      </div>
    </div>
  )
}

export default AddReview
