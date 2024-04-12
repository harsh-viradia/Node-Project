/* eslint-disable sonarjs/no-all-duplicated-branches */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-danger */
import React from "react"
import Checkbox from "widgets/checkbox"

const MSQ = ({ data, answer, setAnswer }) => {
  return (
    <div className="grid grid-cols-1 max-w-lg gap-5 font-medium mt-6">
      {data?.quesId?.opts?.map((opt) => {
        return (
          <div>
            <div>
              <Checkbox
                checked={!!answer?.ansIds?.find((a) => a === opt?._id)}
                onChange={(event) => {
                  if (event.target.checked) {
                    setAnswer({ ansIds: answer?.ansIds ? [...answer.ansIds, opt?._id] : [opt?._id] })
                  } else {
                    setAnswer({ ansIds: answer.ansIds?.filter((a) => a !== opt._id) })
                  }
                }}
                title={<div className="break-all" dangerouslySetInnerHTML={{ __html: opt?.nm }} />}
                id={opt?.seq}
                For={opt?.seq}
              />
            </div>
          </div>
        )
      })}
    </div>
  )
}

export default MSQ
// 63219ab5d9d1c6d24bc3f00d, 63219ab5d9d1c6d24bc3f00e
// 63219ab5d9d1c6d24bc3f00b
