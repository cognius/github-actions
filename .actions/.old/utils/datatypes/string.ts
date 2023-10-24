import type { Converter } from "./types"
import { convert } from "./utils"

const toString: Converter<unknown, string> = {
  targetType: "string",
  fn(value) {
    if (typeof value === "string") return value
    else if (value === undefined) return "<undefined>"
    else if (value === null) return "<null>"
    else if (Array.isArray(value)) return `[${value.toString()}]`
    else if (typeof value === "object") return JSON.stringify(value)
    else if (typeof value === "symbol") return value.toString()
    else if (typeof value === "function") return `<Function ${value.name}>`
    else return `${value as string}`
  },
}

export const convertToString = (input: unknown): string => {
  return convert(input, toString)
}
