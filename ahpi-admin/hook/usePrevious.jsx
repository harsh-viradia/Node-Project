import React from "react"

const usePrevious = (value) => {
  const reference = React.useRef()
  React.useEffect(() => {
    reference.current = value
  })
  return reference.current
}

export default usePrevious
