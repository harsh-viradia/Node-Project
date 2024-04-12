/* eslint-disable sonarjs/no-identical-expressions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
import { hasAccessOf } from "@knovator/can"
import AdminIcon from "icons/adminIcon"
import AnalyticsIcon from "icons/analytics"
import CartIcon from "icons/cartIcon"
import CertificateIcon from "icons/certificateIcon"
import CouponIcon from "icons/couponIcon"
import CourseIcon from "icons/courseIcon"
import DocumentIcon from "icons/documentIcon"
// eslint-disable-next-line no-unused-vars
import EarningIcon from "icons/earningIcon"
import InstructorIcon from "icons/instructorIcon"
import MasterIcon from "icons/masterIcon"
import NotificationIcon from "icons/notificationIcon"
import PageIcon from "icons/pageIcon"
import PayOutIcon from "icons/payOutIcon"
import ReviewIcon from "icons/reviewIcon"
import RightArrow from "icons/rightArrow"
import RolesIcon from "icons/rolesIcon"
import TransactionsIcon from "icons/transactionsIcon"
import UserManagementIcon from "icons/userManagementIcon"
import UsersIcon from "icons/usersIcon"
import WidgetIcon from "icons/widgetIcon"
import { useRouter } from "next/router"
import React, { useContext, useLayoutEffect } from "react"
import { Menu, MenuItem, ProSidebar, SidebarContent, SidebarFooter, SidebarHeader, SubMenu } from "react-pro-sidebar"
import AppContext from "utils/appContext"
import { MODULES, SYSTEM_USERS } from "utils/constant"
import { LocalStorage } from "utils/localStorage"
import routes from "utils/routes"
import { logout } from "utils/util"
import OrbitLink from "widgets/orbitLink"

// eslint-disable-next-line sonarjs/cognitive-complexity
const Sidebar = ({ permission = {}, user = {} }) => {
  const { collapsed, setCollapsed } = useContext(AppContext)
  const classes = ["collapsed"]
  const router = useRouter()
  // eslint-disable-next-line unicorn/consistent-function-scoping
  const sidebarAccess = (route) => {
    return hasAccessOf(permission, route)
  }

  const collapse = LocalStorage.get("skillsCollapsed")

  const handleCollapsedChange = () => {
    setCollapsed(!collapsed)
    LocalStorage.set("skillsCollapsed", !collapsed)
  }

  const isActive = (checkRoutes = []) => {
    return checkRoutes.includes(router.pathname)
  }

  useLayoutEffect(() => {
    const skillsCollapse = LocalStorage.get("skillsCollapsed")
    const side = document.querySelector("#pro-side")
    const logo = document.querySelector("#sidebar-logo")

    setCollapsed(skillsCollapse === "true")
    if (skillsCollapse === "true") {
      side.classList.add(...classes)
      if (!user?.instructorLogo) logo.setAttribute("src", "/images/logo-icon.png")
    } else {
      side.classList.remove(...classes)
      if (!user?.instructorLogo) logo.setAttribute("src", "/images/logo.png")
    }
  }, [collapsed])

  return (
    <ProSidebar id="pro-side" collapsed={collapsed} onToggle={handleCollapsedChange}>
      <SidebarHeader className="relative py-4 font-bold text-center text-white border-b border-gray-500 min-h-16">
        <OrbitLink href={routes.client}>
          <img src={user?.instructorLogo} id="sidebar-logo" className="h-11 mx-auto" alt="Skills logo" />
        </OrbitLink>
        <button
          type="button"
          onClick={handleCollapsedChange}
          className={` text-white absolute bg-dark-gray border-2 border-white h-6 w-6 rounded-full -right-3 top-2/4 -translate-y-2/4 flex items-center justify-center ${
            collapsed ? "rotate-0" : "rotate-180"
          }`}
        >
          <RightArrow />
        </button>
      </SidebarHeader>
      <SidebarContent>
        <Menu>
          <MenuItem icon={<UsersIcon size="18px" />} className={isActive([routes.dashboard]) ? "active" : ""}>
            <OrbitLink href={routes.dashboard}>Dashboard</OrbitLink>
          </MenuItem>
          {(sidebarAccess(MODULES.COURSE_ANALYTICS) || sidebarAccess(MODULES.CATEGORY_ANALYTICS)) && (
            <SubMenu
              icon={<AnalyticsIcon size="18px" />}
              title="Analytics"
              id="analytics"
              defaultOpen={
                collapse !== "true" &&
                isActive([routes.analytics, routes.categoryAnalytics, routes.instructorAnalytics])
                  ? "active"
                  : ""
              }
              className={
                isActive([routes.analytics, routes.categoryAnalytics, routes.instructorAnalytics]) ? "active" : ""
              }
            >
              {sidebarAccess(MODULES.COURSE_ANALYTICS) && (
                <MenuItem className={isActive([routes.analytics]) ? "active" : ""}>
                  <OrbitLink href={routes.analytics}>
                    {user?.role === SYSTEM_USERS.INSTRUCTOR ? "My Analytics" : "Course Analytics"}
                  </OrbitLink>
                </MenuItem>
              )}
              {sidebarAccess(MODULES.CATEGORY_ANALYTICS) && (
                <MenuItem className={isActive([routes.categoryAnalytics]) ? "active" : ""}>
                  <OrbitLink href={routes.categoryAnalytics}>Program Analytics</OrbitLink>
                </MenuItem>
              )}
              {/* {sidebarAccess(MODULES.INSTRUCTOR_ANALYTICS) && (
                <MenuItem className={isActive([routes.instructorAnalytics]) ? "active" : ""}>
                  <OrbitLink href={routes.instructorAnalytics}>
                    {user?.role === SYSTEM_USERS.INSTRUCTOR ? "My Analytics" : "Instructor Analytics"}
                  </OrbitLink>
                </MenuItem>
              )} */}
            </SubMenu>
          )}
          {user?.role === SYSTEM_USERS.INSTRUCTOR && sidebarAccess(MODULES.MY_EARNING) && (
            <MenuItem icon={<EarningIcon size="18px" />} className={isActive([routes.earning]) ? "active" : ""}>
              <OrbitLink href={routes.earning}>My Earning</OrbitLink>
            </MenuItem>
          )}
          {user?.role === SYSTEM_USERS.INSTRUCTOR && sidebarAccess(MODULES.PAYOUT) && (
            <MenuItem icon={<PayOutIcon size="18px" />} className={isActive([routes.payout]) ? "active" : ""}>
              <OrbitLink href={routes.payout}>Payout</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.LEARNER) && (
            <MenuItem icon={<UsersIcon size="18px" />} className={isActive([routes.learner]) ? "active" : ""}>
              <OrbitLink href={routes.learner}>Learner</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.INSTRUCTOR) && (
            <MenuItem
              icon={<InstructorIcon size="18px" />}
              title="Partners"
              className={isActive([routes.instructor]) ? "active" : ""}
            >
              <OrbitLink href={routes.instructor}>Partners</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.CATEGORY) && (
            <MenuItem icon={<DocumentIcon size="18px" />} className={isActive([routes.category]) ? "active" : ""}>
              <OrbitLink href={routes.category}>Programs</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.CERTIFICATE) && (
            <MenuItem icon={<CertificateIcon size="18px" />} className={isActive([routes.certificate]) ? "active" : ""}>
              <OrbitLink href={routes.certificate}>Certificate</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.COURSE) && (
            <MenuItem
              icon={<CourseIcon size="18px" />}
              className={isActive([routes.course, routes.addCourse, routes.editCourse]) ? "active" : ""}
            >
              <OrbitLink href={routes.course}>Courses</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.WIDGET) && (
            <MenuItem
              icon={<WidgetIcon size="18px" />}
              className={isActive([routes.widget, routes.addWidget]) ? "active" : ""}
            >
              <OrbitLink href={routes.widget}>Widgets</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.PAGE) && (
            <MenuItem icon={<PageIcon size="18px" />} className={isActive([routes.page]) ? "active" : ""}>
              <OrbitLink href={routes.page}>Page</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.ORDERS) && (
            <MenuItem icon={<CartIcon size="18px" />} className={isActive([routes.orders]) ? "active" : ""}>
              <OrbitLink href={routes.orders}>Orders</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.COUPON) && (
            <MenuItem icon={<CouponIcon size="18px" />} className={isActive([routes.coupon]) ? "active" : ""}>
              <OrbitLink href={routes.coupon}>Coupons</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.TRANSACTIONS) && (
            <MenuItem
              icon={<TransactionsIcon size="18px" />}
              className={isActive([routes.transactions]) ? "active" : ""}
            >
              <OrbitLink href={routes.transactions}>Transactions</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.REVIEWS) && (
            <MenuItem icon={<ReviewIcon size="18px" />} className={isActive([routes.reviews]) ? "active" : ""}>
              <OrbitLink href={routes.reviews}>Reviews</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.NOTIFICATION) && (
            <MenuItem
              icon={<NotificationIcon size="18px" />}
              className={isActive([routes.notificationManage]) ? "active" : ""}
            >
              <OrbitLink href={routes.notificationManage}>Notification Management</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.USER) && (
            <MenuItem icon={<UserManagementIcon size="18px" />} className={isActive([routes.users]) ? "active" : ""}>
              <OrbitLink href={routes.users}>Users</OrbitLink>
            </MenuItem>
          )}
          {sidebarAccess(MODULES.ROLE) && (
            <MenuItem icon={<RolesIcon size="18px" />} className={isActive([routes.roles]) ? "active" : ""}>
              <OrbitLink href={routes.roles}>Roles And Permissions</OrbitLink>
            </MenuItem>
          )}

          {user?.role !== SYSTEM_USERS.INSTRUCTOR &&
            (sidebarAccess(MODULES.MASTER) ||
              sidebarAccess(MODULES.COUNTRY) ||
              sidebarAccess(MODULES.PROVINCE) ||
              sidebarAccess(MODULES.CITY) ||
              sidebarAccess(MODULES.ZIPCODE)) && (
              <SubMenu
                icon={<MasterIcon size="18px" />}
                title="Admin"
                defaultOpen={
                  collapse !== "true" &&
                  isActive([
                    routes.master,
                    routes.submaster,
                    routes.country,
                    routes.province,
                    routes.city,
                    routes.zipCode,
                  ])
                    ? "active"
                    : ""
                }
                className={
                  isActive([
                    routes.master,
                    routes.submaster,
                    routes.country,
                    routes.province,
                    routes.city,
                    routes.zipCode,
                  ])
                    ? "active"
                    : ""
                }
              >
                {sidebarAccess(MODULES.MASTER) && (
                  <>
                    <MenuItem className={isActive([routes.master]) ? "active" : ""}>
                      <OrbitLink href={routes.master}>Masters</OrbitLink>
                    </MenuItem>
                    <MenuItem className={isActive([routes.submaster]) ? "active" : ""}>
                      <OrbitLink href={routes.submaster}>Sub Masters</OrbitLink>
                    </MenuItem>
                  </>
                )}
                {sidebarAccess(MODULES.COUNTRY) && (
                  <MenuItem className={isActive([routes.country]) ? "active" : ""}>
                    <OrbitLink href={routes.country}>Country</OrbitLink>
                  </MenuItem>
                )}
                {sidebarAccess(MODULES.PROVINCE) && (
                  <MenuItem className={isActive([routes.province]) ? "active" : ""}>
                    <OrbitLink href={routes.province}>State</OrbitLink>
                  </MenuItem>
                )}
                {sidebarAccess(MODULES.CITY) && (
                  <MenuItem className={isActive([routes.city]) ? "active" : ""}>
                    <OrbitLink href={routes.city}>City</OrbitLink>
                  </MenuItem>
                )}
                {sidebarAccess(MODULES.ZIPCODE) && (
                  <MenuItem className={isActive([routes.zipCode]) ? "active" : ""}>
                    <OrbitLink href={routes.zipCode}>Zip Code</OrbitLink>
                  </MenuItem>
                )}
              </SubMenu>
            )}
        </Menu>
      </SidebarContent>
      <SidebarFooter className="mt-auto">
        <Menu className="border-t border-gray-500">
          <SubMenu
            icon={<AdminIcon size="18px" />}
            title={user?.name}
            className={isActive([routes.profile]) ? "active" : ""}
          >
            <MenuItem className={isActive([routes.profile]) ? "active" : ""}>
              <OrbitLink href={routes.profile}>View Profile</OrbitLink>
            </MenuItem>
            <MenuItem onClick={logout}>Logout</MenuItem>
          </SubMenu>
        </Menu>
      </SidebarFooter>
    </ProSidebar>
  )
}

export default Sidebar
