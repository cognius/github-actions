import type { BaseContext, Builder, Runner } from "./types"
import type { DefaultContext } from "./context"

import { setFailed } from "@actions/core"
import { deepMerge } from "@utils/objects"

export class Actions<Input extends object, Context extends BaseContext> {
  static builder<
    Input extends object,
    Context extends BaseContext = DefaultContext,
  >(
    context: Context,
    builder: Builder<Input, Context>
  ): Actions<Input, Context> {
    return new Actions(context, builder)
  }

  private constructor(
    private readonly context: Context,
    private readonly builder: Builder<Input, Context>
  ) {}

  async exec(
    runner: Runner<Input, Context>,
    input?: Partial<Input>
  ): Promise<void> {
    try {
      const baseInput = this.builder(this.context)
      await runner(deepMerge<Input>(baseInput, input), this.context)
    } catch (err) {
      setFailed(err as Error)
    }
  }
}

export { DefaultContext } from "./context"
export type { BaseContext, Runner, Builder }
