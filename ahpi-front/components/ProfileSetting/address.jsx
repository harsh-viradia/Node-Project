/* eslint-disable no-underscore-dangle */
import * as amplitude from "@amplitude/analytics-browser"
import AddIcon from "icons/addIcon"
import useTranslation from "next-translate/useTranslation"
import React, { useContext } from "react"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import AppContext from "utils/AppContext"
import { ANALYTICS_EVENT } from "utils/constant"
import routes from "utils/routes"
import OrbitLoader from "widgets/loader"
import OrbitLink from "widgets/orbitLink"
import Paginate from "widgets/pagination"

import useAddress from "./hook/useAddress"
import ProfileSettingSidebar from "./profileSettingSidebar"

const Address = ({ addressData }) => {
  const { list, loading, onPaginationChange, setAsDefault, removeAddress, ...paginate } = useAddress({ addressData })
  const { userData } = useContext(AppContext)

  const { t } = useTranslation("address")

  return (
    <LayoutWrapper>
      <div className="container lg:my-16 sm:my-12 my-9">
        <div className="grid grid-cols-12 gap-6">
          <div className="hidden md:col-span-4 md:block">
            <ProfileSettingSidebar />
          </div>
          <div className="col-span-12 md:col-span-8">
            <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-center relative">
              <h2>{t("common:yourAddresses")}</h2>

              {loading && <OrbitLoader relative />}
            </div>
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 sm:grid-cols-2 gap-4">
              <OrbitLink
                href={routes.addAddress}
                className="cursor-pointer min-h-[200px] flex flex-col justify-center border rounded-lg border-gray-300 border-dashed items-center "
              >
                <AddIcon className="text-gray-300 w-12 h-12" />
                <div className="font-bold text-2xl text-dark-gray mt-1">{t("addAddress")}</div>
              </OrbitLink>
              {!loading &&
                list?.map((data) => {
                  return (
                    <div className="flex min-h-[200px] flex-col flex-1 border rounded-lg border-gray-300">
                      {data.isDefault && <div className="p-3 bg-gray-300 font-bold  rounded-t-lg">{t("default")}</div>}
                      <div className="flex flex-col p-5">
                        <p> {data.addrLine1}</p>
                        <p> {data.addrLine2}</p>
                        <p>{`${data.cityNm}, ${data.zipcode}`}</p>
                        <p>{data.stateNm}</p>
                        <p>{data.countryNm}</p>
                      </div>
                      {!data.isDefault && (
                        <div className="pl-5 flex gap-3 mt-auto mb-5">
                          <OrbitLink
                            href={`${routes.addAddress}?id=${data._id}&page=${paginate?.currentPage}`}
                            className="text-primary hover:text-red"
                          >
                            {t("edit")}
                          </OrbitLink>
                          |
                          <OrbitLink
                            onClick={() => {
                              removeAddress(data._id)
                              amplitude.track(ANALYTICS_EVENT.REMOVE_ADDRESS, {
                                userEmail: userData?.email,
                                userId: userData?.id,
                                addressId: data?._id,
                              })
                            }}
                            className="text-primary hover:text-red"
                          >
                            {t("remove")}
                          </OrbitLink>
                          |
                          <OrbitLink
                            onClick={() => {
                              setAsDefault(data._id)
                              amplitude.track(ANALYTICS_EVENT.DEFAULT_ADDESS, {
                                userEmail: userData?.email,
                                userId: userData?.id,
                                addressId: data._id,
                              })
                            }}
                            className="text-primary hover:text-red"
                          >
                            {t("setAsDefault")}
                          </OrbitLink>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>

            {list?.length ? (
              <div className="mt-5">
                <Paginate paginate={paginate} onPaginationChange={onPaginationChange} />
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </div>
    </LayoutWrapper>
  )
}

export default Address
