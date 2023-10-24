import type { Input } from "./types"

import { Actions, DefaultContext, type InputBuilder } from "@utils/actions"

export const context = new DefaultContext("example-ts", "v0.1.0-dev")
export const builder: InputBuilder<Input> = () => {
  return {
    name: "example",
  }
}

export default Actions.builder(builder, context)
