import type { DefaultContext } from "./context"

export interface BaseData<Input> {
  input: Input
}

export interface BaseContext {
  readonly name: string
  readonly version: string
}

export type InputBuilder<
  Input,
  Context extends BaseContext = DefaultContext,
> = (context: Context) => Input

export type Runner<Input, Context extends BaseContext = DefaultContext> = (
  data: BaseData<Input>,
  context: Context
) => Promise<void>
