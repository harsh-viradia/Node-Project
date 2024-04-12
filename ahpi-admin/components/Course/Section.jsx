/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import DeleteModal from "components/DeleteModal"
import AddIcon from "icons/addIcon"
import DeleteIcon from "icons/deleteIcon"
import EditIcon from "icons/editIcon"
import React, { useState } from "react"
import DrawerWrapper from "shared/drawer"
import Toast from "utils/toast"
import Button from "widgets/button"
import Input from "widgets/input"
import OrbitLink from "widgets/orbitLink"
import TextEditor from "widgets/textEditor"

import AddDocument from "./AddDocument"
import AddQuiz from "./AddQuiz"
import AddText from "./AddText"
// import AddVideo from "./AddVideo"
import CourseContent from "./Content"
import QuizQuestion from "./QuizQuestion"

const Section = () => {
  const [open, setOpen] = useState(false)
  // const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [open4, setOpen4] = useState(false)
  const [open5, setOpen5] = useState(false)
  const [open6, setOpen6] = useState(false)
  const [open7, setOpen7] = useState(false)
  const [showQuestion, setShowQuestion] = useState(false)
  const [sectionList, setSectionList] = useState([])
  const [sectionTitle, setSectionTitle] = useState("Add")
  const [indexDetail, setIndex] = useState()
  const [contentIndex, setContentIndex] = useState()
  const [deleteContent, setDeleteContent] = useState(false)
  const [deleteQuestion, setDeleteQuestion] = useState()
  const [deleteContentQuestion, setDeleteContentQuestion] = useState(false)

  const addSection = () => {
    if (sectionTitle === "Add") {
      setSectionList([...sectionList, { name: "Section", description: "this is section number", content: [] }])
      setOpen(false)
      Toast("Section added successfully.")
    } else {
      setOpen(false)
      Toast("Section updated successfully.")
    }
  }

  const editSection = () => {
    setOpen(true)
    setSectionTitle("Edit")
  }

  const handleConfirmation = async () => {
    if (deleteContentQuestion) {
      setSectionList(
        sectionList.map((x, ind) => {
          if (ind === indexDetail) {
            return {
              ...x,
              content: x.content.map((y, index_) => {
                if (index_ === contentIndex) {
                  return {
                    ...y,
                    question: y?.question?.filter((z, indexx) => {
                      return indexx !== deleteQuestion
                    }),
                  }
                }
                return y
              }),
            }
          }
          return x
        })
      )
      Toast("Question deleted successfully.")
    } else if (deleteContent) {
      await setSectionList(
        sectionList.map((x, index) => {
          if (index === indexDetail) {
            return {
              ...x,
              content: x?.content?.filter((y, ind) => {
                return ind !== contentIndex
              }),
            }
          }
          return x
        })
      )
      Toast("Section content deleted successfully.")
    } else {
      await setSectionList(sectionList.filter((x, index) => index !== indexDetail))
      Toast("Section deleted successfully.")
    }
    setIndex()
    setContentIndex()
    setDeleteQuestion()
    setOpen7(false)
    setDeleteContent(false)
    setDeleteContentQuestion(false)
  }

  // const addVideo = () => {
  //   if (sectionTitle === "Add") {
  //     setSectionList(
  //       sectionList?.map((x, index) => {
  //         if (index === indexDetail) {
  //           return {
  //             ...x,
  //             content: [
  //               ...x.content,
  //               {
  //                 type: "video",
  //                 title: `Video-${x.content.length + 1}`,
  //                 description: `this is ${x.content.length + 1} video`,
  //               },
  //             ],
  //           }
  //         }
  //         return x
  //       })
  //     )
  //   }
  //   setOpen2(false)
  //   setIndex()
  //   setSectionTitle("Add")
  // eslint-disable-next-line write-good-comments/write-good-comments
  //   Toast(`Video ${sectionTitle === "Add" ? "added" : "updated"} successfully.`)
  // }

  const addedQuiz = () => {
    if (sectionTitle === "Add") {
      setSectionList(
        sectionList?.map((x, index) => {
          if (index === indexDetail) {
            return {
              ...x,
              content: [
                ...x.content,
                {
                  type: "quiz",
                  title: `Quiz-${x.content.length + 1}`,
                  description: `this is ${x.content.length + 1} quiz`,
                },
              ],
            }
          }
          return x
        })
      )
    }
    setShowQuestion(true)
    setOpen3(false)
    setIndex()
    setSectionTitle("Add")
    Toast(`Quiz ${sectionTitle === "Add" ? "added" : "updated"} successfully.`)
  }

  const addedText = () => {
    if (sectionTitle === "Add") {
      setSectionList(
        sectionList?.map((x, index) => {
          if (index === indexDetail) {
            return {
              ...x,
              content: [
                ...x.content,
                {
                  type: "text",
                  title: `Text-${x.content.length + 1}`,
                  description: `this is ${x.content.length + 1} text`,
                },
              ],
            }
          }
          return x
        })
      )
    }
    setOpen5(false)
    setIndex()
    setSectionTitle("Add")
    Toast(`Text ${sectionTitle === "Add" ? "added" : "updated"} successfully.`)
  }

  const addedDocument = () => {
    if (sectionTitle === "Add") {
      setSectionList(
        sectionList?.map((x, index) => {
          if (index === indexDetail) {
            return {
              ...x,
              content: [
                ...x.content,
                {
                  type: "document",
                  title: `Document-${x.content.length + 1}`,
                  description: `this is ${x.content.length + 1} document`,
                },
              ],
            }
          }
          return x
        })
      )
    }
    setOpen6(false)
    setIndex()
    setSectionTitle("Add")
    Toast(`Document ${sectionTitle === "Add" ? "added" : "updated"} successfully.`)
  }

  const addQuestion = () => {
    if (sectionTitle === "Add") {
      setSectionList(
        sectionList.map((x, ind) => {
          if (ind === indexDetail) {
            return {
              ...x,
              content: x.content.map((y, index_) => {
                if (index_ === contentIndex) {
                  return {
                    ...y,
                    question: [
                      ...(Array.isArray(y.question) ? y.question : []),
                      { name: "This is question", description: "This is question descrition" },
                    ],
                  }
                }
                return y
              }),
            }
          }
          return x
        })
      )
    }
    setOpen4(false)
    setIndex()
    setContentIndex()
    setSectionTitle("Add")
    Toast(`Question ${sectionTitle === "Add" ? "added" : "updated"} successfully.`)
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-end mb-3">
        <Button
          title="Add Section"
          onClick={() => {
            setOpen(true), setSectionTitle("Add")
          }}
        />
      </div>
      {sectionList?.length ? (
        sectionList?.map((item, index) => (
          <div className="p-3 border rounded-lg border-light-gray">
            <div className="flex items-center justify-between">
              <div className="mb-3">
                <h4 className="text-sm font-semibold">{`${item.name} - ${index + 1}`}</h4>
                <p className="text-xs">{`${item.description} ${index + 1}`}</p>
              </div>
              <div className="flex items-center gap-3">
                <OrbitLink href="#" onClick={() => editSection()}>
                  <EditIcon />
                </OrbitLink>
                <OrbitLink
                  href="#"
                  onClick={() => {
                    setOpen7(true), setIndex(index)
                  }}
                >
                  <DeleteIcon />
                </OrbitLink>
              </div>
            </div>
            <div className="grid gap-3">
              {item?.content?.length ? (
                item?.content?.map((x, ind) => (
                  <CourseContent
                    x={x}
                    ind={ind}
                    // setOpen2={setOpen2}
                    setOpen3={setOpen3}
                    setOpen4={setOpen4}
                    setOpen5={setOpen5}
                    setOpen6={setOpen6}
                    setOpen7={setOpen7}
                    setSectionTitle={setSectionTitle}
                    setContentIndex={setContentIndex}
                    setDeleteContent={setDeleteContent}
                    setIndex={setIndex}
                    index={index}
                    showQuestion={showQuestion}
                    setDeleteQuestion={setDeleteQuestion}
                    setDeleteContentQuestion={setDeleteContentQuestion}
                  />
                ))
              ) : (
                <div className="h-40 p-3 pt-16 font-bold text-center border rounded-lg border-light-gray">
                  NO DATA FOUND
                </div>
              )}
              <div className="flex gap-3 pt-3 mt-3 border-t border-light-gray">
                {/* <Button
                  title="Video"
                  icon={<AddIcon size="10" />}
                  onClick={() => {
                    setOpen2(true), setIndex(index)
                  }}
                  outline
                /> */}
                <Button
                  title="Quiz"
                  icon={<AddIcon size="10" />}
                  onClick={() => {
                    setOpen3(true), setIndex(index)
                  }}
                  outline
                />
                <Button
                  title="Text"
                  icon={<AddIcon size="10" />}
                  onClick={() => {
                    setOpen5(true), setIndex(index)
                  }}
                  outline
                />
                <Button
                  title="Document"
                  icon={<AddIcon size="10" />}
                  onClick={() => {
                    setOpen6(true), setIndex(index)
                  }}
                  outline
                />
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="h-40 p-3 font-bold text-center border rounded-lg border-light-gray">NO SECTION FOUND</div>
      )}

      <div className="flex items-center justify-end gap-3 mt-3">
        <Button title="Close" outline className="hover:border-primary" />
        <Button title="Save as Draft" />
        <Button title="Save & Next" kind="dark-gray" hoverKind="white" className="hover:border-primary" />
      </div>
      <DrawerWrapper
        title={`${sectionTitle} Section`}
        modalFooter={
          <>
            <Button title="Close" onClick={() => setOpen(false)} outline />
            <Button title={sectionTitle === "Add" ? sectionTitle : "Update"} onClick={() => addSection()} />{" "}
          </>
        }
        open={open}
        setOpen={setOpen}
      >
        <div className="grid gap-3">
          <Input label="Section Name" placeholder="Enter Section Name" mandatory />
          <TextEditor label="Section Description" mandatory />
        </div>
      </DrawerWrapper>
      {/* <AddVideo
        open={open2}
        setOpen={setOpen2}
        addVideo={addVideo}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
      /> */}
      <AddQuiz
        open={open3}
        setOpen={setOpen3}
        addedQuiz={addedQuiz}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
      />
      <QuizQuestion
        open={open4}
        setOpen={setOpen4}
        addQuestion={addQuestion}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
      />
      <AddText
        open={open5}
        setOpen={setOpen5}
        addedText={addedText}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
      />
      <AddDocument
        open={open6}
        setOpen={setOpen6}
        addedDocument={addedDocument}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
      />
      <DeleteModal
        deleteModal={open7}
        setDeleteModal={setOpen7}
        handleConfirmation={handleConfirmation}
        setIndex={setIndex}
        setContentIndex={setContentIndex}
        setDeleteContent={setDeleteContent}
        setDeleteQuestion={setDeleteQuestion}
        setDeleteContentQuestion={setDeleteContentQuestion}
      />
    </div>
  )
}

export default Section
