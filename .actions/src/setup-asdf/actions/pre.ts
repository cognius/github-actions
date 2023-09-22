import type { Runner } from "@utils/actions"
import type { Input } from "../app/types"

import { downloadCache } from "@utils/caches"

const action: Runner<Input> = async ({ cache, asdfDir }) => {
  await downloadCache(cache, asdfDir)
}

export default action
