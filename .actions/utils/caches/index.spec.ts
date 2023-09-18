import { isFeatureAvailable, restoreCache, saveCache } from "@actions/cache"

import { uploadCache, downloadCache, CacheKey } from "."
import * as utils from "./utils"

import { mock } from "@utils/tests/mocks"

jest.mock("@actions/core")
jest.mock("@actions/cache")

describe("cache utils", () => {
  describe("CacheKey class", () => {
    test("single key", async () => {
      const key = CacheKey.builder("key")

      expect(key.getKey()).toBe("key")
      expect(key.getRestoreKeys()).toEqual([])
    })
    test("multiple keys", async () => {
      const key = CacheKey.builder("key").add("hello").add("value")

      expect(key.getKey()).toBe("key-hello-value")
      expect(key.getRestoreKeys()).toEqual(["key-hello-", "key-"])
    })
    test("system key", async () => {
      jest.spyOn(utils, "getPlatform")
      jest.spyOn(utils, "getArch")

      const key = CacheKey.builder("key").addSystem()

      expect(key.getKey()).toMatch(/key-[^-]+-[^-]+/)

      expect(utils.getPlatform).toHaveBeenCalledTimes(1)
      expect(utils.getArch).toHaveBeenCalledTimes(1)
    })
  })

  test("save cache when feature enabled", async () => {
    mock(isFeatureAvailable).mockReturnValueOnce(true)
    mock(saveCache).mockResolvedValueOnce(1)

    await uploadCache(CacheKey.builder("key"), "/tmp")

    expect(saveCache).toHaveBeenCalledTimes(1)
    expect(saveCache).toHaveBeenCalledWith(["/tmp"], "key")
  })
  test("save cache when feature disabled", async () => {
    mock(isFeatureAvailable).mockReturnValueOnce(false)
    mock(saveCache).mockResolvedValueOnce(1)

    await uploadCache(CacheKey.builder("key"), "/tmp")

    expect(saveCache).not.toHaveBeenCalled()
  })

  test("restore cache when feature enabled", async () => {
    mock(isFeatureAvailable).mockReturnValueOnce(true)
    mock(restoreCache).mockResolvedValueOnce("id")

    await downloadCache(
      CacheKey.builder("key").add("nested").add("test"),
      "/tmp",
      "/usr"
    )

    expect(restoreCache).toHaveBeenCalledTimes(1)
    expect(restoreCache).toHaveBeenCalledWith(
      ["/tmp", "/usr"],
      "key-nested-test",
      ["key-nested-", "key-"]
    )
  })
  test("restore cache when feature disabled", async () => {
    mock(isFeatureAvailable).mockReturnValueOnce(false)
    mock(restoreCache).mockResolvedValueOnce("id")

    await downloadCache(CacheKey.builder("key"), "/tmp")

    expect(restoreCache).not.toHaveBeenCalled()
  })
})