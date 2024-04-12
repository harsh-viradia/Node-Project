/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable no-underscore-dangle */
import commonApi from "api"
import { useRouter } from "next/router"
import { useState } from "react"
import { DEFAULT_LIMIT } from "utils/constant"
import Toast from "utils/toast"
import { addToUrl, capitalizeFirstLetter } from "utils/util"

const useAddInstructor = ({
  getList,
  closeModal,
  editId = {},
  limit,
  offset,
  watch,
  watch1,
  setCourseApproval,
  setFilter,
  searchValue,
  setSearchValue,
  filter,
  setFilterObject,
}) => {
  const router = useRouter()
  const [selectedImg, setSelectedImg] = useState()
  const [loading, setLoading] = useState(false)
  const onSubmit = async (values) => {
    if (!editId._id) {
      addToUrl("isActive")
      addToUrl("isCourse")
      addToUrl("isSearch")
      addToUrl("limit")
      router.replace(addToUrl("offset"))
    } else {
      addToUrl("isActive", filter?.isActive)
      addToUrl("isCourse", filter["agreement.isApproved"])
      addToUrl("isSearch", searchValue || router?.query?.isSearch)
      addToUrl("limit", limit)
      router.replace(addToUrl("offset", editId._id ? offset : 0))
    }

    const payload = {
      firstName: capitalizeFirstLetter(watch("firstName"))?.trim(),
      lastName: capitalizeFirstLetter(watch("lastName"))?.trim() || "",
      companyNm: watch("companyNm")?.trim() || "",
      countryCode: watch("countryCode"),
      allCat: watch1("allCat"),
      name: `${capitalizeFirstLetter(watch("firstName"))?.trim()} ${
        capitalizeFirstLetter(watch("lastName"))?.trim() || ""
      }`,
      email: watch("email").toLowerCase(),
      mobNo: watch("phone"),
      bio: watch("bio"),
      agreement: {
        category: watch1("category")?.length ? watch1("category").map((a) => a.value) : undefined,
        certificates: watch1("certificate")?.length ? watch1("certificate").map((a) => a.value) : undefined,
        courseLimit: watch1("course"),
        payedPercent: watch1("payoutPercentage"),
        isApproved: watch1("isApproved"),
      },
      bankDetails: {
        ...values,
      },
      profileId: selectedImg?.id || "",
      socialLinks: {
        fbLink: watch("fbLink") || undefined,
        instaLink: watch("instaLink") || undefined,
        linkedIn: watch("linkedIn") || undefined,
        websiteLink: watch("websiteLink") || undefined,
      },
    }
    try {
      setLoading(true)
      await commonApi({
        // eslint-disable-next-line no-underscore-dangle
        action: editId._id ? "update" : "create",
        // eslint-disable-next-line no-underscore-dangle
        parameters: [editId._id],
        module: "instructor",
        common: true,
        data: payload,
      }).then(async ([error, response]) => {
        if (error) {
          return
        }
        const { message = "" } = response
        Toast(message, "success")
        if (!editId._id) {
          setCourseApproval()
          setFilter()
          setFilterObject()
          setSearchValue("")
        }
        const filters = {
          ...filter,
        }
        if (!editId._id) {
          delete filters?.isActive
          delete filters["agreement.isApproved"]
        }
        getList({
          filter: {
            ...filters,
          },
          options: {
            limit: editId._id ? limit : DEFAULT_LIMIT,
            offset: editId._id ? offset : 0,
          },
          query: {
            search: editId._id ? searchValue || router?.query?.isSearch || "" : "",
            searchColumns: ["name", "email", "mobNo", "companyNm"],
          },
        })
        closeModal()
        // eslint-disable-next-line consistent-return
        return false
      })
    } finally {
      setLoading(false)
    }
  }
  return {
    onSubmit,
    selectedImg,
    setSelectedImg,
    loading,
  }
}

export default useAddInstructor
