import fs from "node:fs"
import fsPromise from "node:fs/promises"

import { getInput, setFailed } from "@actions/core"
import { which } from "@actions/io"
import { exec, type ExecOptions } from "@actions/exec"

import { mock } from "@utils/tests/mocks"

import app from "../app"
import run from "./run"

jest.mock("@actions/core")
jest.mock("@actions/exec")
jest.mock("@actions/io")

describe("action runner script", () => {
  mock(getInput).mockImplementation((name) => {
    switch (name) {
      case "ref":
        return "master"
      case "workdir":
        return "/tmp"
      default:
        return ""
    }
  })

  describe("install asdf", () => {
    it("asdf already installed", async () => {
      mock(which).mockResolvedValueOnce("/usr/bin/asdf")

      await app.exec(run)

      expect(exec).not.toHaveBeenCalled()
    })

    test("error when search installed asdf", async () => {
      const error = new Error("Something went wrong")
      mock(which).mockRejectedValueOnce(error)

      await app.exec(run)

      expect(setFailed).toHaveBeenCalledTimes(1)
      expect(setFailed).toHaveBeenCalledWith(error)
    })

    test("impossible case: where which command return undefined", async () => {
      mock(which).mockResolvedValueOnce(undefined as unknown as string)

      await app.exec(run, {
        asdfDir: "/home/.asdf",
      })

      expect(setFailed).not.toHaveBeenCalled()
    })

    test("if asdf is downloaded but not install", async () => {
      mock(which).mockResolvedValueOnce("")
      jest.spyOn(fs, "existsSync").mockReturnValueOnce(true)

      await app.exec(run, {
        ref: "master",
        asdfDir: "/home/.asdf",
      })

      const options = { cwd: "/home/.asdf" }
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
      mock(which).mockResolvedValueOnce("")
      jest.spyOn(fs, "existsSync").mockReturnValueOnce(false)

      await app.exec(run, {
        ref: "master",
        asdfDir: "/home/.asdf",
      })

      expect(exec).toHaveBeenCalledTimes(1)
      expect(exec).toHaveBeenCalledWith("git", [
        "clone",
        "--depth",
        "1",
        "--branch",
        "master",
        "--single-branch",
        "https://github.com/asdf-vm/asdf.git",
        "/home/.asdf",
      ])
    })
  })

  describe("install tools", () => {
    const mockPluginList = (
      cmd: string,
      args: string[] | undefined,
      options: ExecOptions | undefined,
      stdout?: string,
      stderr?: string
    ): boolean => {
      if (
        cmd === "asdf" &&
        args?.length === 2 &&
        args?.[0] === "plugin" &&
        args?.[1] === "list"
      ) {
        if (typeof stdout === "string")
          options?.listeners?.stdout?.(Buffer.from(stdout, "utf-8"))
        if (typeof stderr === "string")
          options?.listeners?.stderr?.(Buffer.from(stderr, "utf-8"))
        return true
      }
      return false
    }

    test("if .tool-versions is missing", async () => {
      const installed = "plugin-3\nplugin-2\nplugin-1"
      const error = new Error("ENOENT: no such file or directory")

      jest.spyOn(fsPromise, "readFile").mockRejectedValueOnce(error)
      mock(exec).mockImplementation(
        async (cmd, args, options) =>
          await new Promise((resolve) =>
            resolve(mockPluginList(cmd, args, options, installed) ? 0 : 1)
          )
      )

      await app.exec(run, {
        tool: true,
      })

      expect(setFailed).toHaveBeenCalledTimes(1)
      expect(setFailed).toHaveBeenCalledWith(error)
    })

    test("if no plugins installed", async () => {
      const noPlugin = "No plugins installed"
      const toolVersion = "helm 1.0.0\nkubectl 1.0.0"

      jest.spyOn(fsPromise, "readFile").mockResolvedValueOnce(toolVersion)
      mock(exec).mockImplementation(
        async (cmd, args, options) =>
          await new Promise((resolve) =>
            resolve(mockPluginList(cmd, args, options, noPlugin) ? 0 : 1)
          )
      )

      await app.exec(run, {
        tool: true,
      })

      expect(setFailed).not.toHaveBeenCalled()
    })

    test("if plugin list failed", async () => {
      const toolVersion = "helm 1.0.0\nkubectl 1.0.0"
      const error = new Error("unknown error")

      jest.spyOn(fsPromise, "readFile").mockResolvedValueOnce(toolVersion)
      mock(exec).mockImplementation(
        async (cmd, args, options) =>
          await new Promise((resolve, reject) =>
            mockPluginList(cmd, args, options, undefined, error.message)
              ? reject(error)
              : resolve(1)
          )
      )

      await app.exec(run, {
        tool: true,
      })

      expect(setFailed).toHaveBeenCalledTimes(1)
      expect(setFailed).toHaveBeenCalledWith(error)
    })

    test("all plugins are new", async () => {
      const plugins = "plugin-1\nplugin-2\nplugin-3"
      const toolVersion = "helm 1.0.0\nkubectl 1.0.0"

      mock(which).mockResolvedValueOnce("/home/.asdf/bin/asdf")
      jest.spyOn(fsPromise, "readFile").mockResolvedValueOnce(toolVersion)
      mock(exec).mockImplementation(
        async (cmd, args, options) =>
          await new Promise((resolve) =>
            resolve(mockPluginList(cmd, args, options, plugins) ? 0 : 1)
          )
      )

      await app.exec(run, {
        tool: true,
      })

      expect(exec).toHaveBeenCalledTimes(4)
      expect(exec).toHaveBeenNthCalledWith(2, "asdf", [
        "plugin",
        "add",
        "helm",
        "https://github.com/kc-workspace/asdf-helm.git",
      ])
      expect(exec).toHaveBeenNthCalledWith(3, "asdf", [
        "plugin",
        "add",
        "kubectl",
        "https://github.com/kc-workspace/asdf-kubectl.git",
      ])
      expect(exec).toHaveBeenLastCalledWith("asdf", ["install"], {
        cwd: "/tmp",
      })
    })

    afterEach(() => {
      jest.restoreAllMocks()
    })
  })
})
