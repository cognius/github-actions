import { convert, convertToString, type BaseConverter } from ".."

type Converter = BaseConverter<unknown, number>
type Convert = Converter["convert"]

class FloatConverter implements Converter {
  readonly inputType: string = "any"
  readonly targetType: string = "float"
  convert(value: unknown): number {
    const str = convertToString(value)
    const output = parseFloat(str)
    if (isFinite(output)) return output

    throw new Error(`${str} is not a float number`)
  }
}

export const toFloat: Converter = new FloatConverter()
export const convertToFloat: Convert = (input) => convert(input, toFloat)
