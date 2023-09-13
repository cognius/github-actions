import { homedir } from "node:os"
import { existsSync } from "node:fs"
import { join } from "node:path"

import {
  debug,
  info,
  getInput,
  exportVariable,
  addPath,
  setFailed,
} from "@actions/core"
import { which } from "@actions/io"
import { exec } from "@actions/exec"

export const skippedSetup =
  "Found asdf command on current environment, skipped setup"

export const run = async (): Promise<void> => {
  try {
    const path = await which("asdf", false)
    if ((path?.length ?? 0) > 0) {
      debug(skippedSetup)
      return
    }

    const asdfDir = join(homedir(), ".asdf")
    exportVariable("ASDF_DIR", asdfDir)
    addPath(`${asdfDir}/bin`)
    addPath(`${asdfDir}/shims`)

    const ref = getInput("ref", { required: true })
    if (existsSync(asdfDir)) {
      info(`Updating asdf in ASDF_DIR "${asdfDir}" on "${ref}"`)

      const options = { cwd: asdfDir }
      await exec("git", ["remote", "set-branches", "origin", ref], options)
      await exec("git", ["fetch", "--depth", "1", "origin", ref], options)
      await exec("git", ["checkout", "-B", ref, "origin"], options)
    } else {
      info(`Cloning asdf into ASDF_DIR "${asdfDir}" on "${ref}"`)

      await exec("git", [
        "clone",
        "--depth",
        "1",
        "--branch",
        ref,
        "--single-branch",
        "https://github.com/asdf-vm/asdf.git",
        asdfDir,
      ])
    }
  } catch (error) {
    setFailed(error as Error)
  }
}
