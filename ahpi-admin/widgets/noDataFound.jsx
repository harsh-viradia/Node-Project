import React from "react"

const NoDataFound = ({ text = "No Data Found" }) => {
  return (
    <div className="absolute top-0 bottom-0 left-0 right-0">
      <div className="h-full w-full flex items-center justify-center">
        <div className=" min-h-[200px] flex items-center">
          <div>
            <p className="mt-2 font-semibold text-xl">{text}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NoDataFound
