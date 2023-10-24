import type { Converter } from "./types"

import { convert } from "./utils"
import { convertToString } from "./string"

const toInt: Converter<unknown, number> = {
  targetType: "integer",
  fn(value) {
    const str = convertToString(value)
    const num = parseInt(str, 10)
    if (isFinite(num)) return num
    else throw new Error(`${str} is not a number`)
  },
}

export const convertToInt = (input: unknown): number => {
  return convert(input, toInt)
}
