import type { ActionRunner } from "@utils/types/actions"
import type { SetupAsdfInput } from "../types"

import { uploadCache } from "@utils/caches"

import { cacheKey } from "../constants"

export const postAction: ActionRunner<SetupAsdfInput> = async ({ asdfDir }) => {
  await uploadCache(cacheKey, asdfDir)
}
