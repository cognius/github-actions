import type { ActionRunner } from "@utils/types/actions"

import { CacheKey, downloadCache } from "@utils/caches"

import type { SetupAsdfInput } from "../types"

export const preAction: ActionRunner<SetupAsdfInput> = async ({
  name,
  ref,
  asdfDir,
}) => {
  const cacheKey = CacheKey.builder(name).add(ref)
  await downloadCache(cacheKey, asdfDir)
}
