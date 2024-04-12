import { withSessionRoute } from "../../lib/withSession"

async function getSession(request, response) {
  //   await request.session.save()
  const data = JSON.parse(request.session.permission)
  response.send({ ok: true, permission: data })
}

export default withSessionRoute(getSession)
