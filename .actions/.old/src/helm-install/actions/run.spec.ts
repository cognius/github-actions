import { info } from "@actions/core"

import app from "../app"
import run from "./run"

jest.mock("@actions/core")

describe("action runner", () => {
  test("default config", async () => {
    await app.exec(run)

    // Expected rules
    expect(info).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledWith("hello example")
  })
  test("custom config", async () => {
    await app.exec(run, { name: "custom" })

    // Expected rules
    expect(info).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledWith("hello custom")
  })
})
