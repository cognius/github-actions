import { ConvertError } from "./errors"
import type { BaseConverter } from "./types"

export const convert = <Output, Input>(
  data: Input,
  converter: BaseConverter<Input, Output>
): Output => {
  try {
    return converter.convert(data)
  } catch (err) {
    throw new ConvertError(data, converter.targetType, err as Error)
  }
}
