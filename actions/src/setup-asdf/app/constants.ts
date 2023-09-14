import type { SetupAsdfInput } from "./types"

import { join } from "node:path"
import { homedir } from "node:os"

import { getInput } from "@actions/core"
import { CacheKey } from "@utils/caches"

export const skippedSetup =
  "Found asdf command on current environment, skipped setup"

export const defaultInput: SetupAsdfInput = {
  name: "asdf",
  ref: getInput("ref", { required: true }),
  asdfDir: join(homedir(), ".asdf"),
  workDir: getInput("workdir", { required: true }),
  tool: {
    install: getInput("tool_install", { required: true }) === "true",
  },
}

export const cacheKey = CacheKey.builder(defaultInput.name)
  .add(process.platform)
  .add(defaultInput.ref)
