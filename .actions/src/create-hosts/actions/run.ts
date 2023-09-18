import type { Runner } from "@utils/actions"
import type { Config } from "../app/types"

import { execWithOptions } from "@utils/executors"

const action: Runner<Config> = async ({ ip, hosts, tableFile }) => {
  const lookupTable = hosts.reduce((table, host) => {
    const row = `${ip}   ${host}`
    return table + "\n" + row
  }, "")

  await execWithOptions(
    {
      input: Buffer.from(lookupTable, "utf8"),
    },
    "sudo",
    "tee",
    "-a",
    tableFile
  )
}

export default action
