/* eslint-disable no-shadow */
/* eslint-disable no-underscore-dangle */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable jsx-a11y/label-has-associated-control */
import { yupResolver } from "@hookform/resolvers/yup"
import DeleteModal from "components/DeleteModal"
import { useRouter } from "next/router"
import React, { useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import { useForm } from "react-hook-form"
import { sectionSchema } from "schema/common"
import { MODULE_ACTIONS } from "utils/constant"
import routes from "utils/routes"
import Button from "widgets/button"
import OrbitLoader from "widgets/loader"

import AddSection from "./AddSection"
import useSection from "./hooks/useSection"
import SectionContent from "./SectionContent"

const defaultValues = {
  id: undefined,
  nm: undefined,
  desc: undefined,
}

const Section = ({ pricing, isAllow }) => {
  const router = useRouter()
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    reset,
    formState: { errors = {} },
  } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues,
    resolver: yupResolver(sectionSchema),
  })

  const [open, setOpen] = useState(false)
  const [open7, setOpen7] = useState(false)
  const [sectionTitle, setSectionTitle] = useState("Add")

  const {
    list,
    addUpdateSection,
    handleConfirmation,
    deleteItemDetail,
    setDeleteItemDetail,
    loading,
    loading2,
    onDragEnd,
  } = useSection({
    setOpen,
    reset,
    defaultValues,
    setOpen7,
    setSectionTitle,
    isAllow,
  })
  const editSection = (item) => {
    setOpen(true)
    setSectionTitle("Update")
    setValue("nm", item.nm)
    setValue("desc", item.desc)
    setValue("id", item._id)
  }

  return (
    <div className="mt-8">
      <div className="flex items-center justify-end">
        {isAllow(MODULE_ACTIONS.CREATESECTIONS) && (
          <Button
            title="Add Section"
            onClick={() => {
              setOpen(true), setSectionTitle("Add"), reset({ ...defaultValues })
            }}
          />
        )}
      </div>
      {isAllow(MODULE_ACTIONS.GETALLSECTIONS) && (
        <DragDropContext onDragEnd={onDragEnd}>
          <Droppable droppableId="droppable">
            {(provided) => (
              <div
                {...provided.droppableProps}
                ref={isAllow(MODULE_ACTIONS.UPDATESEQUENCESECTIONS) ? provided.innerRef : undefined}
              >
                {list?.length ? (
                  list?.map((item, index) => (
                    <Draggable key={item._id} draggableId={item._id} index={item.seq}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps}>
                          <SectionContent
                            index={index}
                            item={item}
                            sectionProvided={provided}
                            editSection={editSection}
                            setOpen7={setOpen7}
                            setDeleteItemDetail={setDeleteItemDetail}
                            setSectionTitle={setSectionTitle}
                            sectionTitle={sectionTitle}
                            isAllow={isAllow}
                          />{" "}
                        </div>
                      )}
                    </Draggable>
                  ))
                ) : (
                  <div className="flex items-center justify-center h-40 p-3 font-bold text-center border rounded-lg border-light-gray mt-4">
                    NO SECTION FOUND
                  </div>
                )}

                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
      {loading && <OrbitLoader relative />}
      <div className="flex items-center justify-end gap-3 mt-3">
        <Button
          title="Close"
          outline
          className="hover:border-primary"
          disabled={loading}
          onClick={() =>
            router.push({
              pathname: routes.course,
              query: { limit: router?.query?.limit, offset: router?.query?.offset },
            })
          }
        />
        {isAllow(MODULE_ACTIONS.CREATESECTIONS) ||
        isAllow(MODULE_ACTIONS.UPDATESECTIONS) ||
        isAllow(MODULE_ACTIONS.GETALLSECTIONS) ? (
          isAllow(MODULE_ACTIONS.ADDPRICE) ? (
            <Button
              title={
                isAllow(MODULE_ACTIONS.ADDPRICE)
                  ? isAllow(MODULE_ACTIONS.GETALLSECTIONS)
                    ? "Next"
                    : `Save & Next`
                  : "Save as Draft"
              }
              kind="dark-gray"
              hoverKind="white"
              className="hover:border-primary"
              onClick={() =>
                isAllow(MODULE_ACTIONS.ADDPRICE)
                  ? pricing()
                  : router.push({
                      pathname: routes.course,
                      query: { limit: router?.query?.limit, offset: router?.query?.offset },
                    })
              }
              loading={loading}
            />
          ) : (
            ""
          )
        ) : (
          ""
        )}

        {/* <Button
          title="Save as Draft"
          onClick={() => saveAsDraft()}
          loading={loading4}
          disabled={loading3 || loading4}
        />
        <Button
          onClick={() => publishNow()}
          title="Publish Now"
          kind="dark-gray"
          hoverKind="white"
          className="hover:border-primary"
          loading={loading3}
          disabled={loading3 || loading4}
        /> */}
      </div>
      <AddSection
        open={open}
        setOpen={setOpen}
        addUpdateSection={addUpdateSection}
        register={register}
        errors={errors}
        handleSubmit={handleSubmit}
        setValue={setValue}
        getValues={getValues}
        reset={reset}
        defaultValues={defaultValues}
        title={sectionTitle}
        setSectionTitle={setSectionTitle}
        loading2={loading2}
      />
      <DeleteModal
        deleteModal={open7}
        setDeleteModal={setOpen7}
        handleConfirmation={handleConfirmation}
        itemName={deleteItemDetail?.name}
      />
    </div>
  )
}

export default Section
