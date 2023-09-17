import { isFeatureAvailable, restoreCache } from "@actions/cache"
import { CacheKey } from "@utils/caches"

import app from "../app"
import pre from "./pre"
import { mock } from "@utils/tests/mocks"

jest.mock("@actions/core")
jest.mock("@actions/cache")

describe("action pre script", () => {
  it("default config", async () => {
    mock(isFeatureAvailable).mockReturnValue(true)

    await app.exec(pre, {
      cache: CacheKey.builder("asdf"),
      asdfDir: "/home/user",
    })

    expect(restoreCache).toHaveBeenCalledTimes(1)
    expect(restoreCache).toHaveBeenCalledWith(["/home/user"], "asdf", [])
  })
})
