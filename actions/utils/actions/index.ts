import type { BaseConfig, RunnerEvent, Runner } from "./types"

import { setFailed } from "@actions/core"

class Actions<C extends BaseConfig> {
  static builder<C extends BaseConfig>(config: C): Actions<C> {
    return new Actions(config)
  }

  private constructor(private readonly config: C) {}

  async exec(runner: Runner<C>, config?: C): Promise<void> {
    try {
      await runner(config ?? this.config)
    } catch (error) {
      setFailed(error as Error)
    }
  }
}

export { Actions }
export type { BaseConfig, RunnerEvent, Runner }
