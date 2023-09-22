import type { CacheKey } from "@utils/caches"

export interface Input {
  cache: CacheKey
  ref: string
  workDir: string
  asdfDir: string
  tool: boolean
}
