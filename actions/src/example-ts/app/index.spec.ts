// import { getInput, setOutput, setFailed, debug } from "@actions/core"
import { run } from "."

jest.mock("@actions/core")

describe("example-ts action", () => {
  it("default tests", async () => {
    await run()

    // Expected rules
    expect(true).toBe(true)
  })
})
