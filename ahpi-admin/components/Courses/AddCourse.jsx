/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable unicorn/consistent-function-scoping */
/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable no-undef */
/* eslint-disable jsx-a11y/no-redundant-roles */
/* eslint-disable jsx-a11y/anchor-is-valid */
import commonApi from "api"
import LeftArrowIcon from "icons/leftArrowIcon"
import { useRouter } from "next/router"
import React, { useEffect } from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS, SYSTEM_USERS } from "utils/constant"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"

import BasicInfo from "./BasicInfo"
import CourseInfo from "./CourseInfo"
import useSyncAddCourse from "./hooks/useSyncAddCourse"
import PricingInfo from "./pricingInfo"
import Section from "./Section"

const AddCourse = ({ permission = {}, user = {} }) => {
  const { isAllow, ...other } = useSyncAddCourse({ permission })
  const router = useRouter()
  useEffect(() => {
    if (user?.role === SYSTEM_USERS.INSTRUCTOR && !router?.query?.courseId) {
      commonApi({ action: "courseCountForInstructor", data: { instructorId: user?.id } })
        .then(([error, { data }]) => error && router.push(routes.course))
        .catch(() => {})
    }
    if (user?.role === SYSTEM_USERS.INSTRUCTOR) {
      commonApi({ action: "getProfile", data: { instructorId: user?.id } })
        .then(([error, { data }]) => other.setCourseApproval(data.agreement?.isApproved))
        .catch(() => {})
    }
  }, [])

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title={
        <div className="flex gap-2">
          <OrbitLink
            onClick={() =>
              router.push({
                pathname: routes.course,
                query: { limit: router?.query?.limit, offset: router?.query?.offset },
              })
            }
          >
            <LeftArrowIcon />
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
                {(isAllow(MODULE_ACTIONS.GET) ||
                  isAllow(MODULE_ACTIONS.UPDATEBASICINFO) ||
                  isAllow(MODULE_ACTIONS.BASICINFO)) && (
                  <li className="relative md:flex-1 md:flex">
                    <a className="flex items-center w-full group" onClick={() => other?.basicInfo()}>
                      <span className="flex items-center px-6 py-4 text-sm font-medium">
                        {other?.basicInfoTab ? (
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-primary">
                            <span className="text-primary">01</span>
                          </span>
                        ) : other?.courseData?.title ? (
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
                        ) : (
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-light-gray group-hover:border-gray-400">
                            <span className="text-gray-500 group-hover:text-gray-900">01</span>
                          </span>
                        )}
                        <span
                          className={`ml-4 text-sm font-medium ${
                            other?.basicInfoTab
                              ? "text-primary"
                              : router?.query?.courseId
                              ? "text-gray-900"
                              : "text-gray-500"
                          }`}
                        >
                          Basic Information
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
                )}

                {isAllow(MODULE_ACTIONS.COURSEINFO) && (
                  <li className="relative md:flex-1 md:flex">
                    <a
                      className="flex items-center px-6 py-4 text-sm font-medium"
                      aria-current="step"
                      onClick={() => (other?.courseData?.title ? other?.messages() : false)}
                    >
                      {other?.messagesTab ? (
                        <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-primary">
                          <span className="text-primary">02</span>
                        </span>
                      ) : other?.courseData?.about ? (
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
                      ) : (
                        <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-light-gray group-hover:border-gray-400">
                          <span className="text-gray-500 group-hover:text-gray-900">02</span>
                        </span>
                      )}
                      <span
                        className={`ml-4 text-sm font-medium ${other?.messagesTab ? "text-primary" : "text-gray-900"}`}
                      >
                        Course Info
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
                )}
                {(isAllow(MODULE_ACTIONS.GETALLSECTIONS) || isAllow(MODULE_ACTIONS.CREATESECTIONS)) && (
                  <li className="relative md:flex-1 md:flex">
                    <a
                      onClick={() =>
                        other?.courseData?.title &&
                        (isAllow(MODULE_ACTIONS.COURSEINFO) ? other?.courseData?.title : true)
                          ? other?.section()
                          : false
                      }
                      className="flex items-center group"
                    >
                      <span className="flex items-center px-6 py-4 text-sm font-medium">
                        {other?.sectionTab ? (
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-primary">
                            <span className="text-primary">03</span>
                          </span>
                        ) : other?.sectionData?.length > 0 ? (
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
                        ) : (
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-light-gray group-hover:border-gray-400">
                            <span className="text-gray-500 group-hover:text-gray-900">03</span>
                          </span>
                        )}
                        <span
                          className={`ml-4 text-sm font-medium ${other?.sectionTab ? "text-primary" : "text-gray-500"}`}
                        >
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
                )}
                {isAllow(MODULE_ACTIONS.ADDPRICE) && (
                  <li className="relative md:flex-1 md:flex">
                    <a
                      onClick={() =>
                        other?.courseData?.title &&
                        (isAllow(MODULE_ACTIONS.COURSEINFO) ? other?.courseData?.title : true) &&
                        (isAllow(MODULE_ACTIONS.CREATESECTIONS) ? other?.sectionData?.length : true)
                          ? other?.pricing()
                          : false
                      }
                      className="flex items-center group"
                    >
                      <span className="flex items-center px-6 py-4 text-sm font-medium">
                        {other?.pricingTab ? (
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-primary">
                            <span className="text-primary">04</span>
                          </span>
                        ) : other?.courseData?.price ? (
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
                        ) : (
                          <span className="flex items-center justify-center flex-shrink-0 w-10 h-10 border-2 rounded-full border-light-gray group-hover:border-gray-400">
                            <span className="text-gray-500 group-hover:text-gray-900">04</span>
                          </span>
                        )}
                        <span
                          className={`ml-4 text-sm font-medium ${other?.pricingTab ? "text-primary" : "text-gray-500"}`}
                        >
                          Pricing
                        </span>
                      </span>
                    </a>
                  </li>
                )}
              </ol>
            </nav>
            {other?.basicInfoTab && (
              <BasicInfo
                permission={permission}
                isAllow={isAllow}
                messages={other?.messages}
                section={other?.section}
                pricing={other?.pricing}
                user={user}
              />
            )}
            {other?.messagesTab && <CourseInfo isAllow={isAllow} section={other?.section} pricing={other?.pricing} />}
            {other?.sectionTab && (
              <div className="grid max-w-4xl gap-3 mx-auto">
                <Section isAllow={isAllow} pricing={other?.pricing} />
              </div>
            )}
            {other?.pricingTab && <PricingInfo courseApproval={other.courseApproval} user={user} isAllow={isAllow} />}
          </nav>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default AddCourse
