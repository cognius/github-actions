import type { ActionInput } from "@utils/types/actions"

export interface SetupAsdfInput extends ActionInput {
  asdfDir: string
  ref: string
}
