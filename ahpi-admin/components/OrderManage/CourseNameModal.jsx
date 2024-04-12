import React from "react"
import DrawerWrapper from "shared/drawer"
import Button from "widgets/button"
import StatusPrice from "widgets/statusPrice"

const CourseNameModal = ({ open, setOpen, courses }) => {
  // const [] = useState(false)
  const closeModal = () => {
    setOpen(false)
  }
  return (
    <DrawerWrapper
      title="Course Name"
      modalFooter={
        <>
          <Button
            onClick={closeModal}
            title="Close"
            kind="dark-gray"
            hoverKind="white"
            className="hover:border-primary"
          />
          {/* <Button title="Apply filter" /> */}
        </>
      }
      open={open}
      setOpen={closeModal}
    >
      <div className="flex flex-wrap gap-2">
        {courses?.map((course) => (
          <StatusPrice statusName={course.nm} color="primary" priceLabel price={`₹ ${course.price}`} />
        ))}
        {/* ))} */}
      </div>
      <div />
      {/* <button type="button" className="text-primary underline" onClick={() => setOpen(true)}>
        1
      </button> */}
    </DrawerWrapper>
  )
}

export default CourseNameModal
