import type { ActionInput } from "@utils/types/actions"

export interface SetupAsdfInput extends ActionInput {
  workDir: string
  asdfDir: string
  ref: string
  tool: {
    install: boolean
  }
}
