/* eslint-disable react/no-danger */
import useTranslation from "next-translate/useTranslation"
import React from "react"

import OrbitLink from "./orbitLink"

const NotificationCard = ({ id, src, title, time, desc, href, setNotificationAsRead = () => {} }) => {
  const { t } = useTranslation("notification")
  return (
    <OrbitLink href={href} className="flex gap-3 py-4 overflow-hidden rounded-lg">
      <div className="shrink-0">
        <img src={src} className="min-h-[64px] h-16 min-w-[64px] w-16 object-cover rounded-md" alt="" loading="lazy" />
      </div>
      <div className="grid w-full gap-2">
        <div className="grid gap-1">
          <div className="flex flex-row items-center w-full gap-3 ">
            <div className="flex-col gap-1.5 flex w-[85%] justify-between">
              <h4 className="font-semibold line-clamp-2">{title}</h4>
              <p className="text-xs text-dark-gray">{time}</p>
            </div>
            <OrbitLink
              className="text-primary font-bold text-xs ml-auto p-2 border z-20"
              onClick={(e) => {
                e.stopPropagation()
                setNotificationAsRead(id)
              }}
            >
              {t("markAsRead")}
            </OrbitLink>
          </div>
          {desc ? (
            <div className="flex items-center gap-3">
              <div dangerouslySetInnerHTML={{ __html: desc }} />
            </div>
          ) : (
            ""
          )}
        </div>
      </div>
    </OrbitLink>
  )
}

export default NotificationCard
