/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { yupResolver } from "@hookform/resolvers/yup"
import { useRouter } from "next/router"
import React from "react"
import { useForm } from "react-hook-form"
import { courseInfoSchema } from "schema/common"
import { MODULE_ACTIONS } from "utils/constant"
import routes from "utils/routes"
import Button from "widgets/button"
import OrbitLoader from "widgets/loader"
import TextEditor from "widgets/textEditor"

import useSyncCourseInfo from "./hooks/useSyncCourseInfo"

const defaultValues = {
  briefDesc: "",
  about: "",
  includes: "",
  require: "",
}

const CourseInfo = ({ section, isAllow, pricing }) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    getValues,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(courseInfoSchema),
  })

  const { onSubmit, loading, loading2, hasPermission, moveToNextTab } = useSyncCourseInfo({
    reset,
    defaultValues,
    section,
    setValue,
    isAllow,
    pricing,
  })

  return (
    <>
      <div className="grid max-w-4xl gap-3 mx-auto mt-8">
        {loading2 && <OrbitLoader relative />}
        <TextEditor
          label="Course Brief Description"
          placeholder="Enter Course Brief Description"
          rest={register("briefDesc")}
          setValue={setValue}
          valueText="briefDesc"
          valueData={getValues("briefDesc")}
          error={errors.briefDesc?.message}
          disabled={hasPermission}
        />
        <TextEditor
          label="Who should enroll"
          placeholder="Enter Who should enroll"
          mandatory
          rest={register("about")}
          setValue={setValue}
          valueText="about"
          valueData={getValues("about")}
          error={errors.about?.message}
          disabled={hasPermission}
        />
        <TextEditor
          label="This Course Includes"
          placeholder="Enter This Course Includes"
          mandatory
          rest={register("includes")}
          setValue={setValue}
          valueText="includes"
          valueData={getValues("includes")}
          error={errors.includes?.message}
          disabled={hasPermission}
        />
        <TextEditor
          label="Requirements"
          placeholder="Enter Requirements"
          mandatory
          rest={register("require")}
          setValue={setValue}
          valueText="require"
          valueData={getValues("require")}
          error={errors.require?.message}
          disabled={hasPermission}
        />
      </div>
      <div className="grid max-w-4xl gap-3 mx-auto mt-8">
        <div className="flex items-center justify-end gap-3 mt-3">
          <Button
            onClick={() =>
              router.push({
                pathname: routes.course,
                query: { limit: router?.query?.limit, offset: router?.query?.offset },
              })
            }
            title="Close"
            outline
            className="hover:border-primary"
            disabled={loading}
          />
          {hasPermission ? (
            isAllow(MODULE_ACTIONS.CREATESECTIONS) ||
            isAllow(MODULE_ACTIONS.GETALLSECTIONS) ||
            isAllow(MODULE_ACTIONS.ADDPRICE) ? (
              <Button
                title="Next"
                kind="dark-gray"
                hoverKind="white"
                className="hover:border-primary"
                onClick={moveToNextTab}
                loading={loading}
              />
            ) : (
              ""
            )
          ) : (
            <Button
              title={
                isAllow(MODULE_ACTIONS.CREATESECTIONS) ||
                isAllow(MODULE_ACTIONS.GETALLSECTIONS) ||
                isAllow(MODULE_ACTIONS.ADDPRICE)
                  ? `Save & Next`
                  : "Save as Draft"
              }
              kind="dark-gray"
              hoverKind="white"
              className="hover:border-primary"
              onClick={handleSubmit(onSubmit)}
              loading={loading}
            />
          )}
        </div>
      </div>
    </>
  )
}

export default CourseInfo
