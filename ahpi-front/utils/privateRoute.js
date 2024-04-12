import { getCookie } from "cookies-next"
import routes from "utils/routes"

const privateRoute = () => {
  return ({ req, res }) => {
    const token = getCookie("token", { req, res })
    if (!token) {
      return {
        redirect: {
          destination: routes.home,
          permanent: false,
        },
      }
    }

    return {
      props: {},
    }
  }
}
export default privateRoute
