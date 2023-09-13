import { info } from "@actions/core"
import { exec as actionExec, type ExecOptions } from "@actions/exec"

const internal = async (
  cmd: string,
  args?: string[],
  options?: ExecOptions
): Promise<number> => {
  const dryrun = process.env.DRYRUN ?? ""

  if (dryrun !== "") {
    info(`[DRY] $ ${cmd} ${args?.join(" ")}`)
    return 0
  }

  if (typeof options === "object") return await actionExec(cmd, args, options)
  return await actionExec(cmd, args)
}

export const exec = async (cmd: string, ...args: string[]): Promise<number> => {
  return await internal(cmd, args)
}

export const execWithOptions = async (
  options: ExecOptions,
  cmd: string,
  ...args: string[]
): Promise<number> => {
  return await internal(cmd, args, options)
}
