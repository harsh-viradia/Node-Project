import React from "react"
import OrbitLink from "widgets/orbitLink"

const SidebarMenu = ({ title, icon, href, className, ...rest }) => {
  return (
    <div className="">
      <OrbitLink href={href} className={` ${className}`} {...rest}>
        {icon}
        <span>{title}</span>
      </OrbitLink>
    </div>
  )
}

export default SidebarMenu
