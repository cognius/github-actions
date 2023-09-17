import type { Runner } from "@utils/actions"
import type { Config } from "../app/types"

import { downloadCache } from "@utils/caches"

const action: Runner<Config> = async ({ cache, asdfDir }) => {
  await downloadCache(cache, asdfDir)
}

export default action
