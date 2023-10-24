import { setFailed, getInput } from "@actions/core"
import { asMock, mockRunner } from "@utils/mocks"

import app, { context } from "."

jest.mock("@actions/core")

describe("action application", () => {
  test("contains export default", () => {
    expect(app).toBeDefined()
  })

  test("executes default config", async () => {
    asMock(getInput).mockReturnValue("example")

    const fn = mockRunner(app)
    await app.exec(fn)

    expect(setFailed).not.toHaveBeenCalled()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(
      {
        input: {
          name: "example",
        },
      },
      context
    )
  })
})
