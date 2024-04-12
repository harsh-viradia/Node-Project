/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable sonarjs/no-duplicate-string */
/* eslint-disable sonarjs/no-nested-template-literals */
/* eslint-disable react/button-has-type */
import commonApi from "api/index"
import { getCookie, getCookies, hasCookie } from "cookies-next"
import NotificationIcon from "icons/notificationIcon"
import SmallRightIcon from "icons/smallRightIcon"
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
// import { Router } from "node_modules/next/router"
import React, { useContext, useEffect, useState } from "react"
import AppContext from "utils/AppContext"
import handleLogout from "utils/common"
// import { CACHE_KEY } from "utils/constant"
import routes from "utils/routes"
import { debounce } from "utils/util"
import SearchInput from "widgets/searchInput"

import BuyIcon from "../icons/buyIcon"
import CloseIcon from "../icons/closeIcon"
import MenuIcon from "../icons/menuIcon"
import SearchIcon from "../icons/searchIcon"
import Button from "../widgets/button"
import OrbitLink from "../widgets/orbitLink"
import CategoryContent from "./categoryContent"
import Content from "./content"
import ContentHeader from "./Header/contentHeader"
import useLoginWithOrbit from "./Header/hook/useLoginWithOrbit"
// import LanguageSwitcher from "./Header/languageSwitcher"
import MainContent from "./mainContent"

