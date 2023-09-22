import type { Runner } from "@utils/actions"
import type { Input } from "../app/types"

import { uploadCache } from "@utils/caches"

const action: Runner<Input> = async ({ cache, asdfDir }) => {
  await uploadCache(cache, asdfDir)
}

export default action
