import type { ActionRunner } from "@utils/types/actions"
import type { SetupAsdfInput } from "./types"

import { existsSync } from "node:fs"

import { debug, info, exportVariable, addPath, setFailed } from "@actions/core"
import { which } from "@actions/io"

import { exec, execWithOptions } from "@utils/executors"

import { skippedSetup } from "./constants"

export const run: ActionRunner<SetupAsdfInput> = async ({ ref, asdfDir }) => {
  try {
    const path = await which("asdf", false)
    if ((path?.length ?? 0) > 0) {
      debug(skippedSetup)
      return
    }

    exportVariable("ASDF_DIR", asdfDir)
    addPath(`${asdfDir}/bin`)
    addPath(`${asdfDir}/shims`)

    if (existsSync(asdfDir)) {
      info(`Updating asdf in ASDF_DIR "${asdfDir}" on "${ref}"`)

      const opt = { cwd: asdfDir }
      await execWithOptions(opt, "git", "remote", "set-branches", "origin", ref)
      await execWithOptions(opt, "git", "fetch", "--depth", "1", "origin", ref)
      await execWithOptions(opt, "git", "checkout", "-B", ref, "origin")
    } else {
      info(`Cloning asdf into ASDF_DIR "${asdfDir}" on "${ref}"`)

      await exec(
        "git",
        "clone",
        "--depth",
        "1",
        "--branch",
        ref,
        "--single-branch",
        "https://github.com/asdf-vm/asdf.git",
        asdfDir
      )
    }
  } catch (error) {
    setFailed(error as Error)
  }
}
