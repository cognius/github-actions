import type { DefaultContext } from "./context"

export interface BaseContext {
  readonly name: string
  readonly version: string
}

export type Builder<T, Context extends BaseContext = DefaultContext> = (
  context: Context
) => T

export type Runner<Input, Context extends BaseContext = DefaultContext> = (
  input: Input,
  context: Context
) => Promise<void>
