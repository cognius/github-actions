import type { Runner } from "@utils/actions"
import type { Config } from "../app/types"

import { info } from "@actions/core"

const action: Runner<Config> = async (conf) => {
  info(`hello ${conf.name}`)
}

export default action
