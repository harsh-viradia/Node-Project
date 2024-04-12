/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable sonarjs/no-identical-functions */
import DeleteModal from "components/DeleteModal"
import AddIcon from "icons/addIcon"
import DeleteIcon from "icons/deleteIcon"
import DocumentIcon from "icons/documentIcon"
import DownIcon from "icons/downIcon"
import DownloadIcon from "icons/downloadIcon"
import EditIcon from "icons/editIcon"
import PdfIcon from "icons/pdfIcon"
import PlayIcon from "icons/playIcon"
import StopWatchIcon from "icons/stopWatchIcon"
import TextIcon from "icons/textIcon"
import dynamic from "next/dynamic"
import React, { useEffect, useState } from "react"
import useCollapse from "react-collapsed"
import ReactHtmlParser from "react-html-parser"
import ReactTooltip from "react-tooltip"
import { checkIOSDevice, MATERIAL_TYPES, MODULE_ACTIONS, QUESTION_TYPE, VIDEO_FILE_STATUS } from "utils/constant"
import Button from "widgets/button"
import Checkbox from "widgets/checkbox"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"
import RadioButton from "widgets/radioButton"
import ToggleButtonSection from "widgets/ToggleButtonSection"

import useDocs from "./hooks/useDocs"
import useQuestion from "./hooks/useQuestion"
import QuizQuestion from "./QuizQuestion"

const VideoPlayer = dynamic(() => import("widgets/Player"), {
  ssr: false,
})

