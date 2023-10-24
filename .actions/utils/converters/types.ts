export type Convert<Input, Output> = (input: Input) => Output

export interface BaseConverter<I, O> {
  readonly inputType: string
  readonly targetType: string
  convert: Convert<I, O>
}
