/* eslint-disable write-good-comments/write-good-comments */
/* eslint-disable sonarjs/no-duplicate-string */
import { useRouter } from "next/router"
import useTranslation from "next-translate/useTranslation"
import React from "react"
import handleLogout from "utils/common"
import routes from "utils/routes"
import OrbitLink from "widgets/orbitLink"

const ProfileSettingSidebar = () => {
  const router = useRouter()
  const { t } = useTranslation("common")
  return (
    <div className="sticky h-auto p-6 border rounded-lg border-primary-border top-28">
      {/* <div className="grid gap-2">
        <p className="font-semibold">{t("Account")}</p>
        <div className="grid grid-cols-1 gap-2.5 mt-2">
         <OrbitLink
            href={routes.changePassword}
            className={` transition block ${
              router.pathname === routes.changePassword ? "text-primary" : "text-dark-gray hover:text-primary"
            }`}
          >
            {t("ChangePassword")}
          </OrbitLink> 
        </div>
      </div> */}

      <div className="grid gap-2">
        <p className="font-semibold">{t("Account")}</p>
        <OrbitLink
          href={routes.editProfile}
          className={` transition block ${
            router.pathname === routes.editProfile ? "text-primary" : "text-dark-gray hover:text-primary"
          }`}
        >
          {t("Profile")}
        </OrbitLink>
        <OrbitLink
          href={routes.yourAddresses}
          className={` transition block ${
            router.pathname === routes.yourAddresses || router.pathname === routes.addAddress
              ? "text-primary"
              : "text-dark-gray hover:text-primary"
          }`}
        >
          {t("yourAddresses")}
        </OrbitLink>
        <OrbitLink
          href={routes.purchaseHistory}
          className={` transition block ${
            router.pathname === routes.purchaseHistory ? "text-primary" : "text-dark-gray hover:text-primary"
          }`}
        >
          {t("purchaseHistory")}
        </OrbitLink>
        <OrbitLink
          href={routes.rewardPointsHistory}
          className={` transition block ${
            router.pathname === routes.rewardPointsHistory ? "text-primary" : "text-dark-gray hover:text-primary"
          }`}
        >
          {t("rewardPointsHistory")}
        </OrbitLink>
        <OrbitLink
          href={routes.notification}
          className={` transition block ${
            router.pathname === routes.notification ? "text-primary" : "text-dark-gray hover:text-primary"
          }`}
        >
          {t("Notifications")}
        </OrbitLink>
        <OrbitLink
          href={routes.changePassword}
          className={` transition block ${
            router.pathname === routes.changePassword ? "text-primary" : "text-dark-gray hover:text-primary"
          }`}
        >
          {t("ChangePassword")}
        </OrbitLink>
      </div>
      <div className="grid mt-6 ga5p-2">
        <OrbitLink className="block font-bold transition text-dark-gray hover:text-primary" onClick={handleLogout}>
          {t("Logout")}
        </OrbitLink>
      </div>
    </div>
  )
}

export default ProfileSettingSidebar
