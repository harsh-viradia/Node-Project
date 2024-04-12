import { withSessionRoute } from "../../lib/withSession"

async function logoutRoute(request, response) {
  request.session.token = request.body.token
  await request.session.destroy()
  response.send({ ok: true })
}

export default withSessionRoute(logoutRoute)
