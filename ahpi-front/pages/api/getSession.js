import { withSessionRoute } from "../../lib/withSession"

async function getSession(request, response) {
  await request.session.save()
  response.send({ ok: true, data: request.session.user })
}

export default withSessionRoute(getSession)
