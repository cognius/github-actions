import { info } from "@actions/core"
import { exec as actionExec } from "@actions/exec"

import { exec } from "."

jest.mock("@actions/core")
jest.mock("@actions/exec")

describe("exec utils", () => {
  test("run exec", async () => {
    await exec("git", "checkout", "master")

    expect(actionExec).toHaveBeenCalledTimes(1)
    expect(actionExec).toHaveBeenCalledWith("git", ["checkout", "master"])
  })

  test("dryrun exec", async () => {
    const env = jest.replaceProperty(process, "env", {
      DRYRUN: "true",
    })

    await exec("git", "checkout", "master")

    expect(actionExec).not.toHaveBeenCalled()
    expect(info).toHaveBeenCalledTimes(1)
    expect(info).toHaveBeenCalledWith("[DRY] $ git checkout master")

    env.restore()
  })
})
