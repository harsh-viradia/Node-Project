/* eslint-disable sonarjs/no-all-duplicated-branches */
/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/no-unknown-property */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable sonarjs/no-duplicate-string */

import useTranslation from "next-translate/useTranslation"
import React, { useState } from "react"
// import { capitalizeFirstLetter } from "utils/constant"
import routes from "utils/routes"
import { getLevel } from "utils/util"
import OrbitLoader from "widgets/loader"

import FilterIcon from "../../icons/filterIcon"
import Button from "../../widgets/button"
import OrbitLink from "../../widgets/orbitLink"
import Paginate from "../../widgets/pagination"
import SingleSelect from "../../widgets/searchSelect"
import SmallCard from "../../widgets/smallCard"
import FilterContent from "./FilterContent"
import FilterModal from "./FilterModal"
import FilterTag from "./FilterTag"
import useFilter from "./hook/useFilter"
import SearchErrorInfo from "./SearchErrorInfo"

const SearchedResultContent = ({ relatedSearches = false, courseList, title }) => {
  const [open, setOpen] = useState(false)
  const { t } = useTranslation("common")
  const {
    paginate,
    filterList,
    onChange,
    onPaginationChange,
    courseData,
    selectOption,
    checked,
    handleCheck,
    selectId,
    loading,
    isSetData,
    onChangeSelect,
    defaultValue,
    options,
  } = useFilter({
    courseList,
  })

  const categoriesList = [
    { title: "Design" },
    { title: "Development" },
    { title: "Marketing" },
    { title: "IT and Software" },
    { title: "Personal Development" },
    { title: "Music" },
    { title: "Business" },
    { title: "Photography" },
  ]

  // eslint-disable-next-line no-unused-vars
  const courseContent = Object.entries(filterList)?.map(([key, val]) => {
    if (val[0]?.names) {
      return {
        name: val[0]?.names,
        description: val,
      }
    }

    return {
      name: { en: "Price range", id: "kisaran harga" },
      description: val,
    }
  })

  return (
    <>
      {courseData?.length === 0 && !selectOption?.length > 0 && !isSetData ? (
        <SearchErrorInfo title={decodeURIComponent(title)} />
      ) : (
        <>
          <h2 className="font-bold">
            {`${paginate?.itemCount || 0} ${t("resultsFor")}`}&nbsp;
            <OrbitLink className="text-primary">{decodeURIComponent(title)}</OrbitLink>
          </h2>
          <div className="grid grid-cols-12 gap-6 mt-6 ">
            <div className="hidden lg:col-span-4 md:col-span-5 md:block">
              <div className="border rounded-lg border-light-gray">
                <div className="p-6 border-b border-light-gray">
                  <div className="flex items-center justify-between w-full">
                    <h3 className="font-bold">Filter</h3>
                    <OrbitLink href="#" className="text-sm underline text-primary" onClick={handleCheck}>
                      {t("clearFilter")}
                    </OrbitLink>
                  </div>
                  <div>
                    <div className="flex-wrap items-center hidden w-full gap-2 mt-1 md:flex">
                      {selectOption?.length > 0 ? selectOption?.map((x) => <FilterTag lablel={x?.name || x} />) : ""}
                    </div>
                  </div>
                </div>
                {courseContent?.map((x) =>
                  x?.description?.length ? (
                    <FilterContent content={x} onChange={onChange} checked={checked} selectId={selectId} />
                  ) : (
                    ""
                  )
                )}
              </div>
            </div>
            <div className="col-span-12 lg:col-span-8 md:col-span-7">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
                <button
                  type="button"
                  onClick={() => {
                    setOpen(true)
                    handleCheck()
                  }}
                  className="flex items-center gap-2 p-3 text-sm border rounded-lg border-light-gray text-dark-gray md:hidden "
                >
                  <FilterIcon size="20px" />
                  {t("filTer")}
                </button>
                <div className="flex items-center justify-end gap-3">
                  <p className="text-sm font-medium">{t("sortBy")}</p>
                  <SingleSelect
                    topClass="w-60"
                    placeholder="Most Reviewed"
                    data={options}
                    onChangeSelect={onChangeSelect}
                    value={options?.find((d) => d.value === defaultValue.value)}
                  />
                </div>
              </div>
              <div className="relative">
                {loading && <OrbitLoader relative />}
                {courseData?.length ? (
                  courseData?.map((x) => {
                    return (
                      <OrbitLink href={`${routes.courseDetail}/${x?.slug}`}>
                        <SmallCard
                          src={x?.imgId?.uri}
                          title={x?.title}
                          category={x?.parCategory?.[0]?.name}
                          price={x?.price?.sellPrice}
                          originalPrice={x?.price?.MRP}
                          reviews={x?.avgStars}
                          totalReviews={x?.totalReviews}
                          level={getLevel(x?.levelId?.name, x?.levelId?.code, false)}
                          lecture={x?.lang?.name}
                          totalLength={`${x?.totalLessons || 0} ${t("eleMents")}`}
                          parSlug={x?.parCategory?.[0]?.slug}
                          badge={x?.badgeId?.name || ""}
                        />
                      </OrbitLink>
                    )
                  })
                ) : (
                  <div className="flex justify-center">{t("NoData")}</div>
                )}
              </div>
              {courseData?.length ? (
                <div className="mt-5">
                  <Paginate paginate={paginate} onPaginationChange={onPaginationChange} />
                </div>
              ) : (
                ""
              )}
              {relatedSearches && (
                <div className="mt-8">
                  <h2 className="mb-4 font-bold">{t("relatedTopics")}</h2>
                  <div className="sm:!grid flex flex-wrap lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4">
                    {categoriesList.map((items) => (
                      <Button
                        className="sm:text-base font-semibold sm:!py-3"
                        title={items.title}
                        kind="thin-gray"
                        hoverKind="white"
                        outline
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}
      <FilterModal
        open={open}
        setOpen={setOpen}
        courseContent={courseContent}
        onChange={onChange}
        checked={checked}
        selectId={selectId}
        handleCheck={handleCheck}
      />
    </>
  )
}

export default SearchedResultContent
