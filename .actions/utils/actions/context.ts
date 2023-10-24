import type { getInput as GetInput } from "@actions/core"
import type { BaseConverter } from "@utils/converters"
import type { BaseContext } from "./types"

// import { parseInputs } from "@utils/inputs"

type PrimitiveType = string | number | boolean

export class DefaultContext implements BaseContext {
  constructor(
    readonly name: string,
    readonly version: string
  ) {}

  /**
   * formatting string. The formatting should be 'hello {world}'
   *
   * @param format format message
   * @param data message data
   */
  format(
    format: string,
    ...data: Array<Record<string, PrimitiveType> | PrimitiveType>
  ): string {
    let output = format
    if (data.length > 0) {
      const t = typeof data[0]

      if (t === "string" || t === "number" || t === "boolean") {
        const array = data as PrimitiveType[]
        return array.reduce<string>((prev, current, index) => {
          return prev.replace(
            new RegExp(`\\{${index}\\}`, "gi"),
            current.toString()
          )
        }, output)
      } else {
        const args = data[0] as Record<string, PrimitiveType>
        for (const key in args) {
          const value = args[key]
          output = output.replace(
            new RegExp(`\\{${key}\\}`, "gi"),
            value.toString()
          )
        }
      }
    }

    return output
  }

  // input<Output>(
  //   getInput: typeof GetInput,
  //   name: string,
  //   converter: BaseConverter<string, Output>
  // ) {
  //   const data = getInput(name, { required: false, trimWhitespace: true })
  //   return parseInputs(name, data, converter)
  // }
}
