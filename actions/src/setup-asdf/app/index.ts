import type { ActionRunner } from "@utils/types/actions"
import type { SetupAsdfInput } from "./types"

import { existsSync } from "node:fs"
import { readFile } from "node:fs/promises"
import { debug, info, exportVariable, addPath, setFailed } from "@actions/core"
import { which } from "@actions/io"

import { exec, execWithOptions } from "@utils/executors"

import { skippedSetup } from "./constants"
import { join } from "node:path"

export const run: ActionRunner<SetupAsdfInput> = async (input) => {
  try {
    const path = await which("asdf", false)
    if ((path?.length ?? 0) > 0) {
      debug(skippedSetup)
      return
    }

    exportVariable("ASDF_DIR", input.asdfDir)
    addPath(`${input.asdfDir}/bin`)
    addPath(`${input.asdfDir}/shims`)

    if (existsSync(input.asdfDir)) {
      info(`Updating asdf in ASDF_DIR "${input.asdfDir}" on "${input.ref}"`)
      await updateAsdf(input)
    } else {
      info(`Cloning asdf into ASDF_DIR "${input.asdfDir}" on "${input.ref}"`)
      await cloneAsdf(input)
    }

    await installTool(input)
  } catch (error) {
    setFailed(error as Error)
  }
}

const cloneAsdf = async ({ ref, asdfDir }: SetupAsdfInput): Promise<number> => {
  return await exec(
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

const updateAsdf = async ({
  ref,
  asdfDir,
}: SetupAsdfInput): Promise<number> => {
  const opt = { cwd: asdfDir }
  const exit1 = await execWithOptions(
    opt,
    "git",
    "remote",
    "set-branches",
    "origin",
    ref
  )
  const exit2 = await execWithOptions(
    opt,
    "git",
    "fetch",
    "--depth",
    "1",
    "origin",
    ref
  )
  const exit3 = await execWithOptions(
    opt,
    "git",
    "checkout",
    "-B",
    ref,
    "origin"
  )

  return exit1 + exit2 + exit3
}

const pluginList = async (): Promise<string[]> => {
  let stdout = ""
  let stderr = ""
  const options = {
    listeners: {
      stdout(data: Buffer) {
        stdout += data.toString()
      },
      stderr(data: Buffer) {
        stderr += data.toString()
      },
    },
  }

  try {
    await execWithOptions(options, "asdf", "plugin", "list")
  } catch (error) {
    if (!stderr.includes("No plugins installed")) {
      throw error
    }
  }

  return stdout.split("\n")
}

const installTool = async ({
  workDir,
  tool,
}: SetupAsdfInput): Promise<void> => {
  if (!tool.install) {
    debug("skipped install tool because tool_install is disabled")
    return
  }

  const installedPlugins = await pluginList()
  const toolVersions = await readFile(join(workDir, ".tool-version"), {
    encoding: "utf-8",
  })
  const pluginNames = toolVersions
    .split("\n")
    .map((x) => x.replace(/#.*/, "").trim())
    .filter((x) => x.length > 0)
    .map((x) => x.split(" ")[0])

  for await (const plugin of pluginNames) {
    if (installedPlugins.includes(plugin)) {
      info(`Skip installing ${plugin} plugin since it's already installed`)
      continue
    }

    info(`Installing ${plugin} plugin...`)
    await exec(
      "asdf",
      "plugin",
      "add",
      plugin,
      `https://github.com/kc-workspace/asdf-${plugin}.git`
    )
  }

  await execWithOptions(
    {
      cwd: workDir,
    },
    "asdf",
    "install"
  )
}
