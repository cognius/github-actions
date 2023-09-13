import fs from "node:fs"
import os from "node:os"

import { debug, setFailed, getInput } from "@actions/core"
import { exec } from "@actions/exec"
import { which } from "@actions/io"

import { run, skippedSetup } from "."

import { mock } from "@utils/tests/mocks"

jest.mock("@actions/core")
jest.mock("@actions/exec")
jest.mock("@actions/io")

describe("setup-asdf action", () => {
  test("if asdf already installed", async () => {
    mock(which).mockResolvedValueOnce("/usr/bin/asdf")

    await run()

    expect(debug).toHaveBeenCalledTimes(1)
    expect(debug).toHaveBeenCalledWith(skippedSetup)
  })

  test("if which asdf throw errors", async () => {
    const error = new Error("Something went wrong")
    mock(which).mockRejectedValueOnce(error)

    await run()

    expect(setFailed).toHaveBeenCalledTimes(1)
    expect(setFailed).toHaveBeenCalledWith(error)
  })

  test("impossible case: where which command return undefined", async () => {
    mock(which).mockResolvedValueOnce(undefined as unknown as string)

    await run()

    expect(setFailed).not.toHaveBeenCalled()
    expect(exec).toHaveBeenCalled()
  })

  test("if asdf is downloaded but not install", async () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(true)
    jest.spyOn(os, "homedir").mockReturnValueOnce("/tmp")

    mock(which).mockResolvedValueOnce("")
    mock(getInput).mockReturnValueOnce("master")

    await run()

    const options = { cwd: "/tmp/.asdf" }
    expect(exec).toHaveBeenCalledTimes(3)
    expect(exec).toHaveBeenNthCalledWith(
      1,
      "git",
      ["remote", "set-branches", "origin", "master"],
      options
    )
    expect(exec).toHaveBeenNthCalledWith(
      2,
      "git",
      ["fetch", "--depth", "1", "origin", "master"],
      options
    )
    expect(exec).toHaveBeenNthCalledWith(
      3,
      "git",
      ["checkout", "-B", "master", "origin"],
      options
    )
  })

  test("if asdf never download", async () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(false)
    jest.spyOn(os, "homedir").mockReturnValueOnce("/tmp")

    mock(which).mockResolvedValueOnce("")
    mock(getInput).mockReturnValueOnce("master")

    await run()

    expect(exec).toHaveBeenCalledTimes(1)
    expect(exec).toHaveBeenCalledWith("git", [
      "clone",
      "--depth",
      "1",
      "--branch",
      "master",
      "--single-branch",
      "https://github.com/asdf-vm/asdf.git",
      "/tmp/.asdf",
    ])
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
