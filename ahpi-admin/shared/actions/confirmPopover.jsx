/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable react/no-unstable-nested-components */
import React, { useState } from "react"
import { Popover } from "react-tiny-popover"
import Button from "widgets/button"

const ConfirmPopOver = ({ children, onConfirm, position = "left" }) => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  return (
    <Popover
      containerClassName="relative bg-white px-4 py-2.5 z-[9999] border border-gray rounded shadow-lg"
      isOpen={isPopoverOpen}
      positions={[position]}
      padding={10}
      reposition={false}
      onClickOutside={() => setIsPopoverOpen(false)}
      content={() => (
        <div className="grid grid-cols-1 gap-1.5">
          <div className="font-bold"> Are you sure to delete? </div>
          <div className="flex justify-center">
            {" "}
            <Button
              onClick={() => setIsPopoverOpen(false)}
              title="No"
              kind="dark-gray"
              darkHoverKind="dark-gray"
              hoverKind="white"
              className="hover:border-primary mr-2"
            />
            <Button title="Yes" onClick={onConfirm} />
          </div>
        </div>
      )}
    >
      <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>{children}</div>
    </Popover>
  )
}
export default ConfirmPopOver
