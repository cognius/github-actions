import { isFeatureAvailable, restoreCache, saveCache } from "@actions/cache"

class CacheKey {
  static builder(key: string): CacheKey {
    return new CacheKey(key)
  }

  private readonly keys: string[]
  private constructor(key: string) {
    this.keys = [key]
  }

  add(key: string): this {
    this.keys.push(key)
    return this
  }

  getKey(): string {
    return this.keys.join("-")
  }

  getRestoreKeys(): string[] {
    const keys = this.keys.slice(0, -1)
    return keys.map((_, index, keys) => {
      return keys
        .slice(0, keys.length - index)
        .join("-")
        .concat("-")
    })
  }
}

export const downloadCache = async (
  key: CacheKey,
  ...paths: string[]
): Promise<string | undefined> => {
  if (isFeatureAvailable()) {
    return await restoreCache(paths, key.getKey(), key.getRestoreKeys())
  }

  return await new Promise((resolve) => resolve(undefined))
}

export const uploadCache = async (
  key: CacheKey,
  ...paths: string[]
): Promise<number> => {
  if (isFeatureAvailable()) {
    return await saveCache(paths, key.getKey())
  }

  return await new Promise((resolve) => resolve(0))
}

export { CacheKey }
