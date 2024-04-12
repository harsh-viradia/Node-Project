import { withSessionRoute } from "../../lib/withSession"

async function updateUserData(request, response) {
  request.session.user = request.body

  await request.session.save()
  response.send({ ok: true, data: request.body })
}

export default withSessionRoute(updateUserData)
