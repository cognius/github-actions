import type { ExecOptions } from "@actions/exec"
import type { Runner } from "@utils/actions"
import type { Input } from "../app/types"

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

const action: Runner<Input> = async (config, context) => {
  const path = await which("asdf", false)

  await asdfSetup(config, context)
  if (path === undefined || path === null || path === "") {
    await asdfInstall(config, context)
  }

  if (config.tool) {
    await asdfAddPlugins(config, context)
    await asdfInstallTools(config, context)
  }
}

const asdfSetup: Runner<Input> = async ({ asdfDir }) => {
  exportVariable("ASDF_DIR", asdfDir)
  addPath(`${asdfDir}/bin`)
  addPath(`${asdfDir}/shims`)
}

const asdfInstall: Runner<Input> = async ({ asdfDir, ref }) => {
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

const asdfAddPlugins: Runner<Input> = async ({ workDir, tool }) => {
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

const asdfInstallTools: Runner<Input> = async ({ workDir, tool }) => {
  await asdfToolInstall(workDir)
}

export default action
