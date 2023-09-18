import type { Runner } from "@utils/actions"
import type { Config } from "../app/types"

// import { appendFile } from "fs/promises"
import { exec } from "@utils/executors"

const action: Runner<Config> = async ({ ip, hosts, tableFile }) => {
  const lookupTable = hosts.reduce((table, host) => {
    const row = `${ip}   ${host}`
    return table + "\n" + row
  }, "")

  // await exec("sudo", "chown", )
  await exec("sudo", "printf", lookupTable, ">", tableFile)
  // await appendFile(tableFile, lookupTable, {
  //   encoding: "utf8",
  // })
}

export default action
