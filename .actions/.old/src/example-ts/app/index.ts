import type { Input } from "./types"

import { Actions, DefaultContext } from "@utils/actions"

export const context = new DefaultContext("example-ts", "v0.1.0-dev")
export default Actions.builder<Input>(context, () => ({ name: "example" }))
