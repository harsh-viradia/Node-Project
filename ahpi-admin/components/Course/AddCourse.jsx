/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */
import BackIcon from "icons/backIcon"
import React, { useState } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import routes from "utils/routes"
import Button from "widgets/button"
import Input from "widgets/input"
import OrbitLink from "widgets/orbitLink"
import TextEditor from "widgets/textEditor"

import BasicInfo from "./BasicInfo"
import Section from "./Section"

const AddCourse = ({ permission = {}, user = {} }) => {
  const [basicInfoTab, setBasicInfoTab] = useState(true)
  const [sectionTab, setSectionTab] = useState(false)
  const [messagesTab, setMessagesTab] = useState(false)
  const [pricingTab, setPricingTab] = useState(false)

  const basicInfo = () => {
    setBasicInfoTab(true)
    setSectionTab(false)
    setMessagesTab(false)
    setPricingTab(false)
  }
  const section = () => {
    setSectionTab(true)
    setBasicInfoTab(false)
    setMessagesTab(false)
    setPricingTab(false)
  }
  const messages = () => {
    setSectionTab(false)
    setBasicInfoTab(false)
    setMessagesTab(true)
    setPricingTab(false)
  }
  const addPricing = () => {
    setSectionTab(false)
    setBasicInfoTab(false)
    setMessagesTab(false)
    setPricingTab(true)
  }

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title={
        <div className="flex gap-2">
          <OrbitLink className="flex items-center justify-between" href={routes.course}>
            <BackIcon />
          </OrbitLink>
          <p className="self-center">Courses</p>
        </div>
      }
    >
      <div className="py-8 bg-white border rounded-lg border-thin-gray details">
        <div>
          <nav className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8" aria-label="Progress">
            <nav aria-label="Progress">
              <ol
                role="list"
                className="border divide-y rounded-md border-light-gray divide-light-gray md:flex md:divide-y-0"
              >
                <li className="relative md:flex-1 md:flex">
                  <a href="#" className="flex items-center w-full group" onClick={() => basicInfo()}>
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 rounded-full bg-primary group-hover:bg-primary">
                        <svg
                          className="w-6 h-6 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-900">Basic Information</span>
                    </span>
                  </a>
                  <div className="absolute top-0 right-0 hidden w-5 h-full md:block" aria-hidden="true">
                    <svg
                      className="w-full h-full text-light-gray"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </li>

                <li className="relative md:flex-1 md:flex">
                  <a
                    href="#"
                    className="flex items-center px-6 py-4 text-sm font-medium"
                    aria-current="step"
                    onClick={() => messages()}
                  >
                    <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-primary">
                      <span className="text-primary">02</span>
                    </span>
                    <span className="ml-4 text-sm font-medium text-primary">Course Info</span>
                  </a>

                  <div className="absolute top-0 right-0 hidden w-5 h-full md:block" aria-hidden="true">
                    <svg
                      className="w-full h-full text-light-gray"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </li>

                <li className="relative md:flex-1 md:flex">
                  <a href="#" onClick={() => section()} className="flex items-center group">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-light-gray group-hover:border-gray-400">
                        <span className="text-gray-500 group-hover:text-gray-900">03</span>
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                        Curriculum
                      </span>
                    </span>
                  </a>
                  <div className="absolute top-0 right-0 hidden w-5 h-full md:block" aria-hidden="true">
                    <svg
                      className="w-full h-full text-light-gray"
                      viewBox="0 0 22 80"
                      fill="none"
                      preserveAspectRatio="none"
                    >
                      <path
                        d="M0 -2L20 40L0 82"
                        vectorEffect="non-scaling-stroke"
                        stroke="currentcolor"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </div>
                </li>
                <li className="relative md:flex-1 md:flex">
                  <a href="#" onClick={() => addPricing()} className="flex items-center group">
                    <span className="flex items-center px-6 py-4 text-sm font-medium">
                      <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-light-gray group-hover:border-gray-400">
                        <span className="text-gray-500 group-hover:text-gray-900">04</span>
                      </span>
                      <span className="ml-4 text-sm font-medium text-gray-500 group-hover:text-gray-900">
                        Add Pricing
                      </span>
                    </span>
                  </a>
                </li>
              </ol>
            </nav>
            {basicInfoTab && <BasicInfo />}
            {messagesTab && (
              <div className="grid max-w-4xl gap-3 mx-auto mt-8">
                <TextEditor label="Course Brief Description" />
                <TextEditor label="What you will learn" mandatory />
                <TextEditor label="This course includes" mandatory />
                <TextEditor label="Requirements" mandatory />
                <div className="flex items-center justify-end gap-3 mt-3">
                  <Button title="Close" outline className="hover:border-primary" />
                  <Button title="Save as Draft" />
                  <Button title="Save & Next" kind="dark-gray" hoverKind="white" className="hover:border-primary" />
                </div>
              </div>
            )}
            {sectionTab && (
              <div className="grid max-w-4xl gap-3 mx-auto">
                <Section />{" "}
              </div>
            )}
            {pricingTab && (
              <div className="grid max-w-4xl grid-cols-2 gap-3 mx-auto mt-8">
                <Input label="Retail Price" placeholder="Enter Retail Price" mandatory />
                <Input label="Selling Price" placeholder="Enter Selling Price" mandatory />
                <div className="flex items-center justify-end col-span-2 gap-3 mt-3">
                  <Button title="Close" outline className="hover:border-primary" />
                  <Button title="Save as Draft" />
                  <Button title="Publish Now" kind="dark-gray" hoverKind="white" className="hover:border-primary" />
                  <Button title="Submit for review" />
                </div>
              </div>
            )}
          </nav>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default AddCourse
