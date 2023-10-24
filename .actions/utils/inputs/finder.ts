import { getInput, type InputOptions } from "@actions/core"
import { convert, type BaseConverter } from "@utils/converters"
import { findEnv } from "@utils/environments"

export const findInputs = <Output>(
  name: string,
  converter: BaseConverter<string, Output>,
  options: InputOptions = { required: false, trimWhitespace: true }
): Output | undefined => {
  return parseInputs(name, getInput(name, options), converter)
}

export const parseInputs = <Output>(
  name: string,
  data: string,
  converter: BaseConverter<string, Output>
) => {
  const env = findEnv(name)
  const input = env ?? data ?? ""
  return input === "" ? undefined : convert(input, converter)
}
