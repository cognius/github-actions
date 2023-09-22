import { setFailed } from "@actions/core"
import { Actions } from "."
import { DefaultContext } from "./context"

jest.mock("@actions/core")

describe("actions builder", () => {
  const defaultData = { msg: "hello world" }
  const defaultBuilder = (): Record<string, string> => defaultData
  const defaultContext = new DefaultContext("test", "v1.0.0")

  test("execute resolve promise", async () => {
    const fn = jest.fn().mockResolvedValueOnce("hello")
    const app = Actions.builder(defaultContext, defaultBuilder)

    await app.exec(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(defaultData, defaultContext)
    expect(setFailed).not.toHaveBeenCalled()
  })

  test("execute reject promise", async () => {
    const error = new Error("unknown error")
    const fn = jest.fn().mockRejectedValueOnce(error)
    const app = Actions.builder(defaultContext, defaultBuilder)

    await app.exec(fn)

    expect(setFailed).toHaveBeenCalledTimes(1)
    expect(setFailed).toHaveBeenCalledWith(error)
  })
})
