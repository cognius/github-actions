import type { SetupAsdfInput } from "./types"

import { join } from "node:path"
import { homedir } from "node:os"

import { getInput } from "@actions/core"

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
