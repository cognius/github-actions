import { convert, convertToString, type BaseConverter } from ".."

type Converter = BaseConverter<unknown, boolean>
type Convert = Converter["convert"]

const possibleTrue: string[] = ["true", "t", "1", "on"]
const possibleFalse: string[] = ["false", "f", "0", "off"]

class BooleanConverter implements Converter {
  readonly inputType: string = "any"
  readonly targetType: string = "boolean"
  convert(value: unknown): boolean {
    const str = convertToString(value).toLowerCase()
    if (possibleTrue.includes(str)) return true
    if (possibleFalse.includes(str)) return false
    throw new Error(`${str} is not a boolean`)
  }
}

export const toBool: Converter = new BooleanConverter()
export const convertToBool: Convert = (input) => convert(input, toBool)
