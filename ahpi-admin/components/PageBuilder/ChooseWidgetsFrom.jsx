/* eslint-disable no-underscore-dangle */
/* eslint-disable no-shadow */

import commonApi from "api"
import React, { useEffect, useState } from "react"
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd"
import DrawerWrapper from "shared/drawer"
import { DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"
import { debounce } from "utils/util"
import Button from "widgets/button"
import WidgetCard from "widgets/Cards/widgetCard"
import Dropdown from "widgets/dropdown"

const reorder = (list, startIndex, endIndex) => {
  const result = [...list]
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)

  return result
}

const ChooseWidgets = ({ open, setOpen, title = "Add Widget", getList, data = {} }) => {
  const [selectedWidgetList, setSelectedWidgetList] = useState([])
  const [widgets, setWidgets] = useState([])

  const closeModal = () => {
    setOpen(false)
  }

  const onDragEnd = (result) => {
    // dropped outside the list
    if (!result.destination) return
    const items = reorder(selectedWidgetList, result.source.index, result.destination.index)
    setSelectedWidgetList(items)
  }

  const removeWidget = (item) => () => {
    const data = [...selectedWidgetList]
    const newData = data.filter((widget) => widget._id !== item._id)
    setSelectedWidgetList(newData)
  }

  const saveWidget = async () => {
    if (!selectedWidgetList?.length) {
      Toast("Please select widget.", "error")
      return
    }
    const payload = {
      name: data.name,
      slug: data.slug,
      widget: selectedWidgetList.map((ele, index) => {
        return {
          widgetId: ele.value,
          seq: index + 1,
        }
      }),
    }
    const id = data._id
    await commonApi({ action: "updatePageWidget", parameters: [id], data: { ...payload } }).then(
      ([error, { message = "" }]) => {
        // eslint-disable-next-line promise/always-return
        if (error) {
          return false
        }
        getList()
        Toast(message, "success")
        setOpen(false)
        return false
      }
    )
  }

  const getAllWidgets = debounce(async (inputValue, callback) => {
    const payload = {
      query: { searchColumns: ["name", "code"], search: inputValue || undefined },
      options: { page: 1, offset: 0, limit: DEFAULT_LIMIT },
      filter: {
        isActive: true,
      },
    }

    await commonApi({ action: "list", module: "widget", common: true, data: payload }).then(([, { data = {} }]) => {
      const listData = data?.data?.map(({ _id, name }) => ({
        value: _id,
        label: name,
      }))

      if (inputValue) {
        // eslint-disable-next-line promise/no-callback-in-promise
        callback?.(listData)
      } else {
        setWidgets(listData)
      }

      return false
    })
  }, 500)

  useEffect(() => {
    if (data.widget && open) {
      const widget = data?.widget?.map((wid) => {
        return {
          value: wid?.widgetId?._id,
          label: wid?.widgetId?.name,
          ...wid,
        }
      })
      setSelectedWidgetList(widget || [])
      getAllWidgets()
    }
  }, [data, open])

  return (
    <DrawerWrapper
      title={title}
      width="max-w-2xl"
      modalFooter={
        <>
          <Button onClick={closeModal} title="Close" kind="dark-gray" hoverKind="white" />
          <Button title="Save" onClick={saveWidget} />
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="w-full">
          <Dropdown
            defaultOptions={widgets}
            label="Widget"
            placeholder="Widget"
            onChange={setSelectedWidgetList}
            value={selectedWidgetList}
            loadOptions={getAllWidgets}
            load
            isClearable
            isMulti
            mandatory
          />

          <div className="pt-4">
            <Droppable droppableId="droppable">
              {(provided) => (
                <div className="grid gap-y-4" {...provided.droppableProps} ref={provided.innerRef}>
                  {selectedWidgetList?.map((item, index) => (
                    <Draggable key={item.value} draggableId={item.value} index={index}>
                      {(provided) => (
                        <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                          <WidgetCard item={item} remove={removeWidget(item)} position={index} />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        </div>
      </DragDropContext>
    </DrawerWrapper>
  )
}

export default ChooseWidgets
