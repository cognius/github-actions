import type { SetupAsdfInput } from "./types"

import fs from "node:fs"
import fsPromise from "node:fs/promises"

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
  const input: SetupAsdfInput = {
    name: "asdf",
    workDir: "/home",
    asdfDir: "/tmp/.asdf",
    ref: "master",
    tool: {
      install: false,
    },
  }

  test("if asdf already installed", async () => {
    mock(which).mockResolvedValueOnce("/usr/bin/asdf")

    await run(input)

    expect(debug).toHaveBeenCalledTimes(1)
    expect(debug).toHaveBeenCalledWith(skippedSetup)
  })

  test("if which asdf throw errors", async () => {
    const error = new Error("Something went wrong")
    mock(which).mockRejectedValueOnce(error)

    await run(input)

    expect(setFailed).toHaveBeenCalledTimes(1)
    expect(setFailed).toHaveBeenCalledWith(error)
  })

  test("impossible case: where which command return undefined", async () => {
    mock(which).mockResolvedValueOnce(undefined as unknown as string)

    await run(input)

    expect(setFailed).not.toHaveBeenCalled()
    expect(exec).toHaveBeenCalled()
  })

  test("if asdf is downloaded but not install", async () => {
    jest.spyOn(fs, "existsSync").mockReturnValueOnce(true)

    mock(which).mockResolvedValueOnce("")

    await run(input)

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

    await run(input)

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
    await preAction(input)
    expect(restoreCache).toHaveBeenCalledTimes(1)
  })

  test("postAction should call saveCache", async () => {
    mock(isFeatureAvailable).mockReturnValueOnce(true)
    await postAction(input)
    expect(saveCache).toHaveBeenCalledTimes(1)
  })

  describe("with tools", () => {
    const input: SetupAsdfInput = {
      name: "asdf",
      workDir: "/home",
      asdfDir: "/tmp/.asdf",
      ref: "master",
      tool: {
        install: true,
      },
    }

    test("if .tool-versions is missing", async () => {
      const error = new Error("ENOENT: no such file or directory")
      jest.spyOn(fsPromise, "readFile").mockRejectedValueOnce(error)

      mock(exec).mockImplementation(async (cmd, args, options) => {
        if (
          cmd === "asdf" &&
          (args ?? []).includes("plugin") &&
          (args ?? []).includes("list")
        ) {
          if (typeof options?.listeners?.stdout === "function") {
            options.listeners.stdout(Buffer.from("cmd1\ncmd2\ncmd3", "utf-8"))
          }
          return await new Promise((resolve) => resolve(0))
        }

        return await new Promise((resolve) => resolve(1))
      })

      await run(input)

      expect(setFailed).toHaveBeenCalledTimes(1)
      expect(setFailed).toHaveBeenCalledWith(error)
    })

    test("if no plugins installed", async () => {
      jest
        .spyOn(fsPromise, "readFile")
        .mockResolvedValueOnce("helm 1.0.0\nkubectl 1.0.0")

      mock(exec).mockImplementation(async (cmd, args, options) => {
        if (
          cmd === "asdf" &&
          (args ?? []).includes("plugin") &&
          (args ?? []).includes("list")
        ) {
          if (typeof options?.listeners?.stderr === "function") {
            options.listeners.stderr(
              Buffer.from("No plugins installed", "utf-8")
            )
          }
          return await new Promise((resolve) => resolve(1))
        }

        return await new Promise((resolve) => resolve(1))
      })

      await run(input)

      expect(setFailed).not.toHaveBeenCalled()
    })

    test("if plugin list failed", async () => {
      const error = new Error("unknown error")
      jest
        .spyOn(fsPromise, "readFile")
        .mockResolvedValueOnce("helm 1.0.0\nkubectl 1.0.0")

      mock(exec).mockImplementation(async (cmd, args, options) => {
        if (
          cmd === "asdf" &&
          (args ?? []).includes("plugin") &&
          (args ?? []).includes("list")
        ) {
          if (typeof options?.listeners?.stderr === "function") {
            options.listeners.stderr(Buffer.from("unknown error", "utf-8"))
          }
          return await new Promise((_resolve, reject) => reject(error))
        }

        return await new Promise((resolve) => resolve(1))
      })

      await run(input)

      expect(setFailed).toHaveBeenCalledTimes(1)
      expect(setFailed).toHaveBeenCalledWith(error)
    })

    test("if install all new plugins", async () => {
      jest
        .spyOn(fsPromise, "readFile")
        .mockResolvedValueOnce("helm 1.0.0\nkubectl 1.0.0")

      mock(exec).mockImplementation(async (cmd, args, options) => {
        if (
          cmd === "asdf" &&
          (args ?? []).includes("plugin") &&
          (args ?? []).includes("list")
        ) {
          if (typeof options?.listeners?.stdout === "function") {
            options.listeners.stdout(Buffer.from("cmd1\ncmd2\ncmd3", "utf-8"))
          }
        }

        return await new Promise((resolve) => resolve(0))
      })

      await run(input)

      expect(exec).toHaveBeenCalledTimes(5)
      expect(exec).toHaveBeenNthCalledWith(3, "asdf", [
        "plugin",
        "add",
        "helm",
        "https://github.com/kc-workspace/asdf-helm.git",
      ])
      expect(exec).toHaveBeenNthCalledWith(4, "asdf", [
        "plugin",
        "add",
        "kubectl",
        "https://github.com/kc-workspace/asdf-kubectl.git",
      ])
      expect(exec).toHaveBeenLastCalledWith("asdf", ["install"], {
        cwd: "/home",
      })
    })

    test("if install some new plugins", async () => {
      jest
        .spyOn(fsPromise, "readFile")
        .mockResolvedValueOnce("helm 1.0.0\nkubectl 1.0.0")

      mock(exec).mockImplementation(async (cmd, args, options) => {
        if (
          cmd === "asdf" &&
          (args ?? []).includes("plugin") &&
          (args ?? []).includes("list")
        ) {
          if (typeof options?.listeners?.stdout === "function") {
            options.listeners.stdout(Buffer.from("cmd1\nhelm\ncmd3", "utf-8"))
          }
        }

        return await new Promise((resolve) => resolve(0))
      })

      await run(input)

      expect(exec).toHaveBeenCalledTimes(4)
      expect(exec).toHaveBeenNthCalledWith(3, "asdf", [
        "plugin",
        "add",
        "kubectl",
        "https://github.com/kc-workspace/asdf-kubectl.git",
      ])
      expect(exec).toHaveBeenLastCalledWith("asdf", ["install"], {
        cwd: "/home",
      })
    })
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })
})
