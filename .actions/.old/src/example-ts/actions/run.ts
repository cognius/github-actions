import type { Runner } from "@utils/actions"
import type { Input } from "../app/types"

import { info } from "@actions/core"

const action: Runner<Input> = async (input) => {
  info(`hello ${input.name}`)
}

export default action
