import useTranslation from "next-translate/useTranslation"
import React, { useCallback } from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import Button from "widgets/button"
import FilterSelectDropdown from "widgets/dynamicDataDropdown"
import Input from "widgets/input"

import useProfileSetting from "./hook/useProfileSetting"
import ProfilePhotoUploader from "./profilePhotoUploader"
import ProfileSettingSidebar from "./profileSettingSidebar"

const ProfileSetting = () => {
  const { t } = useTranslation("profileSetting")
  const {
    register,
    errors,
    handleSubmit,
    onSubmit,
    image,
    setImage,
    loading,
    setRole,
    clearErrors,
    role,
    setValue,
    watch,
  } = useProfileSetting()

  const GetRoleInputFields = useCallback(() => {
    const designationValue = watch("designation")
    const value = role || designationValue.label
    switch (value) {
      case "Student": {
        return (
          <>
            <Input
              label={t("university")}
              placeholder={t("enterUniversityName")}
              rest={{
                ...register("university", {
                  onChange: (event) => {
                    setValue("university", event.target.value)
                  },
                }),
              }}
              error={t(errors.university?.message)}
              mandatory
            />
            <Input
              label={t("course")}
              placeholder={t("enterCourseName")}
              rest={{
                ...register("course", {
                  onChange: (event) => {
                    setValue("course", event.target.value)
                  },
                }),
              }}
              error={t(errors.course?.message)}
              mandatory
            />
          </>
        )
      }
      case "Working professional": {
        return (
          <>
            <Input
              label={t("organization")}
              placeholder={t("enterOrganizationName")}
              rest={{
                ...register("organization", {
                  onChange: (event) => {
                    setValue("organization", event.target.value)
                  },
                }),
              }}
              error={t(errors.organization?.message)}
              mandatory
            />
            <Input
              label={t("profession")}
              placeholder={t("enterProfessionName")}
              rest={{
                ...register("profession", {
                  onChange: (event) => {
                    setValue("profession", event.target.value)
                  },
                }),
              }}
              error={t(errors.profession?.message)}
              mandatory
            />
          </>
        )
      }
      default: {
        break
      }
    }
    return false
  }, [role, errors, watch("designation")])

  return (
    <LayoutWrapper>
      <div className="container lg:my-16 sm:my-12 my-9">
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden md:col-span-4 md:block">
            <ProfileSettingSidebar />
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="flex gap-4">
              <h2>{t("profile")}</h2>
              {/* <OrbitLink className="self-center text-primary">Edit</OrbitLink> */}
            </div>
            <ProfilePhotoUploader image={image} setImage={setImage} />
            <div className="grid grid-cols-2 gap-4">
              <Input
                placeholder={t("enterFirstName")}
                label={t("firstName")}
                mandatory
                rest={register("firstName")}
                error={errors?.firstName?.message}
              />
              <Input
                placeholder={t("enterLastName")}
                label={t("lastName")}
                // mandatory
                rest={register("lastName")}
                error={errors?.lastName?.message}
              />
              <Input
                placeholder={t("enterEmailAddress")}
                label={t("Email")}
                mandatory
                rest={register("email")}
                disabled
              />
              <Input
                placeholder={t("enterPhoneNumber")}
                type="number"
                label={t("Phone")}
                mandatory
                rest={register("mobNo")}
                disabled
              />
              <FilterSelectDropdown
                label={t("employmentStatus")}
                action="getMasterList"
                mandatory
                mount
                showCode
                onChange={(opt) => {
                  setRole(opt?.name)
                  setValue("designation", {
                    label: opt?.name,
                    // eslint-disable-next-line no-underscore-dangle
                    value: opt?._id,
                  })
                  clearErrors("designation")
                  if (!opt) {
                    setValue("course", "")
                    setValue("university", "")
                    setValue("organization", "")
                    setValue("profession", "")
                    setValue("designation", "")
                  }
                }}
                value={watch("designation")}
                error={t(errors.designation?.message)}
                setValue={setValue}
                isRegister
              />
              {role !== undefined && watch("designation") !== undefined && <GetRoleInputFields />}
            </div>
            <div className="flex justify-end">
              <Button loading={loading} title={t("updateProfile")} primaryShadowBTN onClick={handleSubmit(onSubmit)} />
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default ProfileSetting
