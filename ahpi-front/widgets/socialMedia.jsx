/* eslint-disable prettier/prettier */
/* eslint-disable react/destructuring-assignment */
/* eslint-disable prettier/prettier */
import FacebookIcon from "icons/facebookIcon"
import InstaIcon from "icons/InstaIcon"
import LinkedinIcon from "icons/linkedinIcon"
import WebIcon from "icons/webIcon"
import React, { useEffect, useState } from "react"
import OrbitLink from "widgets/orbitLink"

const SocialMedia = ({ links }) => {
  const [socialLinks, setLinks] = useState([])
  useEffect(() => {
    setLinks([
      { icon: <FacebookIcon />, link: links?.fbLink },
      { icon: <InstaIcon />, link: links?.instaLink },
      { icon: <LinkedinIcon />, link: links?.linkedIn },
      { icon: <WebIcon />, link: links?.websiteLink },
    ])
  }, [links])
  return (
      socialLinks?.map(({ icon, link }) =>
        link ? (
          <OrbitLink className="hover:text-primary text-mid-gray transition" target="_blank" href={link}>
            <div className="relative z-[1]">{icon}</div>
            <div className="absolute w-full h-0 bottom-0 left-0 bg-primary group-hover:h-full transition-all" />
          </OrbitLink>
        ) : (
          ""
        )
      )
  )
}

export default SocialMedia
