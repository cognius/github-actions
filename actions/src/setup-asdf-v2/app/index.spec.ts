import { join } from "node:path"
import { getInput } from "@actions/core"

import app from "."

import * as utils from "@utils/caches/utils"
import { mock } from "@utils/tests/mocks"
import { CacheKey } from "@utils/caches"

jest.mock("@actions/core")

describe("action application", () => {
  test("contains export default", () => {
    expect(app).toBeDefined()
  })

  test("execute application with default configs", async () => {
    mock(getInput).mockImplementation((name) =>
      name === "ref" ? "master" : ""
    )
    jest.spyOn(utils, "getArch").mockReturnValue("arm")
    jest.spyOn(utils, "getPlatform").mockReturnValue("darwin")

    const fn = jest.fn()
    await app.exec(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith({
      asdfDir: join(process.env.HOME ?? "/", ".asdf"),
      cache: CacheKey.builder("asdf").addSystem().add("master"),
      name: "asdf",
      ref: "master",
      tool: false,
      workDir: "",
    })
  })
})
