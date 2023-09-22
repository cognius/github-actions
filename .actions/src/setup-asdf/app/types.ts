import type { CacheKey } from "@utils/caches"

export interface Input {
  cache: {
    disable: boolean
    key: CacheKey
  }
  ref: string
  workDir: string
  asdfDir: string
  tool: boolean
}
