/* eslint-disable no-underscore-dangle */
import { yupResolver } from "@hookform/resolvers/yup"
import useSeoManage from "hook/category/useSeoManage"
import React, { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { SeoSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import Input from "widgets/input"
import OrbitLoader from "widgets/loader"
import Textarea from "widgets/textarea"
import Upload from "widgets/upload"

const defaultValues = {
  metaTitle: undefined,
  metaDesc: undefined,
  keyWords: undefined,
  script: undefined,
  ogTitle: undefined,
  ogDesc: undefined,
  entityNm: undefined,
  entityId: undefined,
  author: undefined,
  imgId: undefined,
}

const SeoManageForm = ({ open, setOpen, title = "SEO Management", categoryDetail, module, permission }) => {
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors = {} },
  } = useForm({
    mode: "onTouched",
    defaultValues,
    resolver: yupResolver(SeoSchema),
  })

  const { selectedImage, setSelectedImage, onSubmit, closeModal, seoData, loading, setIndex, index, hasPermissions } =
    useSeoManage({
      reset,
      defaultValues,
      open,
      setOpen,
      categoryDetail,
      module,
      permission,
    })

  useEffect(() => {
    if (seoData) {
      setValue("metaTitle", seoData?.metaTitle)
      setValue("metaDesc", seoData?.metaDesc)
      setValue("keyWords", seoData?.keyWords)
      setValue("script", seoData?.script)
      setValue("ogTitle", seoData?.ogTitle)
      setValue("ogDesc", seoData?.ogDesc)
      setValue("author", seoData?.author)
      setValue("imgId", seoData?.imgId?._id)
      if (seoData?.imgId?._id) setSelectedImage({ ...seoData?.imgId, id: seoData?.imgId?._id })
    }
  }, [seoData])

  const submitData = () => {
    if (!getValues("metaTitle") || !getValues("metaDesc")) {
      setIndex(0)
    }
    handleSubmit(onSubmit)()
  }

  return (
    <DrawerWrapper
      title={title}
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
          {hasPermissions && <Button title="Save Changes" onClick={submitData} />}
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      {loading && <OrbitLoader relative />}
      <Tabs selectedIndex={index} onSelect={setIndex}>
        <TabList>
          <Tab>Basic</Tab>
          <Tab>Open Graph</Tab>
          <Tab>Header</Tab>
        </TabList>

        <TabPanel>
          <div className="grid gap-3">
            <Input
              label="Meta Title"
              placeholder="Enter Meta Title"
              mandatory
              rest={register("metaTitle")}
              error={errors.metaTitle?.message}
              disabled={!hasPermissions}
            />
            <Input
              label="Meta Description"
              placeholder="Enter Meta Description"
              mandatory
              rest={register("metaDesc")}
              error={errors.metaDesc?.message}
              disabled={!hasPermissions}
            />
            <Input
              label="Keywords"
              placeholder="Enter Keywords"
              rest={register("keyWords")}
              disabled={!hasPermissions}
            />
            <Input
              label="Author"
              placeholder="Enter Author Name"
              rest={register("author")}
              disabled={!hasPermissions}
            />

            <Upload
              label="Image Upload"
              selectedImg={selectedImage}
              setImg={(data) => {
                setValue("imgId", data?.id ? data?.id : "", { shouldValidate: true })
                setSelectedImage(data)
              }}
              resolution="400px/100px"
              disabled={!hasPermissions}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid gap-3">
            <Input disabled={!hasPermissions} label="Title" placeholder="Enter Title" rest={register("ogTitle")} />
            <Input
              disabled={!hasPermissions}
              label="Description"
              placeholder="Enter Description"
              rest={register("ogDesc")}
            />
          </div>
        </TabPanel>
        <TabPanel>
          <div className="grid gap-3">
            <Textarea
              disabled={!hasPermissions}
              label="Add Script"
              valueText="script"
              rest={register("script")}
              setValue={setValue}
            />
          </div>
        </TabPanel>
      </Tabs>
    </DrawerWrapper>
  )
}

export default SeoManageForm
