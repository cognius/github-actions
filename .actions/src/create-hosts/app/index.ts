import type { Input } from "./types"

import { getInput } from "@actions/core"
import { Actions, DefaultContext } from "@utils/actions"

const toHosts = (host: string): string[] => {
  return host
    .split(",")
    .flatMap((h) => h.split("\n"))
    .filter((h) => h !== "")
}

export const context = new DefaultContext("create-hosts", "v0.1.0-dev")
export default Actions.builder<Input>(context, () => {
  return {
    hosts: toHosts(getInput("hosts", { required: true })),
    ip: getInput("ip", { required: true }),
    tableFile: "/etc/hosts",
  }
})
