/* eslint-disable write-good-comments/write-good-comments */
import useTranslation from "next-translate/useTranslation"
import React from "react"
import { Tab, TabList, TabPanel, Tabs } from "react-tabs"
import useSearch from "shared/hook/useSerach"
import LayoutWrapper from "shared/wrapper/layoutWrapper"
import OrbitLoader from "widgets/loader"
import SearchInput from "widgets/searchInput"

import AllCourses from "./allCourses"
import AllCompletedCourses from "./completedCourses"
import useCourses from "./hook/useCourses"
import WishListTab from "./wishlist"

const MyLearning = ({ myLearning }) => {
  const {
    loading,
    activeTab,
    allCourseList,
    onPaginationChange,
    allCoursePaginate,
    wishlistLoading,
    setSearchValue,
    wishlist,
    wishListPaginate,
    onTabChange,
    value,
    setValue,
    completedList,
    completedListLoading,
    completedListPaginate,
    addToWishList,
  } = useCourses({ myLearning })

  const { onSearch } = useSearch({
    setSearchValue,
    setValue,
  })
  const { t } = useTranslation("common")
  return (
    <LayoutWrapper>
      <div className="container relative">
        {(loading || wishlistLoading || completedListLoading) && <OrbitLoader relative />}
        <h1 className="mt-9 mb-7 font-bold">{t("myLearning")}</h1>
        <Tabs selectedIndex={activeTab} onSelect={onTabChange}>
          <div className="lg:flex items-center justify-between">
            <TabList className="react-tabs__tab-list lg:m-0">
              <Tab>{t("AllCourses")}</Tab>
              <Tab>{t("Wishlist")}</Tab>
              <Tab>{t("completed")}</Tab>
            </TabList>
            <div className="sm:flex lg:flex-row-reverse grid items-center gap-3 lg:w-4/12 w-full">
              <SearchInput value={value} onChange={(e) => onSearch(e.target.value)} placeholder={t("SearchCourse")} />
              {/* <div className="flex items-center gap-3 min-w-[300px] w-[300px]">
                <p className="text-sm font-medium whitespace-nowrap">Sort by</p>
                <div className="lg:w-full">
                  <SingleSelect
                    value={filter}
                    onChangeSelect={(item) => setFilter(item)}
                    data={filterData}
                    placeholder="Recently Purchased"
                  />
                </div>
              </div> */}
            </div>
          </div>
          <TabPanel className="mt-6">
            {allCourseList.length > 0 ? (
              <AllCourses
                courses={allCourseList}
                paginate={allCoursePaginate}
                onPaginationChange={onPaginationChange}
              />
            ) : (
              <div className="flex justify-center">{t("NoData")}</div>
            )}
          </TabPanel>
          <TabPanel className="mt-6">
            {wishlist.length > 0 ? (
              <WishListTab
                addToWishList={addToWishList}
                courses={wishlist}
                paginate={wishListPaginate}
                onPaginationChange={onPaginationChange}
              />
            ) : (
              <div className="max-w-5xl mx-auto pt-4">
                <div className="flex justify-center">
                  <div className="flex flex-col">
                    <div className="">{t("wishlistText1")}</div>
                    <div className="">{t("wishlistText2")}</div>
                    <div className="">{t("wishlistText3")}</div>
                    <div className="">{t("wishlistText4")}</div>
                    <div className="">{t("wishlistText5")}</div>
                    <div className="">{t("wishlistText6")}</div>
                    <div className="">{t("wishlistText7")}</div>
                  </div>
                </div>
              </div>
            )}
          </TabPanel>
          <TabPanel className="mt-6 mb-6">
            {completedList.length > 0 ? (
              <AllCompletedCourses
                courses={completedList}
                paginate={completedListLoading}
                onPaginationChange={completedListPaginate}
              />
            ) : (
              <div className="flex justify-center">{t("NoData")}</div>
            )}
          </TabPanel>
        </Tabs>
      </div>
    </LayoutWrapper>
  )
}

export default MyLearning
