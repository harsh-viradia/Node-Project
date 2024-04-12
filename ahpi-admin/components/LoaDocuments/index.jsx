/* eslint-disable unicorn/prevent-abbreviations */
import { hasAccessTo } from "@knovator/can"
import React from "react"
import LayoutWrapper from "shared/layout/wrapper"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import Button from "widgets/button"
import Dropdown from "widgets/dropdown"

import DocsDownload from "./DocsDownload"
import DocSummary from "./DocSummary"
import useLoaDocuments from "./hooks/useLoaDocuments"

const LoaDocuments = ({ permission = {}, user = {} }) => {
  const {
    courseOptions,
    courseValue,
    getAllCourses,
    setCourseValue,
    countDetails,
    loading,
    getCourseCountDetails,
    setCourseDetails,
    documentsList,
    setDocumentsList,
    isAllow,
  } = useLoaDocuments({ permission })

  return (
    <LayoutWrapper
      permission={permission}
      user={user}
      title="LOA And Document Export"
      headerDetail={
        isAllow(MODULE_ACTIONS.GETCOUNT) &&
        isAllow(MODULE_ACTIONS.DOCUMENTEXPORT) && (
          <div className="flex items-center gap-3">
            <Dropdown
              isClearable
              isSearchable={hasAccessTo(permission, MODULES.COURSE, MODULE_ACTIONS.GETALL)}
              placeholder="Select Course"
              className="w-60"
              id="coursesAppliedId"
              value={courseValue}
              defaultOptions={courseOptions}
              loadOptions={getAllCourses}
              onChange={(opt) => {
                setCourseValue(opt)
                setCourseDetails({})
                setDocumentsList([])
              }}
            />
            <Button title="Submit" onClick={() => getCourseCountDetails()} loading={loading} disabled={!courseValue} />
          </div>
        )
      }
    >
      <div className="grid grid-cols-2 gap-4">
        {isAllow(MODULE_ACTIONS.GETCOUNT) && (
          <DocSummary courseValue={courseValue} countDetails={countDetails} loading={loading} isAllow={isAllow} />
        )}
        {isAllow(MODULE_ACTIONS.DOCUMENTEXPORT) && (
          <DocsDownload courseValue={courseValue} documentsList={documentsList} loading={loading} />
        )}
      </div>
    </LayoutWrapper>
  )
}

export default LoaDocuments
