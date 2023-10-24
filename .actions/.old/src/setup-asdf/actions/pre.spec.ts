import { isFeatureAvailable, restoreCache } from "@actions/cache"
import { CacheKey } from "@utils/caches"

import app from "../app"
import pre from "./pre"
import { mock } from "@utils/tests/mocks"
import { setFailed } from "@actions/core"

jest.mock("@actions/core")
jest.mock("@actions/cache")

describe("action pre script", () => {
  it("default config", async () => {
    mock(isFeatureAvailable).mockReturnValue(true)

    await app.exec(pre, {
      cache: {
        disabled: false,
        key: CacheKey.builder("asdf"),
      },
      asdfDir: "/home/user",
    })

    expect(setFailed).not.toHaveBeenCalled()
    expect(restoreCache).toHaveBeenCalledTimes(1)
    expect(restoreCache).toHaveBeenCalledWith(["/home/user"], "asdf", [])
  })

  it("disable caching", async () => {
    await app.exec(pre, {
      cache: {
        disabled: true,
        key: CacheKey.builder("asdf"),
      },
      asdfDir: "/home/user",
    })

    expect(setFailed).not.toHaveBeenCalled()
    expect(restoreCache).not.toHaveBeenCalled()
  })
})
