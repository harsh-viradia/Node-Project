/* eslint-disable no-shadow */
/* eslint-disable no-undef */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import AddIcon from "icons/addIcon"
import DeleteIcon from "icons/deleteIcon"
import DownIcon from "icons/downIcon"
import EditIcon from "icons/editIcon"
import React, { useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import useCollapse from "react-collapsed"
import ReactHtmlParser from "react-html-parser"
import { MODULE_ACTIONS } from "utils/constant"
import Button from "widgets/button"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"

import AddDocument from "./AddDocument"
import AddQuiz from "./AddQuiz"
import AddText from "./AddText"
// import AddVideo from "./AddVideo"
import CourseContent from "./Content"
import useMaterial from "./hooks/useMaterial"

const SectionContent = ({
  index,
  item = {},
  editSection,
  setOpen7,
  setDeleteItemDetail,
  setSectionTitle,
  sectionTitle,
  sectionProvided,
  isAllow,
}) => {
  const [open, setOpen] = useState(false)
  // const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [open4, setOpen4] = useState(false)
  const [isExpanded, setExpanded] = useState(false)
  // const [editVideoData, setEditVideoData] = useState()
  const [editQuizData, setEditQuizData] = useState()
  const [editTextData, setEditTextData] = useState()
  const [editDocsData, setEditDocsData] = useState()
  const [quizCertificate, setQuizcertificate] = useState(false)
  const { getCollapseProps, getToggleProps } = useCollapse()

  const {
    getMaterialList,
    materialList,
    handleConfirmation,
    deleteMaterial,
    setDeleteMaterial,
    setMaterialList,
    loading2,
    onDragEnd,
  } = useMaterial({ secId: item._id, isAllow })

  useEffect(() => {
    if (isExpanded && isAllow(MODULE_ACTIONS.GETALLMATERIALS)) {
      getMaterialList(item._id)
    } else {
      setMaterialList([])
    }
  }, [isExpanded])

  const editQuiz = async (materialData) => {
    await setOpen(true)
    await setSectionTitle("Update")
    setEditQuizData(materialData)
  }

  // const editVideo = async (materialData) => {
  //   await setOpen2(true)
  //   await setSectionTitle("Update")
  //   setEditVideoData(materialData)
  // }

  const editText = async (materialData) => {
    await setOpen3(true)
    await setSectionTitle("Update")
    setEditTextData(materialData)
  }
  const editDocs = async (materialData) => {
    await setOpen4(true)
    await setSectionTitle("Update")
    setEditDocsData(materialData)
  }

  return (
    <div className="border rounded-lg border-light-gray mt-4 overflow-hidden">
      <div {...sectionProvided.dragHandleProps} className="bg-gray-100 p-3 flex items-center gap-2 justify-between">
        <div
          className="w-full questionImg"
          {...getToggleProps({
            onClick: () => setExpanded((previousExpanded) => !previousExpanded),
            disabled: !isAllow(MODULE_ACTIONS.CREATEMATERIALS) && !isAllow(MODULE_ACTIONS.GETALLMATERIALS),
          })}
        >
          <h4 className="text-md font-semibold">
            {index + 1}. {item.nm}
          </h4>
          <p className="text-xs line-clamp-2">{ReactHtmlParser(item.desc)}</p>
        </div>
        <div className="flex items-center gap-3">
          {isAllow(MODULE_ACTIONS.UPDATESECTIONS) && (
            <OrbitLink onClick={() => editSection(item)}>
              <EditIcon />
            </OrbitLink>
          )}
          {isAllow(MODULE_ACTIONS.DELETESECTIONS) && (
            <OrbitLink
              onClick={() => {
                setOpen7(true), setDeleteItemDetail({ id: item._id, name: item.nm })
              }}
            >
              <DeleteIcon className="text-red" />
            </OrbitLink>
          )}
          {(isAllow(MODULE_ACTIONS.CREATEMATERIALS) || isAllow(MODULE_ACTIONS.GETALLMATERIALS)) && (
            <OrbitLink
              {...getToggleProps({
                onClick: () => setExpanded((previousExpanded) => !previousExpanded),
              })}
            >
              <DownIcon className={isExpanded ? "rotate-180" : ""} />
            </OrbitLink>
          )}
        </div>
      </div>
      <div {...getCollapseProps()}>
        <div className="p-3 border-t border-light-gray relative">
          {loading2 && <OrbitLoader relative />}
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="materialDroppable">
              {(provided) => (
                <div
                  className=" grid gap-3"
                  {...provided.droppableProps}
                  ref={isAllow(MODULE_ACTIONS.UPDATESEQUENCESECTIONS) ? provided.innerRef : undefined}
                >
                  {materialList?.length ? (
                    materialList?.map((material, index) => (
                      <Draggable key={material?._id} draggableId={material?._id} index={material?.seq}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps}>
                            <CourseContent
                              ind={index}
                              material={material}
                              handleConfirmation={handleConfirmation}
                              deleteMaterial={deleteMaterial}
                              setDeleteMaterial={setDeleteMaterial}
                              secId={item?._id}
                              materialProvided={provided}
                              // editVideo={editVideo}
                              editQuiz={editQuiz}
                              editText={editText}
                              editDocs={editDocs}
                              sectionTitle={sectionTitle}
                              setSectionTitle={setSectionTitle}
                              isAllow={isAllow}
                              setQuizcertificate={setQuizcertificate}
                            />{" "}
                          </div>
                        )}
                      </Draggable>
                    ))
                  ) : (
                    <div>
                      {!loading2 ? (
                        <div className="h-20 p-3 pt-8 font-bold text-center">NO MATERIAL FOUND</div>
                      ) : (
                        <div className="h-20" />
                      )}
                    </div>
                  )}

                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
        {isAllow(MODULE_ACTIONS.CREATEMATERIALS) && (
          <div className="flex gap-3 p-3 border-t border-light-gray">
            {/* <Button title="Video" icon={<AddIcon size="12px" />} onClick={() => setOpen2(true)} outline /> */}
            <Button
              title="Quiz"
              icon={<AddIcon size="12px" />}
              onClick={() => {
                setOpen(true)
                setQuizcertificate(false)
              }}
              outline
            />
            <Button
              title="GATE Quiz"
              icon={<AddIcon size="12px" />}
              onClick={() => {
                setOpen(true)
                setQuizcertificate(true)
              }}
              outline
            />
            <Button title="Text" icon={<AddIcon size="12px" />} onClick={() => setOpen3(true)} outline />
            <Button title="Document" icon={<AddIcon size="12px" />} onClick={() => setOpen4(true)} outline />
          </div>
        )}
      </div>
      {/* <AddVideo
        open={open2}
        setOpen={setOpen2}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
        secId={item?._id}
        getMaterialList={getMaterialList}
        editVideoData={editVideoData}
        setEditVideoData={setEditVideoData}
      /> */}
      <AddQuiz
        open={open}
        setOpen={setOpen}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
        secId={item?._id}
        getMaterialList={getMaterialList}
        editQuizData={editQuizData}
        setEditQuizData={setEditQuizData}
        quizCertificate={quizCertificate}
      />
      <AddText
        open={open3}
        setOpen={setOpen3}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
        secId={item?._id}
        getMaterialList={getMaterialList}
        editTextData={editTextData}
        setEditTextData={setEditTextData}
      />
      <AddDocument
        open={open4}
        setOpen={setOpen4}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
        secId={item?._id}
        getMaterialList={getMaterialList}
        editDocsData={editDocsData}
        setEditDocsData={setEditDocsData}
      />
    </div>
  )
}

export default SectionContent
