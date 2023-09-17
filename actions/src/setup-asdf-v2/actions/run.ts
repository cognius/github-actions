import type { Runner } from "@utils/actions"
import type { ExecOptions } from "@actions/exec"
import type { Config } from "../app/types"

import { existsSync } from "node:fs"
import { addPath, exportVariable, info } from "@actions/core"
import { which } from "@actions/io"
import { execWithOptions, exec } from "@utils/executors"
import {
  asdfPluginAdd,
  asdfPluginList,
  asdfToolList,
  asdfToolInstall,
} from "../apis/asdf"

const action: Runner<Config> = async (config) => {
  const path = await which("asdf", false)

  await asdfSetup(config)
  if (path === undefined || path === null || path === "") {
    await asdfInstall(config)
  }

  if (config.tool) {
    await asdfAddPlugins(config)
    await asdfInstallTools(config)
  }
}

const asdfSetup: Runner<Config> = async ({ asdfDir }) => {
  exportVariable("ASDF_DIR", asdfDir)
  addPath(`${asdfDir}/bin`)
  addPath(`${asdfDir}/shims`)
}

const asdfInstall: Runner<Config> = async ({ asdfDir, ref }) => {
  if (existsSync(asdfDir)) {
    info(`Updating asdf in ASDF_DIR "${asdfDir}" on "${ref}"`)
    const o: ExecOptions = { cwd: asdfDir }
    await execWithOptions(o, "git", "remote", "set-branches", "origin", ref)
    await execWithOptions(o, "git", "fetch", "--depth", "1", "origin", ref)
    await execWithOptions(o, "git", "checkout", "-B", ref, "origin")
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
}

const asdfAddPlugins: Runner<Config> = async ({ workDir, tool }) => {
  const installed = await asdfPluginList()
  const toolVersion = await asdfToolList(workDir)
  await Promise.all(
    toolVersion.map(async ({ name }) => {
      if (!installed.includes(name)) {
        await asdfPluginAdd(name)
      }
    })
  )
}

const asdfInstallTools: Runner<Config> = async ({ workDir, tool }) => {
  await asdfToolInstall(workDir)
}

export default action
