import { getInput, setFailed } from "@actions/core"
import { mock } from "@utils/tests/mocks"

import app from "."

jest.mock("@actions/core")

describe("action application", () => {
  test("contains export default", () => {
    expect(app).toBeDefined()
  })

  test("executes default config", async () => {
    mock(getInput).mockReturnValue("")

    const fn = jest.fn()
    await app.exec(fn)

    expect(setFailed).not.toHaveBeenCalled()
    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith({
      name: "create-hosts",
      hosts: [],
      ip: "",
      tableFile: "/etc/hosts",
    })
  })
})
