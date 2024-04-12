/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable unicorn/prevent-abbreviations */
import getConfig from "next/config"
import qs from "qs"
import React from "react"
import { MODULE_ACTIONS } from "utils/constant"
import Button from "widgets/button"
import OrbitLoader from "widgets/loader"

const { publicRuntimeConfig } = getConfig()

const DocSummary = ({ courseValue, countDetails, loading, isAllow }) => {
  const generateLoa = () => {
    const payload = {
      courseId: courseValue?.value,
    }
    window.open(`${publicRuntimeConfig.NEXT_PUBLIC_FETCH_URL}/admin/loa/generate?${qs.stringify(payload)}`, "_blank")
  }

  return (
    <div className="flex flex-col justify-between loa-box-height overflow-auto overflow-x-hidden bg-white border rounded-lg border-thin-gray">
      <h2 className="text-md font-semibold text-black py-4 border-b border-thin-gray px-5">
        {`Summary of Applicants for Course ${
          courseValue && countDetails && Object.keys(countDetails)?.length ? `(${courseValue?.label})` : ""
        }`}
      </h2>
      <div>
        <div className="grid grid-cols-1 gap-5 p-5 relative">
          {loading && <OrbitLoader relative />}
          {courseValue && countDetails && Object.keys(countDetails)?.length ? (
            Object.entries(countDetails)?.map((item) => (
              <div className="bg-secondary rounded-lg flex items-center justify-between py-3 px-5 text-sm font-medium">
                <p className=" text-black">{item[0].replace(/_/g, " ")}</p>
                <p className=" text-primary">{item[1]}</p>
              </div>
            ))
          ) : (
            <div className="font-semibold text-center py-20">Select course and submit and show summary.</div>
          )}
        </div>
      </div>
      {isAllow(MODULE_ACTIONS.GENERATELOA) && courseValue && countDetails && Object.keys(countDetails)?.length ? (
        <div className="mt-auto py-4 border-t flex justify-center border-thin-gray px-5">
          <Button title="Generate LOA" onClick={() => generateLoa()} />
        </div>
      ) : (
        <div className="mt-auto" />
      )}
    </div>
  )
}

export default DocSummary
