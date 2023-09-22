import type { Runner } from "@utils/actions"
import type { Input } from "../app/types"

import { uploadCache } from "@utils/caches"

const action: Runner<Input> = async ({ cache, asdfDir }) => {
  if (cache.disable) return
  await uploadCache(cache.key, asdfDir)
}

export default action
