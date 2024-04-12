/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable sonarjs/cognitive-complexity */
/* eslint-disable react/no-unstable-nested-components */
// import ClockIcon from "icons/clockIcon"
// import CloseCircleIcon from "icons/closeCircleIcon"
// import VerifyIcon from "icons/verifyIcon"
import { useMemo } from "react"

const CategoryAnalyticsColumn = () => {
  const columns = useMemo(
    () => [
      {
        Header: "SL.No",
        accessor: "no",
        style: {
          width: 42,
          minWidth: 42,
        },
      },
      {
        Header: "Program Name",
        accessor: "_id",
      },
      {
        Header: "No Of Purchase",
        accessor: "totalSales",
      },
      {
        Header: "Price (INR)",
        accessor: "revenue",
      },
    ],
    []
  )
  return { columns }
}
export default CategoryAnalyticsColumn
