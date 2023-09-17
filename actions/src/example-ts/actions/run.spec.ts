import { info } from "@actions/core"

import run from "./run"

jest.mock("@actions/core")

describe("action runner", () => {
  it("default config", async () => {
    await run({ name: "example" })

    // Expected rules
    expect(info).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledWith("hello example")
  })
  it("custom config", async () => {
    await run({ name: "custom" })

    // Expected rules
    expect(info).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledWith("hello custom")
  })
})
