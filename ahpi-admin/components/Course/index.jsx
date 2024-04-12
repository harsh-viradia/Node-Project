/* eslint-disable sonarjs/no-duplicate-string */
import Table from "hook/table/useTable"
import AddIcon from "icons/addIcon"
import DeleteIcon from "icons/deleteIcon"
import EditIcon from "icons/editIcon"
import { useRouter } from "next/router"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import routes from "utils/routes"
import Button from "widgets/button"
import FilterButton from "widgets/filterButton"
import OrbitLink from "widgets/orbitLink"
import Status from "widgets/status"

import courseColumns from "./columns"
import FilterCourse from "./FilterCourse"

const list = [
  {
    no: "1",
    name: "Mobile Application Development.",
    image: <img src="https://picsum.photos/200" alt="" className="object-cover w-6 h-6 rounded-full" />,
    instructor: "Orbit Future Academy",
    price: "100",
    duration: "150 hour",
    lesson: "1",
    status: <Status statusName="Published" color="green" />,
    action: (
      <div className="flex items-center gap-3">
        <OrbitLink href="#">
          <EditIcon />
        </OrbitLink>
        <OrbitLink href="#">
          <DeleteIcon />
        </OrbitLink>
      </div>
    ),
  },
  {
    no: "2",
    name: "TensorFlow Developer Certificate in 2022: Zero to Mastery ",
    image: <img src="https://picsum.photos/200" alt="" className="object-cover w-6 h-6 rounded-full" />,
    instructor: "Orbit Future Academy",
    price: "100",
    duration: "150 hour",
    lesson: "1",
    status: <Status statusName="Published" color="green" />,
    action: (
      <div className="flex items-center gap-3">
        <OrbitLink href="#">
          <EditIcon />
        </OrbitLink>
        <OrbitLink href="#">
          <DeleteIcon />
        </OrbitLink>
      </div>
    ),
  },
  {
    no: "3",
    name: "Ultimate AWS Certified Cloud Practitioner 2022",
    image: <img src="https://picsum.photos/200" alt="" className="object-cover w-6 h-6 rounded-full" />,
    instructor: "Orbit Future Academy",
    price: "100",
    duration: "150 hour",
    lesson: "1",
    status: <Status statusName="Draft" />,
    action: (
      <div className="flex items-center gap-3">
        <OrbitLink href="#">
          <EditIcon />
        </OrbitLink>
        <OrbitLink href="#">
          <DeleteIcon />
        </OrbitLink>
      </div>
    ),
  },
]
const Course = ({ permission = {}, user = {} }) => {
  const router = useRouter()
  const [open1, setOpen1] = useState(false)
  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="Courses"
      headerDetail={
        <div className="flex gap-4">
          <Button title="Add" icon={<AddIcon size="10" />} onClick={() => router.push(routes.addCourse)} />
          <FilterButton onClick={() => setOpen1(true)} />
        </div>
      }
    >
      <Table
        columns={courseColumns().columns}
        data={list}
        // loading={dt.loading}
        // page={dt.currentPage}
        // totalPages={dt.pageCount}
        // limit={dt.perPage}
        // onPaginationChange={dt.onPaginationChange}
        // itemCount={dt.itemCount}
        // currentPageCount={dt.list.length}
      />
      <FilterCourse open={open1} setOpen={setOpen1} />
    </LayoutWrapper>
  )
}

export default Course
