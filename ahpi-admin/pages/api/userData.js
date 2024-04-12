import { withSessionRoute } from "../../lib/withSession"

async function userData(request, response) {
  request.session.userData = request.body

  await request.session.save()
  response.send({ ok: true, data: request.body })
}

export default withSessionRoute(userData)
