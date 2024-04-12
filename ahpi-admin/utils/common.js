import { deleteCookie } from "cookies-next"

const handleLogout = async () => {
  const response = await fetch("/api/logout", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  })
  if (response.ok) {
    deleteCookie("orbit-skills-admin")
    return window.location.reload()
  }
  return false
}

export default handleLogout
