import { join } from "node:path"
import { readFile } from "node:fs/promises"

import { exec, execWithOptions } from "@utils/executors"

export const asdfPluginList = async (): Promise<string[]> => {
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

export const asdfPluginAdd = async (plugin: string): Promise<void> => {
  const repo = `https://github.com/kc-workspace/asdf-${plugin}.git`
  await exec("asdf", "plugin", "add", plugin, repo)
}

interface ToolVersion {
  name: string
  version: string
}
export const asdfToolList = async (baseDir: string): Promise<ToolVersion[]> => {
  const toolVersions = await readFile(join(baseDir, ".tool-versions"), {
    encoding: "utf-8",
  })

  return toolVersions
    .split("\n")
    .map((x) => x.replace(/#.*/, "").trim())
    .filter((x) => x.length > 0)
    .map((x) => x.split(" "))
    .map(([name, version]) => ({ name, version }))
}

export const asdfToolInstall = async (baseDir: string): Promise<void> => {
  const options = { cwd: baseDir }
  await execWithOptions(options, "asdf", "install")
}
