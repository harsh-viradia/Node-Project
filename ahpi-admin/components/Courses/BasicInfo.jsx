/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { yupResolver } from "@hookform/resolvers/yup"
import { hasAccessOf } from "@knovator/can"
// import dynamic from "next/dynamic"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { basicCourseSchema } from "schema/common"
import {
  CODE_REGEX,
  CODE_REPLACE_REGEX,
  MASTER_CODES,
  MODULE_ACTIONS,
  MODULES,
  SLUG_REGEX,
  SLUG_REPLACE_REGEX,
  SPACE_REMOVE_REGEX,
  SYSTEM_USERS,
} from "utils/constant"
import routes from "utils/routes"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"
import Input from "widgets/input"
import OrbitLoader from "widgets/loader"
import MasterSelect from "widgets/masterSelect"
import TextEditor from "widgets/textEditor"

import CourseImageUploader from "./CourseImageUploader"
import useSyncBasicInfo from "./hooks/useSyncBasicInfo"

const defaultValues = {
  title: undefined,
  slug: undefined,
  desc: undefined,
  levelId: undefined,
  userId: undefined,
  parCategory: undefined,
  category: undefined,
  imgId: undefined,
  // vidId: undefined,
  certificateId: undefined,
  videoProgress: undefined,
}

// const VideoUpload = dynamic(() => import("widgets/videoUpload"), {
//   ssr: false,
// })

