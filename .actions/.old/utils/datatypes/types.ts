export interface Converter<I, O> {
  targetType: string

  fn: (value: I) => O
}
