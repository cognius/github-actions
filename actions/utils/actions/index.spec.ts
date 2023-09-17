import { setFailed } from "@actions/core"

import { Actions } from "."

jest.mock("@actions/core")

describe("actions builder", () => {
  const mockFn = jest.fn<string, []>()
  const app = Actions.builder(() => {
    return { name: "example", mock: mockFn() }
  })

  test("created defined application", () => {
    expect(app).toBeDefined()
  })

  test("executes with reject Promise", async () => {
    mockFn.mockReturnValueOnce("hello world")

    const error = new Error("hello world")
    const fn = jest.fn().mockRejectedValue(error)
    await app.exec(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(setFailed).toHaveBeenCalledTimes(1)
    expect(setFailed).toHaveBeenCalledWith(error)
  })

  test("executes with default config", async () => {
    mockFn.mockReturnValueOnce("hello world")

    const fn = jest.fn()
    await app.exec(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith({
      name: "example",
      mock: "hello world",
    })
  })

  test("executes with custom config", async () => {
    mockFn.mockReturnValueOnce("hello world")

    const fn = jest.fn()
    await app.exec(fn, { name: "override", mock: "new world" })

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith({
      name: "override",
      mock: "new world",
    })
  })
})
