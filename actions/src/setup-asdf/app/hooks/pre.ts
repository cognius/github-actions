import type { ActionRunner } from "@utils/types/actions"
import type { SetupAsdfInput } from "../types"

import { downloadCache } from "@utils/caches"

import { cacheKey } from "../constants"

export const preAction: ActionRunner<SetupAsdfInput> = async ({ asdfDir }) => {
  await downloadCache(cacheKey, asdfDir)
}
