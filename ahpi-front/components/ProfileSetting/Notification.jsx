/* eslint-disable no-underscore-dangle */
import useTranslation from "next-translate/useTranslation"
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import routes from "utils/routes"
import { fullDateTimeFormat } from "utils/util"
import OrbitLoader from "widgets/loader"
import NotificationCard from "widgets/notificationCard"
import Paginate from "widgets/pagination"

import useNotification from "./hook/useNotification"
import ProfileSettingSidebar from "./profileSettingSidebar"

const getRedirectUrl = {
  GENERAL_NOTIFICATION_ALL: routes.home,
  SELECTED_USER: routes.home,
  WISHLIST: `${routes.myLearning}?tab=wishList`,
  CART: routes.cart,
  PREVIOUS_ORDER: routes.myLearning,
}
const Notification = ({ notificationList = {} }) => {
  const { list, loading, onPaginationChange, setNotificationAsRead, ...paginate } = useNotification({
    notificationList,
  })
  const { t } = useTranslation("notification")

  return (
    <LayoutWrapper>
      <div className="container lg:my-16 sm:my-12 my-9">
        <div className="grid grid-cols-12 gap-6">
          <div className="md:col-span-4 md:block hidden">
            <ProfileSettingSidebar />
          </div>
          <div className="md:col-span-8 col-span-12">
            <h2>{t("common:notiFy")}</h2>

            {loading && <OrbitLoader relative />}
            <div className="mt-6">
              {/* <h4>{t("newCourses")}</h4> */}
              {!loading && !list?.length ? (
                <div className="flex justify-center">{t("noRecordFound")}</div>
              ) : (
                <>
                  {!loading &&
                    list?.map((items = {}) => {
                      return (
                        <NotificationCard
                          id={items._id}
                          src={items.notificationId?.imgId?.uri || "/images/orbitLogo.png"}
                          title={items.notificationId?.title}
                          desc={items.notificationId?.desc}
                          time={fullDateTimeFormat(items.createdAt)}
                          href={getRedirectUrl[items.notificationId?.criteriaId?.code]}
                          setNotificationAsRead={setNotificationAsRead}
                        />
                      )
                    })}
                  {list?.length && paginate?.pageCount > 1 ? (
                    <div className="mt-5">
                      <Paginate paginate={paginate} onPaginationChange={onPaginationChange} />
                    </div>
                  ) : (
                    ""
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default Notification
