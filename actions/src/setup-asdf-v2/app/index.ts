import type { Config } from "./types"

import { homedir } from "node:os"
import { join } from "node:path"

import { getInput } from "@actions/core"
import { Actions } from "@utils/actions"
import { CacheKey } from "@utils/caches"

const name = "asdf"
const ref = getInput("ref", { required: true })

export default Actions.builder<Config>({
  cache: CacheKey.builder(name).addSystem().add(ref),
  name,
  ref,

  asdfDir: join(homedir(), ".asdf"),
  workDir: getInput("workdir", { required: true }),

  tool: getInput("tool_install", { required: true }) === "true",
})
