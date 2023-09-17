import type { BaseConfig } from "@utils/actions"

import type { CacheKey } from "@utils/caches"

export interface Config extends BaseConfig {
  cache: CacheKey
  ref: string
  workDir: string
  asdfDir: string
  tool: boolean
}
