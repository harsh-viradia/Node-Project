/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable no-unused-vars */
/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-param-reassign */
import { yupResolver } from "@hookform/resolvers/yup"
import React, { useState } from "react"
import { useFieldArray, useForm } from "react-hook-form"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import { documentSchema, questionSchema } from "schema/common"
import DrawerWrapper from "shared/drawer"
import { DEFAULT_LIMIT, MODULE_ACTIONS } from "utils/constant"
import Button from "widgets/button"
import OrbitLoader from "widgets/loader"
import NoDataFound from "widgets/noDataFound"

import DocumentBox from "./documentBox"
import useQuestionsAndDocuments from "./hooks/useQuestionAndDocuments"
import QuestionBox from "./questionBox"

const defaultValues = {
  data: [],
}

const ViewDetails = ({ open, setOpen, userDetails, getListData, pagination, isAllow }) => {
  const [tabIndex, setTabIndex] = useState(1)
  const {
    handleSubmit,
    setValue,
    getValues,
    clearErrors,
    control,
    reset,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(questionSchema),
  })

  const {
    handleSubmit: handleSubmit2,
    setValue: setValue2,
    getValues: getValues2,
    control: control2,
    reset: reset2,
    clearErrors: clearErrors2,
    formState: { errors: errors2 = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(documentSchema),
  })

  const { loading, onSubmit, loading2, onSubmit2, updatedBy, setUpdatedBy, setDeletedData, deletedData } =
    useQuestionsAndDocuments({
      setValue,
      reset,
      defaultValues,
      setValue2,
      reset2,
      userDetails,
      open,
      setOpen,
      tabIndex,
      setTabIndex,
      getListData,
      pagination,
      isAllow,
    })

  const changeTab = (tabName) => {
    clearErrors()
    if (tabIndex !== tabName) {
      setTabIndex(tabName)
      setUpdatedBy()
      reset({ ...defaultValues })
      reset2({ ...defaultValues })
    }
  }

  const closeModal = () => {
    setOpen(false)
    clearErrors()
    setTabIndex(1)
    setUpdatedBy()
    reset({ ...defaultValues })
    reset2({ ...defaultValues })
    getListData({ offset: pagination?.offset || 0, limit: pagination?.perPage || DEFAULT_LIMIT })
  }

  return (
    <DrawerWrapper
      title={<>View Details {updatedBy ? <small>(Submitted By: {updatedBy})</small> : ""}</>}
      modalFooter={
        <>
          <Button onClick={() => closeModal()} title="Close" kind="dark-gray" hoverKind="white" />
          {tabIndex === 1
            ? isAllow(MODULE_ACTIONS.SAVEQUESTION) && (
                <Button title="Save" onClick={handleSubmit(onSubmit)} loading={loading2} />
              )
            : isAllow(MODULE_ACTIONS.SAVEDOCUMENT) && (
                <Button title="Save" onClick={handleSubmit2(onSubmit2)} loading={loading2} />
              )}
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      {/* <DetailsView /> */}
      <Tabs>
        <TabList>
          {isAllow(MODULE_ACTIONS.QUESTIONLIST) && <Tab onClick={() => changeTab(1)}>Questions</Tab>}
          {isAllow(MODULE_ACTIONS.DOCUMENTLIST) && <Tab onClick={() => changeTab(2)}>Documents</Tab>}
        </TabList>
        {isAllow(MODULE_ACTIONS.QUESTIONLIST) && (
          <TabPanel>
            {!loading ? (
              getValues("data")?.length ? (
                <QuestionBox
                  control={control}
                  setValue={setValue}
                  errors={errors}
                  useFieldArray={useFieldArray}
                  getValues={getValues}
                  clearErrors={clearErrors}
                />
              ) : (
                <NoDataFound text="No Questions Found." />
              )
            ) : (
              <OrbitLoader />
            )}
          </TabPanel>
        )}
        {isAllow(MODULE_ACTIONS.DOCUMENTLIST) && (
          <TabPanel>
            {!loading ? (
              getValues2("data")?.length ? (
                <DocumentBox
                  control={control2}
                  setValue={setValue2}
                  useFieldArray={useFieldArray}
                  getValues={getValues2}
                  errors={errors2}
                  clearErrors={clearErrors2}
                  userDetails={userDetails}
                  setDeletedData={setDeletedData}
                  deletedData={deletedData}
                />
              ) : (
                <NoDataFound text="No Documents Found." />
              )
            ) : (
              <OrbitLoader />
            )}
          </TabPanel>
        )}
      </Tabs>
    </DrawerWrapper>
  )
}

export default ViewDetails
