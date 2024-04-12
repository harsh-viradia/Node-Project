import React from "react"
import LayoutWrapper from "shared/layout/wrapper"

const Dashboard = ({ user = {}, permission = {} }) => {
  return (
    <LayoutWrapper permission={permission} user={user} title="Dashboard">
      <div className="flex">
        Welcome to <p className="ml-1 font-bold">AHPI Academy </p>
      </div>
    </LayoutWrapper>
  )
}

export default Dashboard
