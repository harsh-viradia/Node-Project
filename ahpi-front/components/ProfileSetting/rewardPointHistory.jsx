import useTranslation from "next-translate/useTranslation"
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import { fullDateTimeFormat } from "utils/util"
import OrbitLoader from "widgets/loader"
import Paginate from "widgets/pagination"
import RewardPointCard from "widgets/rewardPointCard"

import useRewardHistory from "./hook/useRewardHistory"
import ProfileSettingSidebar from "./profileSettingSidebar"

const RewardPointsHistory = ({ listData, userRewardPoints }) => {
  const { t } = useTranslation("rewardPoints")
  const { list, loading, onPaginationChange, ...paginate } = useRewardHistory({ listData })

  return (
    <LayoutWrapper>
      <div className="container lg:my-16 sm:my-12 my-9">
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden md:col-span-4 md:block">
            <ProfileSettingSidebar />
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center relative">
              <h2>{t("rewardPointsHistory")}</h2>
              <p className="text-sm text-dark-gray">
                {t("availableBalance")} : {userRewardPoints} {t("points")}
              </p>
            </div>
            {loading && <OrbitLoader relative />}
            <div className="mt-6">
              {!loading && !list?.length ? (
                <div className="flex flex-col justify-center h-48 items-center">{t("noRecordFound")}</div>
              ) : (
                <>
                  {!loading &&
                    list?.map((data) => (
                      <RewardPointCard
                        time={fullDateTimeFormat(data.createdAt)}
                        orderId={data.orderNo}
                        earnedRewardsForOrder={data.earnedRewardsForOrder}
                        usedRewardsForOrder={data.usedRewardsForOrder}
                      />
                    ))}

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

export default RewardPointsHistory
