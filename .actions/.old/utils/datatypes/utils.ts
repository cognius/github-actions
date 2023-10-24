import type { Converter } from "./types"
import { ConvertError } from "./errors"

export const convert = <I, O>(input: I, converter: Converter<I, O>): O => {
  try {
    return converter.fn(input)
  } catch (err) {
    throw new ConvertError(input, converter.targetType, err as Error)
  }
}
