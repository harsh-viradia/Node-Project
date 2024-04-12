/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-shadow */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import { hasAccessOf } from "@knovator/can"
import useAddInstructor from "components/Instructor/hook/useAddInstructor"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { InstructorSchema, InstructorSchema1, InstructorSchema2 } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import Button from "widgets/button"
import Checkbox from "widgets/checkbox"
import FilterSelectDropdown from "widgets/FilterSelectDropdown"
import Input from "widgets/input"
import PhoneInput from "widgets/phoneInput"
import Textarea from "widgets/textarea"
import TextEditor from "widgets/textEditor"
import Upload from "widgets/upload"

const defaultValues = {
  firstName: "",
  lastName: "",
  companyNm: "",
  email: "",
  countryCode: "",
  phone: "",
  bio: "",
  profileId: "",
  fbLink: "",
  instaLink: "",
  linkedIn: "",
  websiteLink: "",
}
const defaultValues1 = {
  course: "",
  payoutPercentage: undefined,
  isApproved: false,
  category: "",
  allCat: false,
}
const defaultValues2 = {
  userAdd: "",
  bankNm: "",
  accNo: "",
  swiftCode: "",
  refCode: "",
  branchNm: "",
  branchAdd: "",
  branchCode: "",
  cityId: "",
  cityNm: "",
  countryId: "",
  countryNm: "",
}