const CourseContent = ({
  ind,
  material,
  handleConfirmation,
  deleteMaterial,
  setDeleteMaterial,
  secId,
  // editVideo,
  editQuiz,
  editText,
  editDocs,
  sectionTitle,
  setSectionTitle,
  materialProvided,
  isAllow,
  setQuizcertificate,
}) => {
  const [isExpanded, setExpanded] = useState(false)
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [editQuestionData, setEditQuestionData] = useState()
  const [deleteOpen, setDeleteOpen] = useState(false)

  const { getCollapseProps, getToggleProps } = useCollapse()
  const { updateCanDownloadToggle } = useDocs({})
  const {
    getQuestionsList,
    questionsList,
    setQuestionList,
    deleteQuestion,
    deleteQuestionData,
    setDeleteQuestionData,
    loading,
    videoStatusData,
    setVideoStatusData,
    getVideoStatus,
  } = useQuestion({
    secId,
    materialId: material?._id,
    setOpen2,
  })

  useEffect(() => {
    if (material?.type === MATERIAL_TYPES.VIDEO) {
      if (isExpanded) {
        getVideoStatus(material?.vidId?._id)
      } else setVideoStatusData()
    }

    if (material?.type === MATERIAL_TYPES.QUIZ || material?.type === MATERIAL_TYPES.QUIZ_CERTIFICATE) {
      if (isExpanded && isAllow(MODULE_ACTIONS.GETALLQUESTIONS)) {
        getQuestionsList()
      } else {
        setQuestionList([])
      }
    }
  }, [isExpanded])

  const editQuestion = (z) => {
    setOpen(true)
    setSectionTitle("Update")
    setEditQuestionData(z)
  }

  return (
    <div className="grid gap-3">
      {material?.type === MATERIAL_TYPES.VIDEO && (
        <div className="bg-white border rounded-lg border-light-gray overflow-hidden">
          <div
            {...materialProvided.dragHandleProps}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg"
          >
            <div
              className="flex items-start gap-2 w-full"
              {...getToggleProps({
                onClick: () => setExpanded((previousExpanded) => !previousExpanded),
              })}
            >
              <div className="flex w-6 mt-2 flex-col items-center gap-0.5">
                <PlayIcon size="24px" className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">
                  {ind + 1}. {material.nm}
                </h4>
                <p className="text-xs">{ReactHtmlParser(material.desc)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAllow(MODULE_ACTIONS.UPDATEMATERIALS) && (
                <div data-tip="Edit">
                  <OrbitLink onClick={() => editVideo(material)}>
                    <div>
                      <EditIcon />
                    </div>
                  </OrbitLink>
                </div>
              )}
              <ReactTooltip />
              {isAllow(MODULE_ACTIONS.DELETEMATERIALS) && (
                <div data-tip="Delete">
                  <OrbitLink
                    className="text-red"
                    onClick={() => {
                      setDeleteOpen(true), setDeleteMaterial({ id: material?._id, name: material?.nm, secId })
                    }}
                  >
                    <div>
                      <DeleteIcon />
                    </div>
                  </OrbitLink>
                </div>
              )}
              <OrbitLink
                {...getToggleProps({
                  onClick: () => setExpanded((previousExpanded) => !previousExpanded),
                })}
              >
                <DownIcon className={isExpanded ? "rotate-180" : ""} />
              </OrbitLink>
            </div>
            <ReactTooltip />
          </div>
          <div {...getCollapseProps()}>
            <div className="bg-white rounded-b-lg">
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="group w-full min-h-full p-2 border rounded-lg border-light-gray relative">
                    {videoStatusData?.vidObj?.status === VIDEO_FILE_STATUS.UPLOADED ? (
                      <div>
                        <VideoPlayer
                          src={checkIOSDevice() ? videoStatusData?.vidObj?.hslUrl : videoStatusData?.vidObj?.mpdUrl}
                        />
                      </div>
                    ) : (
                      <div className="object-cover bg-light-gray flex items-center justify-center w-full rounded h-52">
                        {videoStatusData?.vidObj?.status === VIDEO_FILE_STATUS.FAILED ? (
                          <div className="flex flex-col gap-1 text-center">
                            <span>Video streaming is failed.</span>
                          </div>
                        ) : (
                          <div className="flex flex-col gap-1 text-center">
                            <span>Video streaming is in progress...</span>
                            <p className="text-xs text-gray-500">
                              Please reload page after sometime and check video status.
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {material?.type === MATERIAL_TYPES.QUIZ && (
        <div className="bg-white border rounded-lg border-light-gray overflow-hidden">
          <div
            {...materialProvided.dragHandleProps}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg"
          >
            <div
              className="flex items-start gap-2 w-full"
              {...getToggleProps({
                onClick: () => setExpanded((previousExpanded) => !previousExpanded),
                disabled: !isAllow(MODULE_ACTIONS.GETALLQUESTIONS),
              })}
            >
              <div className="flex w-6 mt-2 flex-col items-center gap-0.5">
                <StopWatchIcon size="24px" className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">
                  {ind + 1}. {material.nm}
                </h4>
                <p className="text-xs">{ReactHtmlParser(material.desc)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAllow(MODULE_ACTIONS.CREATEQUESTIONS) && (
                <Button
                  title="Question"
                  onClick={() => {
                    setOpen(true)
                    setQuizcertificate(false)
                  }}
                  icon={<AddIcon />}
                />
              )}
              {isAllow(MODULE_ACTIONS.UPDATEMATERIALS) && (
                <div data-tip="Edit">
                  <OrbitLink onClick={() => editQuiz(material)}>
                    <div>
                      <EditIcon />
                    </div>
                  </OrbitLink>
                </div>
              )}
              <ReactTooltip />
              {isAllow(MODULE_ACTIONS.DELETEMATERIALS) && (
                <div data-tip="Delete">
                  <OrbitLink
                    className="text-red"
                    onClick={() => {
                      setDeleteOpen(true), setDeleteMaterial({ id: material?._id, name: material?.nm, secId })
                    }}
                  >
                    <DeleteIcon />
                  </OrbitLink>
                </div>
              )}
              {isAllow(MODULE_ACTIONS.GETALLQUESTIONS) && (
                <OrbitLink
                  {...getToggleProps({
                    onClick: () => setExpanded((previousExpanded) => !previousExpanded),
                  })}
                >
                  <DownIcon className={isExpanded ? "rotate-180" : ""} />
                </OrbitLink>
              )}
            </div>
            <ReactTooltip />
          </div>
          <div className="bg-white rounded-b-lg" {...getCollapseProps()}>
            <div className="p-4 relative">
              {loading && <OrbitLoader relative />}
              {questionsList?.length ? (
                questionsList.map((z, index) => {
                  return (
                    <div className="flex justify-between py-2 text-xs rounded-lg border-t border-dashed border-light-gray">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mr-2 font-semibold flex-nowrap">Question : {index + 1}</span>
                          <div className="quizMaz-img">{ReactHtmlParser(z.ques)}</div>
                        </div>
                        <div className="mt-2">
                          {z?.opts
                            ?.filter((x) => x.isAnswer)
                            ?.map((y) => (
                              <div className="quizMaz-img ">
                                {z.queType.name === QUESTION_TYPE.MCQ ? (
                                  <RadioButton title={ReactHtmlParser(y.nm)} id="ans" defaultChecked />
                                ) : (
                                  <Checkbox
                                    className="mb-2"
                                    id="mcq1"
                                    name="mcq"
                                    checked
                                    title={<div>{ReactHtmlParser(y.nm)}</div>}
                                  />
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isAllow(MODULE_ACTIONS.UPDATEQUESTIONS) && (
                          <OrbitLink onClick={() => editQuestion(z)}>
                            <EditIcon />
                          </OrbitLink>
                        )}
                        {isAllow(MODULE_ACTIONS.DELETEQUESTIONS) && (
                          <OrbitLink
                            className="text-red"
                            onClick={() => {
                              setOpen2(true), setDeleteQuestionData({ id: z?._id, name: `Question : ${index + 1}` })
                            }}
                          >
                            <DeleteIcon />
                          </OrbitLink>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div>
                  {!loading ? (
                    <div className="p-3 font-bold text-center">NO QUESTIONS FOUND</div>
                  ) : (
                    <div className="h-20" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {material?.type === MATERIAL_TYPES.TEXT && (
        <div className="bg-white border rounded-lg border-light-gray overflow-hidden">
          <div
            {...materialProvided.dragHandleProps}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg "
          >
            <div
              className="flex items-start gap-2 w-full"
              {...getToggleProps({
                onClick: () => setExpanded((previousExpanded) => !previousExpanded),
              })}
            >
              <div className="flex w-6 mt-2 flex-col items-center gap-0.5">
                <TextIcon size="24px" className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold ">
                  {ind + 1}. {material.nm}
                </h4>
                <p className="quizMaz-img text-xs">{ReactHtmlParser(material.desc)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div data-tip="Edit">
                <OrbitLink onClick={() => editText(material)}>
                  <div>
                    <EditIcon />
                  </div>
                </OrbitLink>
              </div>
              <ReactTooltip />
              <div data-tip="Delete">
                <OrbitLink
                  className="text-red"
                  onClick={() => {
                    setDeleteOpen(true), setDeleteMaterial({ id: material?._id, name: material?.nm, secId })
                  }}
                >
                  <div>
                    <DeleteIcon />
                  </div>
                </OrbitLink>
              </div>
              <OrbitLink
                {...getToggleProps({
                  onClick: () => setExpanded((previousExpanded) => !previousExpanded),
                })}
              >
                <DownIcon className={isExpanded ? "rotate-180" : ""} />
              </OrbitLink>
            </div>
            <ReactTooltip />
          </div>
          <div className="bg-white rounded-b-lg" {...getCollapseProps()}>
            <div className="p-4">
              <div className="gap-3 py-2 text-xs">
                <div>
                  <p>{ReactHtmlParser(material.text)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {material?.type === MATERIAL_TYPES.DOCS && (
        <div className="bg-white border rounded-lg border-light-gray overflow-hidden">
          <div
            {...materialProvided.dragHandleProps}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg "
          >
            <div
              className="flex items-start gap-2 w-full"
              {...getToggleProps({
                onClick: () => setExpanded((previousExpanded) => !previousExpanded),
              })}
            >
              <div className="flex w-6 mt-2 flex-col items-center gap-0.5">
                <DocumentIcon size="24px" className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">
                  {ind + 1}. {material.nm}
                </h4>
                <p className="text-xs">{ReactHtmlParser(material.desc)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div data-tip="Edit">
                <OrbitLink
                  onClick={() => {
                    editDocs(material)
                  }}
                >
                  <div>
                    <EditIcon />
                  </div>
                </OrbitLink>
              </div>
              <ReactTooltip />
              <div data-tip="Delete">
                <OrbitLink
                  className="text-red"
                  onClick={() => {
                    setDeleteOpen(true), setDeleteMaterial({ id: material?._id, name: material?.nm, secId })
                  }}
                >
                  <div>
                    <DeleteIcon />
                  </div>
                </OrbitLink>
              </div>
              <OrbitLink
                {...getToggleProps({
                  onClick: () => setExpanded((previousExpanded) => !previousExpanded),
                })}
              >
                <DownIcon className={isExpanded ? "rotate-180" : ""} />
              </OrbitLink>
            </div>
            <ReactTooltip />
          </div>
          <div className="bg-white rounded-b-lg" {...getCollapseProps()}>
            <div className="p-4 rounded-lg text-xs flex justify-between items-center">
              <div className="flex items-center justify-center gap-3">
                <PdfIcon />
                <p className="break-all cursor-pointer text-sm font-medium">
                  <span className="hover:opacity-70">{material.docId?.oriNm}</span>
                </p>
              </div>
              <div className="flex items-center justify-center gap-3 ml-3">
                <a download href={material.docId?.uri} target="_blank" rel="noreferrer">
                  <span data-tip="Click To View">
                    <DownloadIcon fill="#2697FF" />
                  </span>
                </a>
                <div className="flex items-center gap-3 text-sm">
                  Downloadable:
                  <ToggleButtonSection
                    defaultChecked={material.canDownload}
                    onChange={(e) => updateCanDownloadToggle(material, e.target.checked)}
                    name={ind}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {material?.type === MATERIAL_TYPES.QUIZ_CERTIFICATE && (
        <div className="bg-white border rounded-lg border-light-gray overflow-hidden">
          <div
            {...materialProvided.dragHandleProps}
            className="flex items-center justify-between p-3 bg-gray-50 rounded-t-lg"
          >
            <div
              className="flex items-start gap-2 w-full"
              {...getToggleProps({
                onClick: () => setExpanded((previousExpanded) => !previousExpanded),
                disabled: !isAllow(MODULE_ACTIONS.GETALLQUESTIONS),
              })}
            >
              <div className="flex w-6 mt-2 flex-col items-center gap-0.5">
                <StopWatchIcon size="24px" className="text-primary" />
              </div>
              <div>
                <h4 className="text-sm font-semibold">
                  {ind + 1}. {material.nm}
                </h4>
                <p className="text-xs">{ReactHtmlParser(material.desc)}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {isAllow(MODULE_ACTIONS.CREATEQUESTIONS) && (
                <Button
                  title="Question"
                  onClick={() => {
                    setOpen(true)
                  }}
                  icon={<AddIcon />}
                />
              )}
              {isAllow(MODULE_ACTIONS.UPDATEMATERIALS) && (
                <div data-tip="Edit">
                  <OrbitLink
                    onClick={() => {
                      editQuiz(material)
                      setQuizcertificate(true)
                    }}
                  >
                    <div>
                      <EditIcon />
                    </div>
                  </OrbitLink>
                </div>
              )}
              <ReactTooltip />
              {isAllow(MODULE_ACTIONS.DELETEMATERIALS) && (
                <div data-tip="Delete">
                  <OrbitLink
                    className="text-red"
                    onClick={() => {
                      setDeleteOpen(true), setDeleteMaterial({ id: material?._id, name: material?.nm, secId })
                    }}
                  >
                    <DeleteIcon />
                  </OrbitLink>
                </div>
              )}
              {isAllow(MODULE_ACTIONS.GETALLQUESTIONS) && (
                <OrbitLink
                  {...getToggleProps({
                    onClick: () => setExpanded((previousExpanded) => !previousExpanded),
                  })}
                >
                  <DownIcon className={isExpanded ? "rotate-180" : ""} />
                </OrbitLink>
              )}
            </div>
            <ReactTooltip />
          </div>
          <div className="bg-white rounded-b-lg" {...getCollapseProps()}>
            <div className="p-4 relative">
              {loading && <OrbitLoader relative />}
              {questionsList?.length ? (
                questionsList.map((z, index) => {
                  return (
                    <div className="flex justify-between py-2 text-xs rounded-lg border-t border-dashed border-light-gray">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="mr-2 font-semibold flex-nowrap">Question : {index + 1}</span>
                          <div className="quizMaz-img">{ReactHtmlParser(z.ques)}</div>
                        </div>
                        <div className="mt-2">
                          {z?.opts
                            ?.filter((x) => x.isAnswer)
                            ?.map((y) => (
                              <div className="quizMaz-img ">
                                {z.queType.name === QUESTION_TYPE.MCQ ? (
                                  <RadioButton title={ReactHtmlParser(y.nm)} id="ans" defaultChecked />
                                ) : (
                                  <Checkbox
                                    className="mb-2"
                                    id="mcq1"
                                    name="mcq"
                                    checked
                                    title={<div>{ReactHtmlParser(y.nm)}</div>}
                                  />
                                )}
                              </div>
                            ))}
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        {isAllow(MODULE_ACTIONS.UPDATEQUESTIONS) && (
                          <OrbitLink onClick={() => editQuestion(z)}>
                            <EditIcon />
                          </OrbitLink>
                        )}
                        {isAllow(MODULE_ACTIONS.DELETEQUESTIONS) && (
                          <OrbitLink
                            className="text-red"
                            onClick={() => {
                              setOpen2(true), setDeleteQuestionData({ id: z?._id, name: `Question : ${index + 1}` })
                            }}
                          >
                            <DeleteIcon />
                          </OrbitLink>
                        )}
                      </div>
                    </div>
                  )
                })
              ) : (
                <div>
                  {!loading ? (
                    <div className="p-3 font-bold text-center">NO QUESTIONS FOUND</div>
                  ) : (
                    <div className="h-20" />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      <QuizQuestion
        open={open}
        setOpen={setOpen}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
        secId={secId}
        quizId={material?._id}
        getQuestionList={getQuestionsList}
        editQuestionData={editQuestionData}
        setEditQuestionData={setEditQuestionData}
        isAllow={isAllow}
      />
      <DeleteModal
        deleteModal={open2}
        setDeleteModal={setOpen2}
        handleConfirmation={deleteQuestion}
        itemName={deleteQuestionData?.name}
      />
      <DeleteModal
        deleteModal={deleteOpen}
        setDeleteModal={setDeleteOpen}
        handleConfirmation={() => {
          setDeleteOpen(false), handleConfirmation()
        }}
        itemName={`${deleteMaterial?.name}`}
      />
    </div>
  )
}

export default CourseContent
