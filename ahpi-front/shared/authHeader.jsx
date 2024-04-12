import DownIcon from "icons/downicon"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"
import SearchSelectDropdown from "widgets/searchSelectDropDown"

import Category from "./Header/categoryList"

const AuthHeader = () => {
  const { t } = useTranslation("common")

  return (
    <div className="sticky top-0 z-50 bg-white hidden lg:block header">
      <div className="container flex items-center justify-between gap-6 py-4 ">
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
      </div>
    </div>
  )
}

export default AuthHeader
