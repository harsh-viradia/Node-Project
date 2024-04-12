/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable prettier/prettier */
/* eslint-disable no-underscore-dangle */
/* eslint-disable prettier/prettier */
/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-vars */
/* eslint-disable prettier/prettier */
import { hasAccessTo } from "@knovator/can"
import commonApi from "api"
import React, { useEffect, useState } from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"

/* eslint-disable prettier/prettier */
const userAddress = (original, permission) => {
  const [loading, setLoading] = useState(false)
  const [addressDetail, setaddressDetail] = useState([])
  const isAllow = (key) => hasAccessTo(permission, MODULES.Address, key)
  const getAddress = async () => {
    const payload = {
      options: {
        pagination: false,
      },
      query: { userId: original?._id },
    }
    try {
      setLoading(true)
      await commonApi({
        action: "getAddress",
        data: payload,
      }).then(([, data]) => setaddressDetail(data.data))
    } finally {
      setLoading(false)
    }
  }
  useEffect(() => {
    if (isAllow(MODULE_ACTIONS.GETALL)) getAddress()
  }, [original?._id])
  return {
    addressDetail,
    loading,
  }
}

export default userAddress
