/* eslint-disable jsx-a11y/label-has-associated-control */
import commonApi from "api"
import dynamic from "next/dynamic"
import React, { useEffect, useMemo, useRef, useState } from "react"
import Toast from "utils/toast"

const ReactQuill = dynamic(
  async () => {
    const { default: RQ } = await import("react-quill")
    return ({ forwardedRef, ...properties }) => <RQ ref={forwardedRef} {...properties} />
  },
  {
    ssr: false,
  }
)

const TextEditor = ({
  label,
  className,
  error,
  setValue = () => {},
  valueText,
  valueData = "",
  mandatory = false,
  rest = {},
  placeholder = "",
  disabled,
}) => {
  const editorReference = useRef(null)
  const [firstRender, setFirstRender] = useState(true)

  useEffect(() => {
    setFirstRender(false)
  }, [])
  const imageHandler = () => {
    if (disabled) return
    const input = document.createElement("input")
    input.setAttribute("type", "file")
    input.setAttribute("accept", "image/*")
    input.click()
    input.addEventListener("change", async () => {
      const file = input.files[0]
      const isJPG =
        file.type === "image/jpg" ||
        file.type === "image/jpeg" ||
        file.type === "image/png" ||
        file.type === "image/webp" ||
        file.type === "image/gif" ||
        file.type === "image/svg+xml"
      if (!isJPG) {
        return Toast("You can upload only JPG, JPEG, PNG, WEBP, GIF OR SVG file!", "error")
      }
      const isLt2M = file.size / 1024 / 1024 < 2
      if (!isLt2M) {
        return Toast("Image size must be smaller than 2MB!", "error")
      }

      const payload = new FormData()
      // payload.append("folder", "images")
      payload.append("files", file, file?.name)
      if (payload) {
        await commonApi({
          action: "imgUpload",
          data: payload,
          config: {
            contentType: "multipart/form-data",
          },
        }).then(([, { data = {} }]) => {
          const range = editorReference?.current?.getEditorSelection()
          editorReference?.current?.getEditor().insertEmbed(range.index, "image", data?.[0]?.uri)
          return false
        })
      }
      return isJPG && isLt2M
    })
  }

  const modules = useMemo(
    () => ({
      toolbar: {
        container: [
          [{ header: [1, 2, 3, 4, 5, 6, false] }],
          ["bold", "italic", "underline", "strike", "blockquote"],
          [{ list: "ordered" }, { list: "bullet" }, { indent: "-1" }, { indent: "+1" }, { align: [] }],
          [{ color: [] }],
          [{ font: [] }],
          ["image"],
        ],
        handlers: {
          image: imageHandler,
        },
      },
      clipboard: { matchVisual: false },
    }),
    []
  )

  const formats = [
    "header",
    "font",
    "size",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
    "align",
  ]

  return (
    <div className={`${className}`}>
      {firstRender === false && label && (
        <label className="inline-block mb-2 text-xs font-medium text-foreground">
          {label} {mandatory ? <span className="text-red">*</span> : ""}
        </label>
      )}
      <ReactQuill
        readOnly={disabled}
        className={disabled ? "!bg-disabled-gray" : ""}
        placeholder={placeholder}
        forwardedRef={editorReference}
        formats={formats}
        modules={modules}
        value={valueData}
        {...rest}
        onChange={(value) => {
          const newValue = value !== "<p><br></p>" ? value : ""
          setValue(valueText, newValue)
          const e = {
            target: {
              name: valueText,
              value: newValue,
            },
          }
          rest?.onChange?.(e)
        }}
        onBlur={() => false}
      />
      {error && <p className="text-xs font-medium mt-1 text-red">{error}</p>}
    </div>
  )
}

export default TextEditor
