import { withSessionRoute } from "../../lib/withSession"

async function loginRoute(request, response) {
  request.session.token = request.body.token
  request.session.user = request.body.user
  request.session.permission = request.body.permission

  await request.session.save()
  response.send({ ok: true, ...request.session })
}

export default withSessionRoute(loginRoute)
