import type { Runner } from "@utils/actions"
import type { Config } from "../app/types"

import { uploadCache } from "@utils/caches"

const action: Runner<Config> = async ({ cache, asdfDir }) => {
  await uploadCache(cache, asdfDir)
}

export default action
