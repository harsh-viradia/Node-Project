import React from "react"

const OrbitLoader = ({ relative = false }) => {
  return (
    <div
      className="orbit-loader"
      style={{
        position: relative ? "absolute" : "fixed",
      }}
    >
      <div className="gooey">
        <span className="dot" />
        <div className="dots">
          <span />
          <span />
          <span />
        </div>
      </div>
    </div>
  )
}

export default OrbitLoader
