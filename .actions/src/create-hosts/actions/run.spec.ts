import { getInput, setFailed } from "@actions/core"
import { exec } from "@actions/exec"
import { mock } from "@utils/tests/mocks"

import app from "../app"
import run from "./run"

jest.mock("@actions/core")
jest.mock("@actions/exec")

describe("action runner", () => {
  test("write table to hosts file", async () => {
    mock(getInput).mockReturnValue("")

    await app.exec(run, { hosts: ["a.com", "b.com"], ip: "127.0.0.1" })

    expect(setFailed).not.toHaveBeenCalled()
    expect(exec).toHaveBeenCalledTimes(1)
    expect(exec).toHaveBeenCalledWith("sudo", ["tee", "-a", "/etc/hosts"], {
      input: Buffer.from(
        `
127.0.0.1   a.com
127.0.0.1   b.com`,
        "utf8"
      ),
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
