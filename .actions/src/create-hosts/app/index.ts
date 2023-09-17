import type { Config } from "./types"

import { getInput } from "@actions/core"
import { Actions } from "@utils/actions"

const toHosts = (host: string): string[] => {
  return host
    .split(",")
    .flatMap((h) => h.split("\n"))
    .filter((h) => h !== "")
}

export default Actions.builder<Config>(() => {
  return {
    name: "create-hosts",
    hosts: toHosts(getInput("hosts", { required: true })),
    ip: getInput("ip", { required: true }),
    tableFile: "/etc/hosts",
  }
})
