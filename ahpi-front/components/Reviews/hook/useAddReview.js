import * as amplitude from "@amplitude/analytics-browser"
import { yupResolver } from "@hookform/resolvers/yup"
import commonApi from "api/index"
import { useContext, useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { addReviewSchema } from "schema/common"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"

const defaultValues = {
  stars: undefined,
  desc: undefined,
}

// eslint-disable-next-line no-unused-vars
const useAddReview = ({
  courseId,
  getReviewList = () => {},
  getReviewData = () => {},
  setShowAddReviewBlock = () => {},
  courseName = "",
}) => {
  const {
    handleSubmit,
    clearErrors,
    setValue,
    register,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,

    resolver: yupResolver(addReviewSchema),
  })
  const [starValue, setStarValue] = useState(5)
  const { userData } = useContext(AppContext)

  // eslint-disable-next-line unicorn/consistent-function-scoping, no-unused-vars
  const onSubmit = async (values) => {
    const payload = {
      courseId,
      stars: values.stars,
      desc: values.desc,
    }

    await commonApi({
      action: "addReview",
      data: payload,
    }).then(([error]) => {
      if (error) return
      amplitude.track(ANALYTICS_EVENT.SUBMIT_REVIEW, {
        CourseId: courseId,
        userId: userData?.id,
        userEmail: userData?.email,
        courseName,
      })
      getReviewList()
      getReviewData(courseId)
      setShowAddReviewBlock(0)

      // eslint-disable-next-line consistent-return
      return false
    })
  }

  useEffect(() => {
    if (starValue) {
      setValue("stars", starValue)
      clearErrors("stars")
    }
  }, [starValue])

  return { starValue, setStarValue, onSubmit, errors, handleSubmit, setValue, register }
}

export default useAddReview
