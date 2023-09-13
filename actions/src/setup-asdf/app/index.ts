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

import { exec, execWithOptions } from "@utils/executors"
import { uploadCache, downloadCache, CacheKey } from "@utils/caches"

export const skippedSetup =
  "Found asdf command on current environment, skipped setup"

export const run = async (): Promise<void> => {
  try {
    const ref = getInput("ref", { required: true })
    const asdfDir = join(homedir(), ".asdf")

    const cacheKey = CacheKey.builder("asdf").add(ref)
    await downloadCache(cacheKey, asdfDir)

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

    await uploadCache(cacheKey, asdfDir)
  } catch (error) {
    setFailed(error as Error)
  }
}
