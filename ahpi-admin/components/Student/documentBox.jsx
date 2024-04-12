/* eslint-disable no-underscore-dangle */
import React from "react"
import Upload2 from "widgets/upload2"

const DocumentBox = ({
  control,
  setValue,
  useFieldArray,
  errors,
  clearErrors,
  getValues,
  userDetails,
  setDeletedData,
  deletedData,
}) => {
  const { fields } = useFieldArray({
    control,
    name: "data",
  })

  return (
    <div className="grid grid-cols-1 gap-6 pt-3">
      {fields.map((item, index) => (
        <Upload2
          label={`${item.name} *`}
          docId={item.docId}
          fileId={item?._id}
          setValue={setValue}
          getValues={getValues}
          error={errors?.data?.[index]?.documentId?.message}
          clearErrors={clearErrors}
          index={index}
          userDetails={userDetails}
          setDeletedData={setDeletedData}
          deletedData={deletedData}
        />
      ))}
    </div>
  )
}

export default DocumentBox
