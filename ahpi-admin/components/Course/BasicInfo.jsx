/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import React from "react"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"
import Input from "widgets/input"
import TextEditor from "widgets/textEditor"
import Upload from "widgets/upload"
import Upload2 from "widgets/upload2"

const BasicInfo = () => {
  const LevelList = [
    { value: "1", label: "Beginner Level" },
    { value: "2", label: "Intermediate Level" },
    { value: "3", label: "Advance Level" },
    { value: "4", label: "All Levels" },
  ]
  const CategoryList = [
    { value: "1", label: "Development" },
    { value: "2", label: "Business" },
    { value: "3", label: "Finance & Accounting" },
    { value: "4", label: "IT & Software" },
    { value: "5", label: "Office Productivity" },
    { value: "6", label: "Personal Development" },
    { value: "7", label: "Design" },
    { value: "8", label: "Marketing" },
  ]
  const SubCategoryList = [
    { value: "1", label: "IT Certifications" },
    { value: "2", label: "Network & Security" },
    { value: "3", label: "Hardware" },
    { value: "4", label: "Operating Systems & Servers" },
    { value: "5", label: "Other IT & Software" },
  ]
  const userList = [
    { value: "1", label: "Nining Putri" },
    { value: "2", label: "Chrisenia Nadia " },
    { value: "3", label: "Syifa Intan" },
    { value: "4", label: "Supangkat Eka" },
    { value: "5", label: "Luis Juliandenny" },
    { value: "6", label: "kurniadi" },
  ]
  const language = [
    { value: "1", label: "English" },
    { value: "2", label: "Spanish" },
    { value: "3", label: "French" },
    { value: "4", label: "Arabic" },
    { value: "5", label: "Bengali" },
    { value: "6", label: "Indonesian" },
  ]
  return (
    <div className="grid max-w-4xl grid-cols-2 gap-3 mx-auto mt-8">
      <Input label="Course Title" placeholder="Enter Title" mandatory />
      <Input label="Course Slug" placeholder="Course Slug" />
      <Dropdown label="Select Language" defaultOptions={language} placeholder="Choose Language" />
      <div className="col-span-2">
        <TextEditor label="Course Description" placeholder="Enter Description" mandatory />
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-2 gap-3">
          <Dropdown label="Level" defaultOptions={LevelList} mandatory />
          <Dropdown label="Partner" defaultOptions={userList} placeholder="Select Partner" mandatory />
          <Dropdown label="Program" defaultOptions={CategoryList} mandatory />
          <Dropdown label="Sub Program" defaultOptions={SubCategoryList} mandatory />
          <Dropdown label="Select Certificate" mandatory />
        </div>
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <div className="w-full min-h-full p-2 border rounded-lg border-light-gray">
              <img src="https://picsum.photos/400/400" className="object-cover w-full rounded h-52" alt="" />
            </div>
          </div>
          <div className="flex items-center col-span-5">
            <Upload label="Course Image" formats="JPG,JPEG" mandatory />
          </div>
        </div>
      </div>
      <div className="col-span-2">
        <div className="grid grid-cols-12 gap-4">
          <div className="col-span-7">
            <div className="w-full min-h-full p-2 border rounded-lg border-light-gray">
              <iframe
                src="https://www.youtube.com/embed/IUN664s7N-c"
                title="YouTube video player"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="object-cover w-full rounded h-52"
              />
            </div>
          </div>
          <div className="flex items-center col-span-5">
            <Upload2 label="Promotional Video" mandatory formats="MP3, MOV, WMV" />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end col-span-2 gap-3 mt-3">
        <Button title="Close" outline />
        <Button title="Save as Draft" />
        <Button title="Save & Next" kind="dark-gray" hoverKind="white" className="hover:border-primary" />
      </div>
    </div>
  )
}

export default BasicInfo
