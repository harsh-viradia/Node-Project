/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from "next/link"
import React from "react"

const SidebarSubmenu = ({ title, href, className }) => {
  return (
    <div className="">
      <Link href={href}>
        <a
          className={`flex items-center gap-3 text-white text-xs py-2 px-2 rounded-lg pl-11 transition hover:text-blue ${className} `}
        >
          <span>{title}</span>
        </a>
      </Link>
    </div>
  )
}

export default SidebarSubmenu
