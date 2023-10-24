import type { BaseContext, InputBuilder, Runner } from "./types"

import { deepMerge } from "@utils/objects"

class Actions<Input extends object, Context extends BaseContext> {
  static builder<Input extends object, Context extends BaseContext>(
    builder: InputBuilder<Input, Context>,
    context: Context
  ) {
    return new Actions(builder, context)
  }

  private constructor(
    private readonly builder: InputBuilder<Input, Context>,
    private readonly context: Context
  ) {}

  async exec(runner: Runner<Input, Context>, input?: Partial<Input>) {
    const base = this.builder(this.context)
    const data = {
      input: deepMerge(base, input),
    }

    await runner(data, this.context)
  }
}

export { Actions }
