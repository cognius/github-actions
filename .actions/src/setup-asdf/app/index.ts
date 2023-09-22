import type { Input } from "./types"

import { homedir } from "node:os"
import { join } from "node:path"

import { getInput } from "@actions/core"
import { Actions, DefaultContext } from "@utils/actions"
import { CacheKey } from "@utils/caches"

export const context = new DefaultContext("setup-asdf", "v0.1.0-dev")
export default Actions.builder<Input>(context, (ctx) => {
  const ref = getInput("ref", { required: true })
  const key = getInput("cache-key", { required: false })
  return {
    cache: {
      disable: getInput("cache-disabled") === "true",
      key: CacheKey.builder(ctx.name)
        .add(ctx.version)
        .addSystem()
        .add(ref, key),
    },
    ref,
    asdfDir: join(homedir(), ".asdf"),
    workDir: getInput("workdir", { required: true }),
    tool: getInput("tool-install") === "true",
  }
})
