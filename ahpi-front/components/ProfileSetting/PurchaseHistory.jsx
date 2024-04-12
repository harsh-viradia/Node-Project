import useTranslation from "next-translate/useTranslation"
// import { useRouter } from "node_modules/next/router"
import React from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import routes from "utils/routes"
import { dateDisplay, fullDateTimeFormat } from "utils/util"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"
import Paginate from "widgets/pagination"
import PurchaseHistoryCard from "widgets/purchaseHistoryCard"

import usePurchaseHistory from "./hook/usePurchaseHistory"
import ProfileSettingSidebar from "./profileSettingSidebar"

const PurchaseHistory = ({ orderData }) => {
  const { list, loading, onPaginationChange, ...paginate } = usePurchaseHistory({ orderData })
  // const { locale } = useRouter()
  const { t } = useTranslation("purchaseHistory")

  return (
    <LayoutWrapper>
      <div className="container lg:my-16 sm:my-12 my-9">
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden md:col-span-4 md:block">
            <ProfileSettingSidebar />
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center relative">
              <h2>{t("purchaseHistory")}</h2>

              {loading && <OrbitLoader relative />}

              {!loading && paginate?.itemCount > 0 && (
                <p className="text-sm text-dark-gray">
                  {paginate?.itemCount} {t("OrderPlaced")}
                </p>
              )}
            </div>
            {!loading && !list?.length ? (
              <div className="flex flex-col justify-center h-48 items-center">{t("noRecordFound")}</div>
            ) : (
              <>
                {!loading &&
                  list?.map((data) => (
                    <div className="mt-6 border rounded-lg border-primary-border">
                      <div className="p-4 border-b border-primary-border">
                        <div className="flex flex-col flex-wrap items-center justify-between gap-4 xl:flex-row">
                          <div className="flex flex-col w-full gap-3 xl:flex-row xl:items-center xl:w-auto xl:gap-9">
                            <div className="flex justify-between xl:block">
                              <p className="text-sm text-dark-gray">{t("orderOn")}</p>
                              <p className="font-medium">{dateDisplay(data?.createdAt)}</p>
                            </div>
                            <div className="flex justify-between xl:block">
                              <p className="text-sm text-dark-gray">{t("total")}</p>
                              <p className="font-medium">₹ {data?.grandTotal < 0 ? 0 : data?.grandTotal}</p>
                            </div>
                            <div className="flex justify-between xl:block">
                              <p className="text-sm text-dark-gray">{t("orderId")}</p>
                              <p className="font-medium">{data?.orderNo}</p>
                            </div>
                          </div>
                          <div>
                            <OrbitLink
                              href={data.receiptId?.uri}
                              target="_blank"
                              className="text-sm font-medium underline transition text-primary hover:text-black"
                            >
                              {t("DownloadInvoice")}
                            </OrbitLink>
                          </div>
                        </div>
                      </div>
                      {data?.courses?.map((detail) => (
                        <div className="p-4">
                          <PurchaseHistoryCard
                            src={detail?.courseId?.imgId?.uri}
                            category={detail?.courseId?.parCategory?.map((item) => item?.name) || []}
                            title={detail?.courseId?.title}
                            price={detail?.price}
                            lecture={`${detail?.courseId?.totalLessons || 0} ${t("eleMents")}`}
                            // totalLength="156h total length"
                            // level={getLevel(
                            // locale === "en"
                            //   ? detail?.courseId?.levelId?.names?.en
                            //   : detail?.courseId?.levelId?.names?.id,
                            //   detail?.courseId?.levelId?.name,
                            //   detail?.courseId?.levelId?.code,
                            //   false
                            //   client requirements that level not be display
                            // )}
                            dateTime={fullDateTimeFormat(data?.createdAt)}
                            review={false}
                            tag={false}
                            href={`${routes.courseDetail}/${detail?.courseId?.slug}`}
                          />
                        </div>
                      ))}
                    </div>
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
    </LayoutWrapper>
  )
}

export default PurchaseHistory
