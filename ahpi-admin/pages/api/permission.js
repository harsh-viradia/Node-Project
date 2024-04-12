import { withSessionRoute } from "../../lib/withSession"

async function permission(request, response) {
  request.session.permission = request.body
  await request.session.save()
  response.send({ ok: true, permission: request.body })
}

export default withSessionRoute(permission)
