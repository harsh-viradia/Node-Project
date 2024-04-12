import commonApi from "api/index"
import Notification from "components/ProfileSetting/Notification"
import { getCookie } from "cookies-next"
import React from "react"
import { DEFAULT_LIMIT } from "utils/constant"
import routes from "utils/routes"

const NotificationIndex = ({ notificationList }) => {
  return <Notification notificationList={JSON.parse(notificationList)} />
}

export default NotificationIndex
export async function getServerSideProps({ query, req, res, locale }) {
  const token = getCookie("token", { req, res })
  if (!token) {
    return {
      redirect: {
        destination: routes.home,
        permanent: false,
      },
    }
  }
  const [NotificationListData] = await Promise.all([
    commonApi({
      action: "generalNotification",
      config: {
        token,
        locale,
      },
      data: {
        query: {
          searchColumns: ["nm", "title", "desc"],
          search: "",
          isRead: false,
        },
        options: {
          populate: [
            {
              path: "notificationId",
              populate: { path: "criteriaId imgId", select: "name nm code uri" },
              select: "nm title desc",
            },
          ],
          limit: DEFAULT_LIMIT,
          page: query?.page || 1,
          sort: {
            createdAt: -1,
          },
        },
      },
    }),
  ])
  const [notificationList] = await Promise.all([JSON.stringify(NotificationListData?.[1]?.data || {})])
  return { props: { notificationList } }
}
