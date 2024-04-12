/* eslint-disable sonarjs/no-identical-functions */
/* eslint-disable no-underscore-dangle */
import commonApi from "api/index"
import CloseIcon from "icons/closeIcon"
import { useRouter } from "next/router"
import React, { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"

const FLOATING_NOTIFICATION_TYPE = {
  PAGES: "PAGES",
  COURSES: "COURSES",
  CATEGORIES: "CATEGORIES",
}

// eslint-disable-next-line sonarjs/cognitive-complexity
const NotificationShow = () => {
  const [currentNotification, setCurrentNotification] = useState("")
  const { userData, notificationList, setNotificationList } = useContext(AppContext)
  const router = useRouter()
  useEffect(() => {
    if (!notificationList?.length)
      commonApi({ action: "floatingList", config: { token: router.query?.token } })
        .then(([, { data = [] }]) => {
          setNotificationList(data)
          return false
        })
        .catch(() => {})
  }, [router.query])
  const setNotification = () => {
    const checkFromCache = LocalStorage.getJSON("showAd") || []
    if (!notificationList?.length) setCurrentNotification()
    switch (router.pathname) {
      case routes.home: {
        const notify = notificationList?.filter((a) => a.criteriaId.code === FLOATING_NOTIFICATION_TYPE.PAGES)
        if (!notify?.length) {
          setCurrentNotification()
          return
        }
        const filterNotify = []
        notify?.map((a = {}) => {
          a.pages?.map((page) => {
            if (page.slug === "home") {
              filterNotify.push({
                ...page,
                noteTitle: a.title,
                noteBody: a.desc,
                noteId: a._id,
                clearId: `${page.slug}-${a._id}-${userData?.id || "guest"}`,
              })
            }
            return false
          })
          return false
        })
        const finalNotify = filterNotify.find((a) => !checkFromCache.includes(a.clearId))
        setCurrentNotification(finalNotify)
        break
      }
      case routes.categorySlug: {
        const notify = notificationList?.filter((a) => a.criteriaId.code === FLOATING_NOTIFICATION_TYPE.CATEGORIES)
        if (!notify?.length) {
          setCurrentNotification()
          return
        }
        const filterNotify = []
        notify?.map((a = {}) => {
          a.categories?.map((page) => {
            if (page.slug === router.query.slug) {
              filterNotify.push({
                ...page,
                noteTitle: a.title,
                noteBody: a.desc,
                noteId: a._id,
                clearId: `${page.slug}-${a._id}-${userData?.id || "guest"}`,
              })
            }
            return false
          })
          return false
        })
        const finalNotify = filterNotify.find((a) => !checkFromCache.includes(a.clearId))
        setCurrentNotification(finalNotify)
        break
      }
      case routes.courseDetailSlug:
      case routes.myLearningSlug: {
        const notify = notificationList?.filter((a) => a.criteriaId.code === FLOATING_NOTIFICATION_TYPE.COURSES)
        if (!notify?.length) {
          setCurrentNotification()
          return
        }
        const filterNotify = []
        notify?.map((a = {}) => {
          a.courses?.map((page) => {
            if (page.slug === router.query.slug) {
              filterNotify.push({
                ...page,
                noteTitle: a.title,
                noteBody: a.desc,
                noteId: a._id,
                clearId: `${page.slug}-${a._id}-${userData?.id || "guest"}`,
              })
            }
            return false
          })
          return false
        })
        const finalNotify = filterNotify.find((a) => !checkFromCache.includes(a.clearId))
        setCurrentNotification(finalNotify)
        break
      }
      default:
        setCurrentNotification()
        break
    }
  }
  useEffect(() => {
    setNotification()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.query, notificationList, userData])
  const setNotificationAsRead = () => {
    const checkFromCache = LocalStorage.getJSON("showAd")
    LocalStorage.setJSON("showAd", [...checkFromCache, currentNotification.clearId])
    setNotification()
  }

  return currentNotification ? (
    <div className="relative">
      <div className="bg-primary px-12 py-4">
        <div className="absolute top-0 right-2.5 flex pt-4 pr-2 -ml-8 sm:-ml-10 sm:pr-4">
          <OrbitLink
            className="flex items-center justify-center w-6 h-6 transition focus:outline-none hover:rotate-90"
            onClick={setNotificationAsRead}
          >
            <span className="sr-only">Close panel</span>
            <CloseIcon />
          </OrbitLink>
        </div>
        <div className="flex flex-col justify-center items-center">
          <div dangerouslySetInnerHTML={{ __html: currentNotification?.noteBody }} />
          <div className="font-bold">{currentNotification?.noteTitle}</div>
        </div>
      </div>
    </div>
  ) : (
    ""
  )
}

export default NotificationShow
