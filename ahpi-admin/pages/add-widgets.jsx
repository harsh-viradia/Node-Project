import AddWidgets from "components/WidgetsBuilder/AddWidget"
import React from "react"
import { MODULE_ACTIONS, MODULES } from "utils/constant"
import privateRoute from "utils/privateRoute"

const ApplicantIndex = ({ pageProps }) => {
  return <AddWidgets {...pageProps} />
}
export default ApplicantIndex
export const getServerSideProps = privateRoute({
  moduleName: MODULES.WIDGET,
  moduleActionName: MODULE_ACTIONS.CREATE,
})