const Header = () => {
  const [menu, setMenu] = useState(false)
  const [search, setSearch] = useState(false)

  const [searchValue, setSearchValue] = useState()
  const [options, setOptions] = useState()
  const { t } = useTranslation("common")
  const router = useRouter()
  const { countData, setCountData, category, notificationCount, setNotificationCount, setCategory } =
    useContext(AppContext)
  const { userData = {}, loading } = useLoginWithOrbit()

  const checkCountAndCategories = async () => {
    const { fcmToken, deviceToken, token } = getCookies()
    if (!countData)
      await commonApi({ action: "cartCount", data: { deviceToken, fcmToken }, config: { token: router.query.token } })
        .then(([, { data }]) => {
          setCountData(data)
          return false
        })
        .catch(() => {})
    if (!notificationCount && (token || router.query.token))
      await commonApi({ action: "notificationCount", config: { token: router.query.token } })
        .then(([, { data }]) => {
          setNotificationCount(data)
          return false
        })
        .catch(() => {})
    if (!category?.length)
      await commonApi({
        action: "getCategory",
        data: {
          options: { select: ["name", "slug"], pagination: false },
        },
        config: { token: router.query.token },
      })
        .then(
          ([
            ,
            {
              data: { data = [] },
            },
          ]) => {
            setCategory(data)

            return false
          }
        )
        .catch(() => {})
  }
  useEffect(() => {
    checkCountAndCategories()
  }, [router.query])

  const OnClickLabel = (data) => {
    localStorage.setItem("title", JSON.stringify(data))
    router.push(
      `${routes.category}/${encodeURIComponent(data?.slug)}?name=${encodeURIComponent(
        data?.title
      )}&search=${encodeURIComponent(data?.title)}`
    )
    setSearchValue(data?.label)
    setSearch(false)
  }

  useEffect(() => {
    const title = localStorage.getItem("title")
    setSearchValue(title && JSON.parse(title)?.label)
    // getProfile()
  }, [])
  const loadOptions = debounce(async () => {
    const payload = {
      options: {
        page: 1,
        limit: 10,
        sort: {
          createdAt: -1,
        },
      },
      query: {
        searchColumns: ["title", "briefDesc"],
        search: searchValue,
        isActive: true,
      },
      saveSearch: true,
    }
    await commonApi({
      action: "getCategoryDetail",
      parameters: hasCookie("deviceToken") ? [getCookie("deviceToken")] : [],
      data: payload,
      config: { token: router.query.token },
    })
      .then(([, { data = {} }]) => {
        // eslint-disable-next-line no-underscore-dangle
        const listData = data.data?.map((a) => ({ ...a, value: a._id, label: a?.title }))
        setOptions(listData)
        return false
      })
      .catch(() => {})
  })
  useEffect(() => {
    if (search) loadOptions()
  }, [searchValue])
  const onKeyDown = (e) => {
    if (e?.keyCode === 13) {
      const searchData = {
        value: searchValue,
        label: searchValue,
      }
      localStorage.setItem("title", JSON.stringify(searchData))
      router.push(
        `${routes.category}/${encodeURIComponent(searchValue)}?name=${encodeURIComponent(
          searchValue
        )}&search=${encodeURIComponent(searchValue)}`
      )
      setSearch(false)
    }
  }
  const myAccountContent = [
    { name: t("learn"), heading: true },
    { name: t("myLearning"), href: routes.myLearning },
    { name: t("myWishList"), href: `${routes.myLearning}?tab=wishList` },
    { name: t("myCart"), href: routes.cart },
    { name: t("Account"), heading: true },
    { name: t("purchaseHistory"), href: routes.purchaseHistory },
    { name: t("yourAddresses"), href: routes.yourAddresses },
    { name: t("Notifications"), href: routes.notification },
    { name: t("Profile"), heading: true },
    { name: t("Logout"), onClick: () => handleLogout() },
  ]
  const collapseContent2 = [{ title: "Resources", content: [{ name: "About Us" }, { name: "Contact Us" }] }]
  return (
    <>
      <div className="sticky top-0 block lg:hidden header z-50 bg-white ">
        <div className="container grid grid-cols-3 py-5">
          <div className="flex items-center">
            <button type="button" onClick={() => setMenu(true)}>
              <MenuIcon />
            </button>
          </div>
          <OrbitLink href={routes.home} className="flex w-[77px] mx-auto">
            <img src="/images/logo.png" height={42} width={63} className="mx-auto" alt="" loading="lazy" />
          </OrbitLink>
          <div className="flex items-center justify-end gap-5">
            <button onClick={() => setSearch(true)}>
              <SearchIcon />
            </button>
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
            {!loading && userData?.email && (
              <div className="group">
                <OrbitLink href={routes.notification} className="relative group">
                  <NotificationIcon className="transition-all group-hover:text-primary" />
                  {notificationCount ? (
                    <div className="notification-count absolute flex items-center justify-center leading-none w-5 h-5 text-xs text-white rounded-full bg-primary">
                      {notificationCount}
                    </div>
                  ) : (
                    ""
                  )}
                </OrbitLink>
              </div>
            )}
          </div>
        </div>
        <div className="fixed top-0 z-10 overflow-auto lg:hidden">
          <div
            className={`bg-black ${
              menu ? "bg-opacity-70 fixed visible" : "bg-opacity-0 invisible"
            }  top-0 left-0 w-full h-screen transition z-10`}
          />
          <div
            className={`bg-white fixed top-0 w-11/12 sm:w-10/12 h-screen over ${
              menu ? "left-0" : "-left-[1000px]"
            } transition z-20`}
          >
            <div className="sticky top-0 flex items-center justify-between p-6 bg-white border-b border-primary-border">
              {!loading && !userData?.email && (
                <div className="flex items-center gap-4">
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
                </div>
              )}
              {!loading && userData?.email && (
                <OrbitLink href={routes.editProfile} className="flex items-center gap-6 gap">
                  <div className="text-xl font-bold">Hello, {userData?.firstName}</div>
                  <SmallRightIcon size={12} />
                </OrbitLink>
              )}
              <button
                type="button"
                onClick={() => setMenu(false)}
                className="absolute inline-flex items-center justify-center transition-all bg-white border-2 rounded-full -right-4 h-9 w-9 border-dark-gray hover:rotate-90"
              >
                <CloseIcon size="10px" />
              </button>
            </div>

            <div className="relative overflow-auto headerMenu-height">
              {!loading && userData?.email && (
                <div className="p-4">
                  <MainContent open x={<div className="text-xl font-bold">{t("myAccount")}</div>}>
                    <div className="mt-4">
                      <div className="grid gap-4">
                        {myAccountContent?.map((content = {}) => {
                          return (
                            <OrbitLink
                              {...content}
                              className={content?.heading ? "font-semibold" : "font-medium text-gray-500"}
                            >
                              {content.name}
                            </OrbitLink>
                          )
                        })}
                      </div>
                    </div>
                  </MainContent>
                </div>
              )}
              <div className="p-4">
                <MainContent
                  open={!loading && userData?.email}
                  x={<div className="text-xl font-bold">{t("categories")}</div>}
                >
                  <div className="mt-4">
                    <div className="grid gap-4">
                      {category?.length ? category?.map((x) => <CategoryContent x={x} />) : "No Data"}
                    </div>
                  </div>
                </MainContent>
              </div>
              {!loading && !userData?.email && (
                <div className="p-4">
                  <div className="text-xl font-bold">{t("moreFromLMS")}</div>
                  <div className="mt-4">
                    <div className="grid gap-4">
                      {collapseContent2?.map((x) => (
                        <Content x={x} />
                      ))}
                      <OrbitLink href="#" className="font-semibold">
                        {t("getTheApp")}
                      </OrbitLink>
                      <OrbitLink href="#" className="font-semibold">
                        {t("inviteFriends")}
                      </OrbitLink>
                      <OrbitLink href="#" className="font-semibold">
                        {t("help")}
                      </OrbitLink>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* <div className="mt-auto border-t p-3">
              <LanguageSwitcher />
            </div> */}
          </div>
        </div>
      </div>

      <div className="sticky top-0 z-50 bg-white hidden lg:block header">
        <ContentHeader
          userData={userData}
          loading={loading}
          countData={countData}
          notificationCount={notificationCount}
        />
      </div>
      {search && (
        <div className={`${`fixed top-0 left-0 z-10 w-full h-full bg-white transition lg:hidden overflow-y-scroll`}`}>
          <div className="flex items-center justify-between py-5 px-7 ">
            <div>
              <OrbitLink href={routes.home} className="-mt-2.5 h-[37px] w-[77px] mx-auto">
                <img src="/images/logo.png" height={42} width={63} className="mx-auto" alt="" loading="lazy" />
              </OrbitLink>
            </div>
            <button onClick={() => setSearch(false)}>
              <CloseIcon />
            </button>
          </div>
          <div className="py-3 overflow-y-scroll px-7">
            <SearchInput
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value)
              }}
              placeholder={t("whatLookingFor")}
              onKeyDown={onKeyDown}
            />
            <div className="mt-3">
              {/* {loader && <OrbitLoader relative />} */}
              {options?.length ? <p className="text-sm text-dark-gray">{t("lookingFor")}</p> : ""}
              <div className="flex flex-wrap gap-3 mt-3">
                {options?.length
                  ? options.map((opt) => {
                      return (
                        <Button
                          className="sm:text-base font-semibold sm:!py-3"
                          title={opt?.label}
                          kind="dark-gray"
                          hoverKind="white"
                          outline
                          onClick={() => OnClickLabel(opt)}
                        />
                      )
                    })
                  : ""}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Header
