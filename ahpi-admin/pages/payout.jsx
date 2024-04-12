import PauoutManage from "components/Instructor/payout"
import React from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const instructorManageIndex = ({ pageProps }) => {
  return <PauoutManage {...pageProps} />
}
export default instructorManageIndex
export const getServerSideProps = privateRoute({
  moduleName: MODULES.PAYOUT,
  moduleActionName: MODULE_ACTIONS.LIST,
})
