import fs from "node:fs"

import { debug, setFailed } from "@actions/core"
import { saveCache, restoreCache, isFeatureAvailable } from "@actions/cache"
import { exec } from "@actions/exec"
import { which } from "@actions/io"

import { run } from "."
import { skippedSetup } from "./constants"

import { mock } from "@utils/tests/mocks"
import { preAction } from "./hooks/pre"
import { postAction } from "./hooks/post"

jest.mock("@actions/core")
jest.mock("@actions/cache")
jest.mock("@actions/exec")
jest.mock("@actions/io")

describe("setup-asdf action", () => {
  test("if asdf already installed", async () => {
    mock(which).mockResolvedValueOnce("/usr/bin/asdf")

    await run({ name: "asdf", asdfDir: "/tmp/.asdf", ref: "master" })

    expect(debug).toHaveBeenCalledTimes(1)
    expect(debug).toHaveBeenCalledWith(skippedSetup)
  })

  test("if which asdf throw errors", async () => {
    const error = new Error("Something went wrong")
    mock(which).mockRejectedValueOnce(error)

    await run({ name: "asdf", asdfDir: "/tmp/.asdf", ref: "master" })

    expect(setFailed).toHaveBeenCalledTimes(1)
    expect(setFailed).toHaveBeenCalledWith(error)
  })

  test("impossible case: where which command return undefined", async () => {
    mock(which).mockResolvedValueOnce(undefined as unknown as string)

    await run({ name: "asdf", asdfDir: "/tmp/.asdf", ref: "master" })

    expect(setFailed).not.toHaveBeenCalled()
    expect(exec).toHaveBeenCalled()
  })

  test("if asdf is downloaded but not install", async () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(true)

    mock(which).mockResolvedValueOnce("")

    await run({ name: "asdf", asdfDir: "/tmp/.asdf", ref: "master" })

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

    mock(which).mockResolvedValueOnce("")

    await run({ name: "asdf", asdfDir: "/tmp/.asdf", ref: "master" })

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

  test("preAction should call restoreCache", async () => {
    mock(isFeatureAvailable).mockReturnValueOnce(true)
    await preAction({ name: "asdf", asdfDir: "/tmp/.asdf", ref: "master" })
    expect(restoreCache).toHaveBeenCalledTimes(1)
  })

  test("postAction should call saveCache", async () => {
    mock(isFeatureAvailable).mockReturnValueOnce(true)
    await postAction({ name: "asdf", asdfDir: "/tmp/.asdf", ref: "master" })
    expect(saveCache).toHaveBeenCalledTimes(1)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
