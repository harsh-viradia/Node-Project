import useTranslation from "next-translate/useTranslation"
import React from "react"
import routes from "utils/routes"

import OrbitLink from "./orbitLink"

const RewardPointCard = ({ time, earnedRewardsForOrder, usedRewardsForOrder, orderId }) => {
  const { t } = useTranslation("rewardPoints")
  return (
    <div className="p-4 border-b border-primary-border">
      <div className="flex flex-col flex-wrap items-center justify-between gap-4 xl:flex-row">
        <div className="flex flex-col w-full gap-3 xl:flex-row xl:items-center xl:w-auto xl:gap-9">
          <div className="flex justify-between xl:block">
            <p className="text-sm text-dark-gray">{t("orderId")}</p>
            <OrbitLink
              href={`${routes.purchaseHistory}?orderNo=${orderId}`}
              className="font-medium text-primary cursor-pointer"
            >
              {orderId}
            </OrbitLink>
          </div>
          <div className="flex justify-between xl:block">
            <p className="text-sm text-dark-gray">{t("orderOn")}</p>
            <p className="font-medium">{`${time}`}</p>
          </div>
          <div className="flex justify-between xl:block">
            <p className="text-sm text-dark-gray">{t("usedForOrder")}</p>
            <p className="font-medium text-red">{usedRewardsForOrder ? `- ${usedRewardsForOrder}` : 0}</p>
          </div>
          <div className="flex justify-between xl:block">
            <p className="text-sm text-dark-gray">{t("earnedOnOrder")}</p>
            <p className="font-medium text-green">{earnedRewardsForOrder ? `+ ${earnedRewardsForOrder}` : 0}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RewardPointCard
