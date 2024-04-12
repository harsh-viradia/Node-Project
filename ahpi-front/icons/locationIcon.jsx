import React from "react"

const LocationIcon = ({ size = "24px", className }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      className={className}
      viewBox="0 0 24 24"
      fill="none"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.2513 8.66667C11.3358 8.66667 10.5911 9.41141 10.5911 10.3279C10.5911 11.2434 11.3358 11.9872 12.2513 11.9872C13.1668 11.9872 13.9116 11.2434 13.9116 10.3279C13.9116 9.41141 13.1668 8.66667 12.2513 8.66667ZM12.2513 13.4103C10.5512 13.4103 9.16797 12.028 9.16797 10.3279C9.16797 8.62682 10.5512 7.24359 12.2513 7.24359C13.9514 7.24359 15.3346 8.62682 15.3346 10.3279C15.3346 12.028 13.9514 13.4103 12.2513 13.4103Z"
        fill="currentColor"
      />
      <mask
        id="mask0_618_12370"
        style={{ maskType: "alpha" }}
        maskUnits="userSpaceOnUse"
        x="4"
        y="2"
        width="17"
        height="19"
      >
        <path fillRule="evenodd" clipRule="evenodd" d="M4.42383 2.5H20.0772V21H4.42383V2.5Z" fill="white" />
      </mask>
      <g mask="url(#mask0_618_12370)">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12.2507 3.92308C8.71962 3.92308 5.8469 6.82331 5.8469 10.3867C5.8469 14.9206 11.1825 19.3378 12.2507 19.5731C13.319 19.3369 18.6546 14.9197 18.6546 10.3867C18.6546 6.82331 15.7819 3.92308 12.2507 3.92308ZM12.2507 21C10.5487 21 4.42383 15.7327 4.42383 10.3867C4.42383 6.03777 7.93503 2.5 12.2507 2.5C16.5665 2.5 20.0777 6.03777 20.0777 10.3867C20.0777 15.7327 13.9527 21 12.2507 21Z"
          fill="currentColor"
        />
      </g>
    </svg>
  )
}

export default LocationIcon
