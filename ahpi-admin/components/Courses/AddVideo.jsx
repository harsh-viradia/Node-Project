/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import dynamic from "next/dynamic"
import React, { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { videoSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"

import useVideo from "./hooks/useVideo"

const defaultValues = {
  id: undefined,
  desc: undefined,
  vidId: undefined,
  videoProgres: undefined,
}

const VideoUpload = dynamic(() => import("widgets/videoUpload"), {
  ssr: false,
})

const AddVideo = ({
  open,
  setOpen,
  title = "Add",
  setSectionTitle,
  secId,
  getMaterialList,
  editVideoData,
  setEditVideoData,
}) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    watch,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(videoSchema),
  })

  const [videoData, setVideoData] = useState()
  const { addUpdateVideo, loading } = useVideo({
    reset,
    defaultValues,
    setSectionTitle,
    setOpen,
    secId,
    getMaterialList,
  })

  useEffect(() => {
    reset({ ...defaultValues })
    setVideoData()
    if (!open) {
      setEditVideoData()
    }
  }, [open])

  useEffect(() => {
    if (editVideoData) {
      setValue("id", editVideoData?._id)
      setValue("nm", editVideoData?.nm)
      setValue("desc", editVideoData?.desc)
      setValue("vidId", editVideoData?.vidId?._id)
      setVideoData(editVideoData?.vidId?.vidObj)
    }
  }, [editVideoData])

  const closeModal = () => {
    setOpen(false)
    setSectionTitle("Add")
    setEditVideoData()
    setVideoData()
    reset({ ...defaultValues })
  }

  const onKeyDown = (event) => {
    if (event.key === "Enter") {
      handleSubmit(addUpdateVideo)()
    }
  }

  return (
    <DrawerWrapper
      width="max-w-4xl"
      modalFooter={
        <div className="flex gap-3 ">
          <Button
            kind="dark-gray"
            hoverKind="white"
            darkHoverKind="primary"
            title="Close"
            onClick={() => closeModal()}
            disabled={loading}
          />
          <Button
            title={title === "Add" ? `${title} Video` : "Update Video"}
            onClick={handleSubmit(addUpdateVideo)}
            loading={loading}
          />{" "}
        </div>
      }
      title={`${title} Video`}
      open={open}
      setOpen={closeModal}
    >
      <div className="grid gap-4">
        <Input
          label="Title"
          placeholder="Enter Title"
          mandatory
          rest={register("nm")}
          error={errors.nm?.message}
          disabled={loading}
          onKeyDown={onKeyDown}
        />
        <TextEditor
          label="Video Description"
          placeholder="Enter Video Description"
          rest={editVideoData ? watch("desc") : register("desc")}
          setValue={setValue}
          valueText="desc"
          valueData={getValues("desc")}
          error={errors.desc?.message}
        />
        <VideoUpload
          label="Video"
          mandatory
          keyId="vidId"
          fileData={videoData}
          setValue={setValue}
          videoId={watch("vidId")}
          error={getValues("videoProgress") ? "Please wait while video is uploading." : errors.vidId?.message}
        />
      </div>
    </DrawerWrapper>
  )
}

export default AddVideo
