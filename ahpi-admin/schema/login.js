import { emailSchema, passwordSchema } from "./common"

// eslint-disable-next-line unicorn/prefer-spread
const loginSchema = passwordSchema.concat(emailSchema)

export default loginSchema
