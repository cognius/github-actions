import { isFeatureAvailable, saveCache } from "@actions/cache"
import { CacheKey } from "@utils/caches"

import app from "../app"
import post from "./post"
import { mock } from "@utils/tests/mocks"
import { setFailed } from "@actions/core"

jest.mock("@actions/core")
jest.mock("@actions/cache")

describe("action post script", () => {
  it("default config", async () => {
    mock(isFeatureAvailable).mockReturnValue(true)

    await app.exec(post, {
      cache: {
        disabled: false,
        key: CacheKey.builder("asdf"),
      },
      asdfDir: "/home/user",
    })

    expect(setFailed).not.toHaveBeenCalled()
    expect(saveCache).toHaveBeenCalledTimes(1)
    expect(saveCache).toHaveBeenCalledWith(["/home/user"], "asdf")
  })

  it("disable caching", async () => {
    await app.exec(post, {
      cache: {
        disabled: true,
        key: CacheKey.builder("asdf"),
      },
      asdfDir: "/home/user",
    })

    expect(setFailed).not.toHaveBeenCalled()
    expect(saveCache).not.toHaveBeenCalled()
  })
})
