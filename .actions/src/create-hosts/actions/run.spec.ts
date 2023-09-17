import fsPromise from "node:fs/promises"
import { getInput, setFailed } from "@actions/core"
import { mock } from "@utils/tests/mocks"

import app from "../app"
import run from "./run"

jest.mock("@actions/core")

describe("action runner", () => {
  test("write table to hosts file", async () => {
    mock(getInput).mockReturnValue("")
    const appendFile = jest
      .spyOn(fsPromise, "appendFile")
      .mockResolvedValue(undefined)

    await app.exec(run, { hosts: ["a.com", "b.com"], ip: "127.0.0.1" })

    expect(setFailed).not.toHaveBeenCalled()
    expect(appendFile).toHaveBeenCalledTimes(1)
    expect(appendFile).toHaveBeenCalledWith(
      "/etc/hosts",
      `
127.0.0.1   a.com
127.0.0.1   b.com`,
      {
        encoding: "utf8",
      }
    )
  })

  afterEach(() => {
    jest.restoreAllMocks()
  })
})
