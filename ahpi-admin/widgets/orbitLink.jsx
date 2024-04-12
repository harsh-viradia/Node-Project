/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable no-script-url */
import Link from "next/link"
import React from "react"

const OrbitLink = ({ href = "javascript:;", children, className, onClick, dataTip, onKeyPress = () => false }) => {
  return (
    <Link href={href}>
      <a className={className} onClick={onClick} onKeyDown={(e) => onKeyPress(e)} data-tip={dataTip}>
        {children}
      </a>
    </Link>
  )
}

export default OrbitLink