// eslint-disable-next-line sonarjs/cognitive-complexity
const BasicInfo = ({ messages, section, isAllow, pricing, user, permission }) => {
  const {
    register,
    handleSubmit,
    reset,
    clearErrors,
    setValue,
    // getValues,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: { ...defaultValues },
    resolver: yupResolver(basicCourseSchema),
  })
  const router = useRouter()
  useEffect(() => {
    setValue("userId", user?.role === SYSTEM_USERS.INSTRUCTOR ? user?.id : undefined)
  }, [])
  const {
    onSubmit,
    loading,
    loading2,
    coachOptions,
    categoryOptions,
    subCategoryOptions,
    getCoachList,
    getCategoryList,
    getSubCategoryList,
    fileData,
    // videoData,
    hasPermission,
    moveToNextTab,
  } = useSyncBasicInfo({
    reset,
    defaultValues,
    messages,
    watch,
    setValue,
    isAllow,
    section,
    pricing,
    permission,
    user,
  })

  useEffect(() => {
    if (watch("parCategory"))
      setValue(
        "category",
        watch("category")?.length ? watch("category").filter((a) => a.value !== watch("parCategory")) : ""
      )
  }, [watch("parCategory")])
  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(onSubmit)()
    }
  }

  return (
    <div className="grid items-start max-w-4xl grid-cols-2 gap-3 mx-auto mt-8">
      {loading2 && <OrbitLoader relative />}
      <Input
        label="Course Title"
        placeholder="Enter course Title"
        mandatory
        rest={register("title")}
        error={errors?.title?.message}
        disabled={loading || hasPermission}
        onKeyDown={(event) => onKeyDown(event)}
      />
      <Input
        label="Course Slug"
        placeholder="Enter Slug"
        mandatory
        rest={register("slug", {
          onChange: (event) => {
            let values = event?.target?.value?.toLowerCase()
            values = values.replace(SPACE_REMOVE_REGEX, "-")
            if (values && SLUG_REGEX.test(values)) {
              setValue("slug", values)
            } else if (!values) {
              setValue("slug", "")
            } else {
              setValue("slug", values.replace(SLUG_REPLACE_REGEX, ""))
            }
          },
        })}
        error={errors?.slug?.message}
        disabled={loading || hasPermission}
        onKeyDown={(event) => onKeyDown(event)}
      />
      <MasterSelect
        showCode
        isDisabled={loading || hasPermission}
        placeholder="Select Language"
        className="w-full"
        label="Language"
        mandatory
        id="lang"
        code={MASTER_CODES.languages}
        rest={register("lang")}
        error={errors.lang?.message}
        value={watch("lang") ? { label: watch("langNm"), value: watch("lang") } : undefined}
        onChange={(opt) => {
          setValue("lang", opt?.value || "", { shouldValidate: true })
          setValue("langNm", opt?.label)
        }}
        onKeyDown={(event) => onKeyDown(event)}
        isSearch={false}
        isClearable
      />
      <Input
        label="Course prefix"
        placeholder="Enter course prefix"
        mandatory
        rest={register("certiPrefix", {
          onChange: (event) => {
            const values = event.target.value.replaceAll(CODE_REPLACE_REGEX, "")?.toUpperCase()
            if (values && CODE_REGEX.test(values)) {
              setValue("certiPrefix", values)
            } else if (!values) {
              setValue("certiPrefix", "")
            } else {
              setValue("certiPrefix", values.replace(SLUG_REPLACE_REGEX, "_"))
            }
          },
        })}
        error={errors?.certiPrefix?.message}
        disabled={loading || hasPermission}
        onKeyDown={(event) => onKeyDown(event)}
      />

      <div className="col-span-2">
        <TextEditor
          label="Course Description"
          placeholder="Enter Course Description"
          mandatory
          rest={register("desc")}
          setValue={setValue}
          valueText="desc"
          valueData={watch("desc")}
          error={errors.desc?.message}
          onKeyDown={(event) => onKeyDown(event)}
          disabled={loading || hasPermission}
        />
      </div>
      <MasterSelect
        showCode
        isDisabled={loading || hasPermission}
        placeholder="Select Level"
        className="w-full"
        label="Level"
        mandatory
        id="levelId"
        code={MASTER_CODES.level}
        rest={register("levelId")}
        error={errors.levelId?.message}
        value={watch("levelId") ? { label: watch("levelNm"), value: watch("levelId") } : ""}
        onChange={(opt) => {
          setValue("levelId", opt?.value, { shouldValidate: true })
          setValue("levelNm", opt?.label)
        }}
        onKeyDown={(event) => onKeyDown(event)}
        isSearch={false}
      />
      {user?.role === SYSTEM_USERS.INSTRUCTOR ? (
        ""
      ) : (
        <Dropdown
          isDisabled={loading || hasPermission}
          placeholder="Search Partner"
          className="w-full"
          label="Partner"
          mandatory
          id="userId"
          value={watch("userId") ? { label: watch("userIdNm"), value: watch("userId") } : ""}
          rest={register("userId")}
          defaultOptions={coachOptions}
          loadOptions={getCoachList}
          onChange={(opt) => {
            setValue("userId", opt?.value, { shouldValidate: true })
            setValue("userIdNm", opt?.label, { shouldValidate: true })
          }}
          // onKeyDown={(event) => onKeyDown(event)}
          error={errors?.userId?.message}
          isClearable
        />
      )}
      <Dropdown
        isDisabled={!watch("userId") || loading || hasPermission}
        placeholder="Search Primary Program"
        className="w-full"
        label="Primary Program"
        mandatory
        id="parCategory"
        value={watch("parCategory") ? { label: watch("parCategoryNm"), value: watch("parCategory") } : ""}
        rest={register("parCategory")}
        defaultOptions={categoryOptions}
        loadOptions={getCategoryList}
        onChange={async (opt) => {
          setValue("parCategory", opt?.value, { shouldValidate: true })
          setValue("parCategoryNm", opt?.label)
          // getSubCategoryList()
        }}
        // onKeyDown={(event) => onKeyDown(event)}
        error={errors?.parCategory?.message}
        isClearable
      />
      <Dropdown
        isDisabled={!watch("userId") || loading || hasPermission}
        placeholder="Search Program"
        className="w-full"
        label="Program"
        mandatory
        id="category"
        value={watch("category")}
        rest={register("category")}
        defaultOptions={subCategoryOptions}
        loadOptions={getSubCategoryList}
        onChange={(opt) => {
          setValue("category", opt, { shouldValidate: true })
        }}
        // onKeyDown={(event) => onKeyDown(event)}
        error={errors?.category?.message}
        isClearable
        isMulti
      />
      <FilterSelectDropdown
        isDisabled={!watch("userId") || loading || hasPermission}
        placeholder="Select Certificate"
        className="w-full"
        label="Certificate"
        mandatory
        module="certificate"
        action="list"
        isClearable
        mount={hasAccessOf(permission, MODULES.CERTIFICATE, MODULE_ACTIONS.GETALL) ? watch("userId") : false}
        query={{ isActive: true, filter: { instructorId: watch("userId") } }}
        isSearch
        error={errors.certificateId?.message}
        onChange={(opt) => {
          setValue("certificateId", opt?.value, { shouldValidate: true })
          setValue("certificateNm", opt?.label, { shouldValidate: true })
        }}
        value={watch("certificateId") ? { value: watch("certificateId"), label: watch("certificateNm") } : undefined}
        searchColumns={["name"]}
      />
      <div className="col-span-2">
        <CourseImageUploader
          keyId="imgId"
          label="Course Image"
          mandatory
          setValue={setValue}
          clearErrors={clearErrors}
          fileData={fileData}
          error={errors.imgId?.message}
          resolution="400px/100px"
          disabled={loading || hasPermission}
        />
      </div>
      {/* <div className="col-span-2">
        <VideoUpload
          keyId="vidId"
          label="Promotional Video"
          fileData={videoData}
          setValue={setValue}
          videoId={watch("vidId")}
          error={getValues("videoProgress") ? "Please wait while video is uploading." : errors.vidId?.message}
          disabled={loading || hasPermission}
        />
      </div> */}
      <div className="col-span-2 max-w-4xl mt-8">
        <div className="flex items-center justify-end gap-3 mt-3">
          <Button
            title="Close"
            outline
            className="hover:border-primary"
            disabled={loading}
            onClick={() =>
              router.push({
                pathname: routes.course,
                query: { limit: router?.query?.limit, offset: router?.query?.offset },
              })
            }
          />
          {hasPermission ? (
            isAllow(MODULE_ACTIONS.COURSEINFO) ||
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
                isAllow(MODULE_ACTIONS.COURSEINFO) ||
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
    </div>
  )
}

export default BasicInfo
