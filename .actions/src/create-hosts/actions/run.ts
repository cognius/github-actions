import type { Runner } from "@utils/actions"
import type { Config } from "../app/types"

import { appendFile } from "fs/promises"

const action: Runner<Config> = async ({ ip, hosts, tableFile }) => {
  const lookupTable = hosts.reduce((table, host) => {
    const row = `${ip}   ${host}`
    return table + "\n" + row
  }, "")

  await appendFile(tableFile, lookupTable, { encoding: "utf8" })
}

export default action
