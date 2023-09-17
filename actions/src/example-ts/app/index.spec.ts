import { info } from "@actions/core"

import runAction from "../actions/run"
import app from "."

jest.mock("@actions/core")

describe("example-ts action", () => {
  it("default config", async () => {
    await app.exec(runAction)

    // Expected rules
    expect(info).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledWith("hello example")
  })
  it("custom config", async () => {
    await app.exec(runAction, { name: "custom" })

    // Expected rules
    expect(info).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledWith("hello custom")
  })
})
