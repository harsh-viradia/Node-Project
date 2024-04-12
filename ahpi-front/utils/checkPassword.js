import { REGEX } from "./regex"

const checkPassword = (password) => {
  const results = {
    numberCharacter: false,
    upperAndLower: false,
    numberAndSymbol: false,
  }

  if (REGEX.EIGHTCHAR.test(password)) {
    results.numberCharacter = true
  }

  if (REGEX.UPPER_LOWER.test(password)) {
    results.upperAndLower = true
  }

  if (REGEX.NUMBER_SPECIALCHAR.test(password)) {
    results.numberAndSymbol = true
  }

  return results
}

export default checkPassword