const AddInstructorForm = ({
  setFilterObject,
  filter,
  permission,
  getList,
  editId,
  setEditId,
  open,
  setOpen,
  limit,
  offset,
  setCourseApproval,
  setFilter,
  searchValue,
  setSearchValue,
}) => {
  const [tabIndex, setTabIndex] = useState(0)
  const closeModal = () => {
    setOpen(false)
    setEditId()
    setTabIndex(0)
  }

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors = {}, isValid },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(InstructorSchema),
  })
  const {
    register: register1,
    handleSubmit: handleSubmit1,
    setValue: setValue1,
    clearErrors: clearErrors1,
    watch: watch1,
    reset: reset1,
    formState: { errors: errors1 = {}, isValid: isValid1 },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues1,
    resolver: yupResolver(InstructorSchema1),
  })
  const {
    register: register2,
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    reset: reset2,
    watch: watch2,
    formState: { errors: errors2 = {} },
  } = useForm({
    mode: "onTouched",
    reValidateMode: "onChange",
    defaultValues2,
    resolver: yupResolver(InstructorSchema2),
  })
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const { onSubmit, loading, ...other } = useAddInstructor({
    open,
    setSearchValue,
    closeModal,
    editId,
    getList,
    limit,
    offset,
    defaultValues,
    watch,
    watch1,
    setCourseApproval,
    setFilter,
    searchValue,
    filter,
    setFilterObject,
  })
  const submitMethods = {
    1: (callback) => handleSubmit(() => callback?.())(),
    2: (callback) => handleSubmit1(() => callback?.())(),
    3: () => handleSubmit2(onSubmit)(),
  }
  useEffect(() => {
    reset({ ...defaultValues })
    reset1({ ...defaultValues1 })
    reset2({ ...defaultValues2 })
    other.setSelectedImg()
  }, [open])
  useEffect(() => {
    if (editId) {
      setValue("firstName", editId.firstName)
      setValue("lastName", editId.lastName)
      setValue("companyNm", editId.companyNm)
      setValue("email", editId.email)
      setValue("phone", editId.mobNo)
      setValue("countryCode", editId.countryCode)
      setValue("bio", editId.bio)
      setValue("profileId", editId.profileId?._id)
      setValue1("isApproved", editId.agreement?.isApproved)
      setValue1("course", editId.agreement?.courseLimit)
      setValue1("payoutPercentage", editId.agreement?.payedPercent)
      setValue1("allCat", editId?.allCat)
      setValue1(
        "category",
        editId.agreement?.category?.map(({ _id, name }) => ({
          value: _id,
          label: name,
        }))
      )
      setValue1(
        "certificate",
        editId.agreement?.certificates?.map(({ _id, name }) => ({
          value: _id,
          label: name,
        }))
      )
      setValue2("userAdd", editId.bankDetails?.userAdd)
      setValue2("accNo", editId.bankDetails?.accNo)
      setValue2("bankNm", editId.bankDetails?.bankNm)
      setValue2("swiftCode", editId.bankDetails?.swiftCode)
      setValue2("refCode", editId.bankDetails?.refCode)
      setValue2("branchNm", editId.bankDetails?.branchNm)
      setValue2("branchAdd", editId.bankDetails?.branchAdd)
      setValue2("branchCode", editId.bankDetails?.branchCode)
      setValue2("cityId", editId.bankDetails?.cityId)
      setValue2("cityNm", editId.bankDetails?.cityNm)
      setValue2("countryId", editId.bankDetails?.countryId)
      setValue2("countryNm", editId.bankDetails?.countryNm)
      setValue("fbLink", editId?.socialLinks?.fbLink)
      setValue("instaLink", editId?.socialLinks?.instaLink)
      setValue("linkedIn", editId?.socialLinks?.linkedIn)
      setValue("websiteLink", editId?.socialLinks?.websiteLink)
      if (editId.profileId) other.setSelectedImg({ id: editId.profileId?._id, uri: editId.profileId?.uri })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editId])
  return (
    <DrawerWrapper
      title={editId ? "Update Partner" : "Add Partner"}
      width="max-w-3xl"
      modalFooter={
        <>
          <Button
            onClick={closeModal}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          {tabIndex === 2 ? (
            <>
              <Button
                title="Prev"
                onClick={() => {
                  setTabIndex(tabIndex - 1)
                }}
                // eslint-disable-next-line sonarjs/no-use-of-empty-return-value
              />
              <Button title={editId ? "Update Partner" : "Add Partner"} onClick={submitMethods[3]} loading={loading} />
            </>
          ) : (
            <>
              {tabIndex === 1 && (
                <Button
                  title="Prev"
                  onClick={() => {
                    setTabIndex(tabIndex - 1)
                  }}
                  // eslint-disable-next-line sonarjs/no-use-of-empty-return-value
                />
              )}
              <Button
                title="Next"
                onClick={() => {
                  if (tabIndex === 0) {
                    submitMethods[1](() => {
                      setTabIndex(tabIndex + 1)
                    })
                  }
                  if (tabIndex === 1) {
                    submitMethods[2](() => {
                      setTabIndex(tabIndex + 1)
                    })
                  }
                }}
                // eslint-disable-next-line sonarjs/no-use-of-empty-return-value
              />
            </>
          )}
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <Tabs selectedIndex={tabIndex}>
        <TabList>
          <Tab onClick={() => setTabIndex(0)}>Basic Information</Tab>
          <Tab onClick={() => isValid && setTabIndex(1)}>Agreement</Tab>
          <Tab onClick={() => isValid && isValid1 && setTabIndex(2)}>Bank Information</Tab>
        </TabList>

        <TabPanel>
          <div className="grid gap-3">
            <Input
              label="First Name"
              placeholder="Enter First Name"
              mandatory
              rest={register("firstName")}
              error={errors?.firstName?.message}
              className="capitalize"
            />
            <Input label="Last Name" placeholder="Enter Last Name" rest={register("lastName")} className="capitalize" />
            <Input label="Company Name" placeholder="Enter Company Name" rest={register("companyNm")} />
            <Input
              label="Email"
              placeholder="Enter Email"
              mandatory
              type="email"
              rest={register("email")}
              error={errors?.email?.message}
              onKeyDown={(event) => {
                if (event.which === 32) event.preventDefault()
              }}
            />

            <PhoneInput
              label="Phone"
              placeholder="Enter Phone Number"
              mandatory
              type="number"
              // rest={register("phone")}
              error={errors?.phone?.message}
              countryCode={watch("countryCode")}
              setValue={setValue}
              rest={register("phone", {
                onChange: (event) => {
                  if (event.target.value.length > 10) {
                    event.target.value = event.target.value.slice(0, 10)
                  }
                  return event.target.value
                },
              })}
            />

            <Upload
              label="Logo/Profile Image"
              selectedImg={other.selectedImg}
              setImg={(data) => {
                setValue("profileId", data?.id ? data?.id : "", { shouldValidate: true })
                other.setSelectedImg(data)
              }}
              error={errors?.profileId?.message}
              mandatory
              resolution="400px/100px"
            />
            <TextEditor
              label="Bio"
              placeholder="Enter Bio"
              mandatory
              valueText="bio"
              valueData={watch("bio")}
              rest={register("bio")}
              setValue={setValue}
              error={errors.bio?.message}
            />
            <Input
              label="Website"
              placeholder="Enter Website URL"
              rest={register("websiteLink")}
              error={errors?.websiteLink?.message}
            />
            <Input
              label="Instagram"
              placeholder="Enter Instagram Profile URL"
              rest={register("instaLink")}
              error={errors?.instaLink?.message}
            />
            <Input
              label="Facebook"
              placeholder="Enter Facebook Profile URL"
              rest={register("fbLink")}
              error={errors?.fbLink?.message}
            />
            <Input
              label="LinkedIn"
              placeholder="Enter LinkedIn Profile URL"
              rest={register("linkedIn")}
              error={errors?.linkedIn?.message}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid gap-3">
            <div>
              <Input
                min="0"
                label="No. Of Courses"
                placeholder="Enter No. Courses"
                mandatory
                type="number"
                rest={register1("course")}
                error={errors1?.course?.message}
              />
              <Checkbox rest={register1("isApproved")} title="Course Approval" className="pt-1" id="approval" />
            </div>
            <div>
              <FilterSelectDropdown
                isDisabled={watch1("allCat")}
                placeholder="Select Program"
                className="w-full"
                label="Program"
                mandatory
                module="category"
                action="list"
                isClearable
                query={{ isActive: true }}
                isSearch
                isMulti
                error={errors1.category?.message}
                onChange={(opt) => {
                  setValue1("category", opt, { shouldValidate: true })
                }}
                value={watch1("category")}
                mount={hasAccessOf(permission, MODULES.CATEGORY, MODULE_ACTIONS.GETALL)}
              />
              <Checkbox
                rest={register1("allCat")}
                checked={watch1("allCat")}
                onChange={(e) => {
                  setValue1("allCat", e.target.checked)
                  clearErrors1("category")
                  setValue1("category", "")
                }}
                title="All Program"
                className="pt-1"
                id="allcategory"
              />
            </div>
            <FilterSelectDropdown
              placeholder="Search Certificate"
              className="w-full"
              label="Certificate"
              mandatory
              module="certificate"
              action="list"
              isClearable
              query={{ isActive: true }}
              isSearch
              isMulti
              error={errors1.certificate?.message}
              onChange={(opt) => {
                setValue1("certificate", opt, { shouldValidate: true })
              }}
              value={watch1("certificate")}
              mount={hasAccessOf(permission, MODULES.CERTIFICATE, MODULE_ACTIONS.GETALL)}
            />
            <Input
              label="Payout Percentage(%)"
              placeholder="Enter Payout Percentage(%)"
              mandatory
              type="number"
              rest={register1("payoutPercentage")}
              error={errors1?.payoutPercentage?.message}
              min={0}
              max={100}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid gap-3">
            <Input
              label="Bank Account No"
              placeholder="Enter Bank Account No"
              mandatory
              rest={register2("accNo")}
              error={errors2?.accNo?.message}
              type="number"
            />
            <Input
              label="Bank Name"
              placeholder="Enter Bank Name"
              mandatory
              rest={register2("bankNm")}
              error={errors2?.bankNm?.message}
            />
            <Input
              label="Swift Code (8 characters)"
              placeholder="Enter Swift Code"
              mandatory
              rest={register2("swiftCode")}
              error={errors2?.swiftCode?.message}
              maxLength={8}
            />
            <Input
              label="Reff code"
              placeholder="Enter Ref Code"
              mandatory
              rest={register2("refCode")}
              error={errors2?.refCode?.message}
            />
            <Input
              label="Branch Name"
              placeholder="Enter Branch Name"
              mandatory
              rest={register2("branchNm")}
              error={errors2?.branchNm?.message}
            />

            <Input
              label="Branch Code"
              placeholder="Enter Branch Code"
              mandatory
              rest={register2("branchCode")}
              error={errors2?.branchCode?.message}
            />
            <FilterSelectDropdown
              action="cityList"
              module="city"
              label="City"
              placeholder="Search City"
              mandatory
              error={errors2?.cityId?.message}
              onChange={(opt) => {
                setValue2("cityId", opt?.value, { shouldValidate: true })
                setValue2("cityNm", opt?.label, { shouldValidate: true })
              }}
              value={watch2("cityId") ? { value: watch2("cityId"), label: watch2("cityNm") } : undefined}
              isClearable
              isSearch
            />
            <FilterSelectDropdown
              action="all"
              module="country"
              label="Country"
              placeholder="Search Country"
              mandatory
              error={errors2?.countryId?.message}
              onChange={(opt) => {
                setValue2("countryId", opt?.value, { shouldValidate: true })
                setValue2("countryNm", opt?.label, { shouldValidate: true })
              }}
              value={watch2("countryId") ? { value: watch2("countryId"), label: watch2("countryNm") } : undefined}
              isClearable
              isSearch
            />
            <Textarea
              label="Branch Address"
              placeholder="Enter Branch Address"
              mandatory
              rest={register2("branchAdd")}
              error={errors2?.branchAdd?.message}
            />
            <Textarea
              label="Sender Address"
              placeholder="Enter Sender Address"
              mandatory
              rest={register2("userAdd")}
              error={errors2?.userAdd?.message}
            />
          </div>
        </TabPanel>
      </Tabs>
    </DrawerWrapper>
  )
}

export default AddInstructorForm
