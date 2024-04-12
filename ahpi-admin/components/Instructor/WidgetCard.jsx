import DeleteIcon from "icons/deleteIcon"
import React from "react"
import Button from "widgets/button"

const WidgetCard = ({ path, title, subTitle }) => {
  return (
    <div className="p-4 mb-2 transition-all bg-white border rounded-lg cursor-pointer border-light-gray hover:border-primary">
      <div className="flex items-center justify-between">
        <div>
          <div className="flex w-full gap-4">
            <h3 className="text-lg font-medium leading-6 text-primary">{title}</h3>
            <p className="mt-1 text-sm text-gray">{subTitle}</p>
          </div>
          <div className="flex w-full gap-4">
            <p className="mt-1 text-sm">{path}</p>
          </div>
        </div>
        <Button
          title={<DeleteIcon size="16" />}
          className="pt-3 pb-3 pl-3 pr-3 border border-transparent bg-red/10 hover:border-red"
          darkHoverKind="red/10"
        />
      </div>
    </div>
  )
}

export default WidgetCard
