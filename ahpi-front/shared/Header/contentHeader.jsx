import BuyIcon from "icons/buyIcon"
import DownIcon from "icons/downicon"
import NotificationIcon from "icons/notificationIcon"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import handleLogout from "utils/common"
import routes from "utils/routes"
import getImgUrl from "utils/util"
import Button from "widgets/button"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"
import SearchSelectDropdown from "widgets/searchSelectDropDown"

import Category from "./categoryList"

const ContentHeader = ({ countData, userData = {}, loading, notificationCount }) => {
  const { t } = useTranslation("common")
  const router = useRouter()

  return (
    <div className="container flex items-center justify-between gap-6 py-4">
      <div className="flex items-center gap-6 ">
        <OrbitLink href={routes.home} className="flex w-28">
          <img src="/images/logo.png" height={56} alt="" loading="lazy" />
        </OrbitLink>
        <div className="relative menu group">
          <OrbitLink
            href="#"
            className="flex items-center gap-2 py-3 font-semibold transition-all group-hover:text-primary"
          >
            {t("Categories")}
            <div className="transition-all group-hover:rotate-180">
              <DownIcon />
            </div>
          </OrbitLink>
          <div className="absolute left-0 right-auto mx-auto top-full group-hover:block hidden z-[2] menu-hover pt-2.5">
            <span className="absolute h-3 w-3 border-t border-r border-primary-border transform -rotate-45 bg-white top-1 left-6 rounded-sm z-[2]" />
            <Category />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-end gap-4 w-full">
        <SearchSelectDropdown placeholder={t("whatLookingFor")} />
      </div>

      <div className="flex items-center justify-end gap-6">
        <OrbitLink href={routes.cart} className="relative group">
          <BuyIcon className="transition-all group-hover:text-primary" />
          {countData ? (
            <span className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full bg-primary -top-2 -right-3">
              {countData}
            </span>
          ) : (
            ""
          )}
        </OrbitLink>

        {loading && (
          <div className="group w-36 relative">
            <OrbitLoader relative />
          </div>
        )}
        {!loading && (
          <>
            {" "}
            {!userData?.email && (
              <>
                <Button
                  title={t("login")}
                  kind="primary"
                  hoverKind="white"
                  primaryShadowBTN
                  onClick={() => router.push(routes.login)}
                />
                <Button
                  title={t("signUp")}
                  kind="primary"
                  hoverKind="white"
                  outlineShadowBTN
                  onClick={() => router.push(routes.register)}
                />
              </>
            )}
            {userData?.email && (
              <>
                <div className="group">
                  <OrbitLink href={routes.notification} className="relative group">
                    <NotificationIcon className="transition-all group-hover:text-primary" />
                    {notificationCount ? (
                      <div
                        id="notification-count"
                        className="absolute flex items-center justify-center w-5 h-5 text-xs text-white rounded-full bg-primary -top-2 -right-3"
                      >
                        {notificationCount}
                      </div>
                    ) : (
                      ""
                    )}
                  </OrbitLink>
                </div>
                <div className="relative group">
                  {" "}
                  <OrbitLink>
                    <div className="relative w-10 h-10 mx-auto">
                      <img
                        src={userData?.profileId?.uri ? getImgUrl(userData?.profileId?.uri) : "/images/user.png"}
                        className="object-cover w-10 h-10 rounded-full"
                        alt=""
                        loading="lazy"
                      />
                    </div>
                  </OrbitLink>
                  <div className="absolute right-0 z-20 hidden pt-3 top-6 w-64 group-hover:block">
                    <div className="flex flex-col gap-1.5 w-full py-2 text-sm bg-white rounded-md border border-primary-border primary-shadow p-2">
                      <div className="px-3 py-2 rounded-md bg-primary/10 whitespace-nowrap overflow-hidden overflow-ellipsis ">
                        <OrbitLink>
                          {userData?.name ? <p className="font-semibold">{userData?.name}</p> : ""}
                          <span>{userData?.email}</span>
                        </OrbitLink>
                      </div>
                      <OrbitLink
                        href={routes.editProfile}
                        locale={router.locale}
                        className={
                          router.pathname === routes.editProfile
                            ? "text-primary py-0.5 block cursor-pointer px-3 hover:bg-gray hover:bg-opacity-10"
                            : "py-0.5 block cursor-pointer px-3 hover:bg-gray hover:bg-opacity-10"
                        }
                      >
                        {t("Profile")}
                      </OrbitLink>
                      <OrbitLink
                        href={routes.myLearning}
                        locale={router.locale}
                        className={
                          router.pathname === routes.myLearning
                            ? "text-primary py-0.5 block cursor-pointer px-3 hover:bg-gray hover:bg-opacity-10 "
                            : "py-0.5 block cursor-pointer px-3 hover:bg-gray hover:bg-opacity-10"
                        }
                      >
                        {t("myLearning")}
                      </OrbitLink>
                      <div className="my-1 border-t border-primary-border" />
                      <OrbitLink
                        onClick={handleLogout}
                        className="block px-3 py-0.5 cursor-pointer hover:bg-gray hover:bg-opacity-10"
                      >
                        {t("Logout")}
                      </OrbitLink>
                    </div>
                  </div>
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default ContentHeader
