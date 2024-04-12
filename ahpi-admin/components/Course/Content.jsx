/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import AddIcon from "icons/addIcon"
import DeleteIcon from "icons/deleteIcon"
import DownIcon from "icons/downIcon"
import EditIcon from "icons/editIcon"
import PdfIcon from "icons/pdfIcon"
import React from "react"
import useCollapse from "react-collapsed"
import ReactTooltip from "react-tooltip"
import Button from "widgets/button"
import OrbitLink from "widgets/orbitLink"
import RadioButton from "widgets/radioButton"
import ToggleButton from "widgets/toggle"

const CourseContent = ({
  x,
  ind,
  // setOpen2,
  setOpen3,
  setOpen4,
  setOpen5,
  setOpen6,
  setOpen7,
  setSectionTitle,
  setContentIndex,
  setDeleteContent,
  setIndex,
  index,
  showQuestion,
  setDeleteQuestion,
  setDeleteContentQuestion,
}) => {
  const { getCollapseProps, getToggleProps } = useCollapse()
  return (
    <>
      {x?.type === "video" && (
        <div className="bg-white border rounded-lg border-light-gray ">
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg ">
            <div className="w-full" {...getToggleProps()}>
              <h4 className="text-sm font-semibold">Video: {x.title}</h4>
              <p className="text-xs">{x.description}</p>
            </div>
            <div className="flex items-center gap-3">
              <div data-tip="Edit">
                <OrbitLink
                // onClick={() => {
                //   setOpen2(true), setSectionTitle("Edit")
                // }}
                >
                  <div>
                    <EditIcon />
                  </div>
                </OrbitLink>
              </div>
              <ReactTooltip />
              <div data-tip="Delete">
                <OrbitLink
                  onClick={() => {
                    setOpen7(true), setIndex(index), setContentIndex(ind), setDeleteContent(true)
                  }}
                >
                  <div>
                    <DeleteIcon />
                  </div>
                </OrbitLink>
              </div>
              <OrbitLink href="#" {...getToggleProps()}>
                <DownIcon />
              </OrbitLink>
            </div>
            <ReactTooltip />
          </div>
          <div {...getCollapseProps()}>
            <div className="bg-white rounded-b-lg">
              <div className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <iframe
                      src="https://www.youtube.com/embed/IUN664s7N-c"
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="object-cover w-20 h-20 rounded"
                    />
                    <div>
                      <h5 className="text-sm font-semibold">{x.title}</h5>
                      <p className="text-xs">{x.description}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {x?.type === "quiz" && (
        <div className="bg-white border rounded-lg border-light-gray ">
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg ">
            <div className="w-full" {...getToggleProps()}>
              <h4 className="text-sm font-semibold">Quiz: {x.title}</h4>
              <p className="text-xs">{x.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {showQuestion && (
                <Button
                  title="Question"
                  onClick={() => {
                    setOpen4(true), setIndex(index), setContentIndex(ind)
                  }}
                  icon={<AddIcon size="10" />}
                />
              )}
              <div data-tip="Edit">
                <OrbitLink
                  onClick={() => {
                    setOpen3(true), setSectionTitle("Edit")
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
                  onClick={() => {
                    setOpen7(true), setIndex(index), setContentIndex(ind), setDeleteContent(true)
                  }}
                >
                  <div>
                    <DeleteIcon />
                  </div>
                </OrbitLink>
              </div>
              <OrbitLink href="#" {...getToggleProps()}>
                <DownIcon />
              </OrbitLink>
            </div>
            <ReactTooltip />
          </div>
          <div className="bg-white rounded-b-lg" {...getCollapseProps()}>
            <div className="p-4">
              {x.question?.length ? (
                x.question.map((z, index_) => {
                  return (
                    <div
                      className={`flex justify-between py-2 text-xs rounded-lg ${
                        index_ !== 0 ? "border-t border-dashed border-light-gray" : ""
                      }`}
                    >
                      <div>
                        <p>
                          <span className="mr-2 font-semibold">{`Question : ${index_ + 1}`}</span>
                          {z.name}
                        </p>
                        <div className="mt-2">
                          <RadioButton title={z.description} id="ans" defaultChecked />
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <OrbitLink
                          onClick={() => {
                            setOpen4(true), setSectionTitle("Edit")
                          }}
                        >
                          <EditIcon />
                        </OrbitLink>
                        <OrbitLink
                          onClick={() => {
                            setOpen7(true),
                              setIndex(index),
                              setContentIndex(ind),
                              setDeleteQuestion(index_),
                              setDeleteContentQuestion(true)
                          }}
                        >
                          <DeleteIcon />
                        </OrbitLink>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-3 font-bold text-center">NO QUESTIONS FOUND</div>
              )}
            </div>
          </div>
        </div>
      )}
      {x?.type === "text" && (
        <div className="bg-white border rounded-lg border-light-gray ">
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg ">
            <div className="w-full" {...getToggleProps()}>
              <h4 className="text-sm font-semibold">Text: {x.title}</h4>
              <p className="text-xs">{x.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* {showQuestion && (
              <Button title="Question" onClick={() => setOpen4(true)} icon={<AddIcon size="10" />} />
            )} */}
              <div data-tip="Edit">
                <OrbitLink
                  onClick={() => {
                    setOpen5(true), setSectionTitle("Edit")
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
                  onClick={() => {
                    setOpen7(true), setIndex(index), setContentIndex(ind), setDeleteContent(true)
                  }}
                >
                  <div>
                    <DeleteIcon />
                  </div>
                </OrbitLink>
              </div>
              <OrbitLink href="#" {...getToggleProps()}>
                <DownIcon />
              </OrbitLink>
            </div>
            <ReactTooltip />
          </div>
          <div className="bg-white rounded-b-lg" {...getCollapseProps()}>
            <div className="p-4">
              <div className="gap-3 py-2 text-xs">
                <div>
                  <p>
                    Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the
                    industry standard dummy text ever since the 1500s, when an unknown printer took a galley of type and
                    scrambled it to make a type specimen book. It has survived not only five centuries, but also the
                    leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s
                    with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop
                    publishing software like Aldus PageMaker including versions of Lorem Ipsum.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {x?.type === "document" && (
        <div className="bg-white border rounded-lg border-light-gray ">
          <div className="flex items-center justify-between p-3 bg-gray-100 rounded-t-lg ">
            <div className="w-full" {...getToggleProps()}>
              <h4 className="text-sm font-semibold">Document: {x.title}</h4>
              <p className="text-xs">{x.description}</p>
            </div>
            <div className="flex items-center gap-3">
              {/* {showQuestion && (
              <Button title="Question" onClick={() => setOpen4(true)} icon={<AddIcon size="10" />} />
            )} */}
              <div data-tip="Edit">
                <OrbitLink
                  onClick={() => {
                    setOpen6(true), setSectionTitle("Edit")
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
                  onClick={() => {
                    setOpen7(true), setIndex(index), setContentIndex(ind), setDeleteContent(true)
                  }}
                >
                  <div>
                    <DeleteIcon />
                  </div>
                </OrbitLink>
              </div>
              <OrbitLink href="#" {...getToggleProps()}>
                <DownIcon />
              </OrbitLink>
            </div>
            <ReactTooltip />
          </div>
          <div className="bg-white rounded-b-lg" {...getCollapseProps()}>
            <div className="p-4">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-between w-full gap-3">
                  <div className="flex items-center gap-3">
                    <div className="object-cover p-2 border rounded border-light-gray">
                      <PdfIcon size="50" fill="#aaa" />
                    </div>
                    <div>
                      <h5 className="text-sm font-semibold">Document Title</h5>
                      <p className="text-xs">Description</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    Downloadable:
                    <ToggleButton />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default CourseContent
