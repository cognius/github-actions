import { convert, convertToString, type BaseConverter } from ".."

type Converter = BaseConverter<unknown, number>
type Convert = Converter["convert"]

class IntConverter implements Converter {
  readonly inputType: string = "any"
  readonly targetType: string = "int"
  convert(value: unknown): number {
    const str = convertToString(value)
    const output = parseInt(str, 10)
    if (isFinite(output)) return output

    throw new Error(`${str} is not an integer`)
  }
}

export const toInt: Converter = new IntConverter()
export const convertToInt: Convert = (input) => convert(input, toInt)
