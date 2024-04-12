import React from "react"
import Sidebar from "shared/sidebar"
import OrbitLoader from "widgets/loader"

const LayoutWrapper = ({
  children,
  title = "",
  headerDetail,
  headerClass,
  ChildrenClass,
  topDetail,
  permission = {},
  user = {},
  loading = false,
}) => {
  return (
    <div className="flex w-screen h-screen">
      {/* <div className="w-60 bg-dark-gray "> */}
      <Sidebar permission={permission} user={user} />
      {/* </div> */}
      <div className="relative w-full overflow-auto bg-secondary">
        <div>{topDetail}</div>
        {headerDetail || title ? (
          <div
            className={`static h-16 top-0 flex items-center justify-between px-4 pl-6 py-2.5 bg-white shadow-sm ${headerClass}`}
          >
            <h4 className="font-bold">{title}</h4>
            <div>{headerDetail}</div>
          </div>
        ) : (
          ""
        )}
        <div className={`p-3 ${ChildrenClass}`}>{children}</div>
        {loading && <OrbitLoader relative />}
      </div>
    </div>
  )
}

export default LayoutWrapper
