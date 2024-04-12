import AddIcon from "icons/addIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import Button from "widgets/button"

import AddWidget from "./AddWidget"
import WidgetCard from "./WidgetCard"

const Student = ({ permission = {}, user = {} }) => {
  const [open, setOpen] = useState(false)

  const list = [
    { title: "Top Courses", subTitle: "top_courses", path: "image / card slider" },
    { title: "Top Courses", subTitle: "top_courses", path: "image / card slider" },
  ]

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Homepage Builder"
      headerDetail={
        <div className="flex items-center gap-3">
          <Button onClick={() => setOpen(true)} title="Add Widget" icon={<AddIcon size="10" />} />
        </div>
      }
    >
      <div className="flex w-full h-full gap-4 p-4 bg-white rounded-lg">
        <div className="w-1/2">
          {list.map((props) => (
            <WidgetCard title={props.title} subTitle={props.subTitle} path={props.path} />
          ))}
        </div>
        <div className="w-1/2">2</div>
      </div>
      <AddWidget open={open} setOpen={setOpen} />
    </LayoutWrapper>
  )
}

export default Student
