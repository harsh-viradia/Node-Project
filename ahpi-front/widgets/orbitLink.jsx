/* eslint-disable unicorn/prevent-abbreviations */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from "next/link"
import React from "react"

const OrbitLink = ({
  // eslint-disable-next-line no-script-url
  href = "javascript:;",
  children,
  className,
  onClick,
  dataTip,
  onKeyPress = () => false,
  download = false,
  ...other
}) => {
  return (
    <Link
      href={href}
      className={className}
      download={download}
      onClick={onClick}
      onKeyDown={(e) => onKeyPress(e)}
      data-tip={dataTip}
      {...other}
    >
      {children}
    </Link>
  )
}

export default OrbitLink
