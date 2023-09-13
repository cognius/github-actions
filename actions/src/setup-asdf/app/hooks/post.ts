import type { ActionRunner } from "@utils/types/actions"

import { CacheKey, uploadCache } from "@utils/caches"

import type { SetupAsdfInput } from "../types"

export const postAction: ActionRunner<SetupAsdfInput> = async ({
  name,
  ref,
  asdfDir,
}) => {
  const cacheKey = CacheKey.builder(name).add(ref)
  await uploadCache(cacheKey, asdfDir)
}
