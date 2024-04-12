/* eslint-disable react/jsx-no-useless-fragment */
/* eslint-disable simple-import-sort/imports */
import React from "react"
import OrbitLoader from "widgets/loader"
import { hasAccessTo } from "@knovator/can"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import userAddress from "../hooks/useAddress"

const StudentDetails = ({ original, permission }) => {
  const { addressDetail, loading } = userAddress(original, permission)
  const isAllow = (key) => hasAccessTo(permission, MODULES.ZIPCODE, key)
  const StuDetail = [
    { name: "User Name", value: original?.name },
    { name: "Email", value: original?.email },
    { name: "Phone", value: original?.mobNo },
  ]

  const studentDetail = StuDetail?.map((x) => {
    return { name: x.name, value: x.value }
  })

  return (
    <div className="p-2">
      <div className="grid grid-cols-3 text-sm gap-2.5">
        {studentDetail.map((item) => (
          <div className="flex flex-col gap-1 p-2 px-3 border rounded-md border-light-gray bg-primary-light">
            <p className="text-xs font-medium text-black">{item.name}</p>
            <p className="">{item.value}</p>
          </div>
        ))}
      </div>

      {isAllow(MODULE_ACTIONS.GETALL) && (
        <>
          {!loading && addressDetail.data?.length === 0 ? (
            <div className="mt-2 grid grid-cols-1 text-sm gap-2.5">
              <p className="mt-2 font-bold">User Address: </p>
              <div className="flex flex-col gap-1 p-5 px-5 border rounded-md border-light-gray bg-primary-light">
                <p className="text-xs font-medium text-black relative">User has not added any Address.</p>
              </div>
            </div>
          ) : (
            <div className="mt-2 grid grid-cols-1 text-sm gap-2.5 relative">
              {addressDetail.data?.length && <p className="mt-2 font-bold">User Address: </p>}
              {addressDetail.data?.map((data) => {
                return (
                  <div className="flex flex-col gap-1 p-2 px-3 border rounded-md border-light-gray bg-primary-light">
                    {data.isDefault && <div className="p-3 bg-gray-300 font-bold  rounded-t-lg">Default</div>}
                    <p className="">{data?.addrLine1}</p>
                    <p className="">{data?.addrLine2}</p>
                    <p className="">
                      {data?.cityNm}, {data?.zipcode}
                    </p>
                    <p className="">{data?.stateNm}</p>
                    <p className="">{data?.countryNm}</p>
                  </div>
                )
              })}
              {loading && <OrbitLoader />}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default StudentDetails
