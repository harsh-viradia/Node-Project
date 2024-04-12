/* eslint-disable react/no-danger */
/* eslint-disable jsx-a11y/iframe-has-title */
import { yupResolver } from "@hookform/resolvers/yup"
import NewTabIcon from "icons/newTabIcon"
import getConfig from "next/config"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { rejectReviewSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { MODULE_ACTIONS } from "utils/constant"
import Button from "widgets/button"
import OrbitLink from "widgets/orbitLink"
import TextEditor from "widgets/textEditor"

const { publicRuntimeConfig } = getConfig()
const defaultValues = { rejectReason: undefined }
const PreviewCourse = ({
  courseDetails,
  open,
  setOpen,
  title = "Preview Course",
  token,
  rejectPreview,
  acceptPreview,
  isAllow,
}) => {
  const [showReject, setShowReject] = useState(false)
  const {
    handleSubmit,
    setValue,
    reset,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(rejectReviewSchema),
  })
  const closeModal = () => {
    setOpen()
  }
  useEffect(() => {
    if (open) reset(defaultValues)
    else setShowReject()
  }, [open])
  return (
    <DrawerWrapper
      width="max-w-7xl"
      title={showReject ? "Reason For Reject" : title}
      titleButton={
        <div className="flex gap-3 items-center">
          {!showReject && (
            <OrbitLink
              onClick={() =>
                window.open(
                  `${publicRuntimeConfig.NEXT_PUBLIC_FRONT_URL}/my-learning/${courseDetails?.slug}?isFromAdmin=true&token=${token}`,
                  "_blank"
                )
              }
            >
              <NewTabIcon className="fill-primary" />
            </OrbitLink>
          )}
          {!courseDetails?.isReject && courseDetails?.isPreview ? (
            showReject ? (
              <>
                <Button
                  onClick={() => setShowReject(false)}
                  title="Cancel"
                  kind="dark-gray"
                  hoverKind="white"
                  className="hover:border-primary"
                />
                <Button onClick={handleSubmit(rejectPreview)} title="Submit" />
              </>
            ) : (
              <>
                {isAllow(MODULE_ACTIONS.REJECT) && (
                  <Button
                    onClick={() => setShowReject(true)}
                    title="Reject"
                    kind="red"
                    hoverKind="white"
                    darkHoverKind="red"
                  />
                )}
                {isAllow(MODULE_ACTIONS.VERIFY) && <Button onClick={() => acceptPreview()} title="Accept" />}
              </>
            )
          ) : undefined}
        </div>
      }
      open={open}
      setOpen={closeModal}
    >
      {showReject ? (
        <TextEditor
          valueText="rejectReason"
          valueData={watch("rejectReason")}
          setValue={setValue}
          error={errors?.rejectReason?.message}
          placeholder="Enter Reason For Reject"
          mandatory
        />
      ) : (
        <iframe
          width="100%"
          height="100%"
          src={`${publicRuntimeConfig.NEXT_PUBLIC_FRONT_URL}/my-learning/${courseDetails?.slug}?isFromAdmin=true&token=${token}`}
        />
      )}
    </DrawerWrapper>
  )
}

export default PreviewCourse
