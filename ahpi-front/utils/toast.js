import toast from "react-hot-toast"
// Component to show notification
/**
 *
 *
 * @param {*} message
 * @param {string} [type="success"]
 * @param {*} [config={}]
 */

const Toast = (message, type = "success", config = {}) =>
  toast[type](message, {
    duration: 2000,
    position: "top-right",
    style: { borderRadius: "8px", minWidth: "250px" },
    className: "",
    ...config,
  })

export default Toast
