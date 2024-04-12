import React from "react"

const OrbitLoader = ({ className, relative = false, text = "" }) => {
  return (
    <div className={`orbit-loader ${relative ? "absolute" : "fixed"} ${className}`}>
      <div className="gooey">
        <span className="dot" />
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
      </div>

      <div className="video-loader-text text-primary">{text}</div>
    </div>
  )
}

export default OrbitLoader
