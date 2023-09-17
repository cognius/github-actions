import type { BaseConfig, RunnerEvent, Runner } from "./types"

import { setFailed } from "@actions/core"

export type Builder<T> = () => T

class Actions<C extends BaseConfig> {
  static builder<C extends BaseConfig>(builder: Builder<C>): Actions<C> {
    return new Actions(builder)
  }

  private constructor(private readonly builder: Builder<C>) {}

  async exec(runner: Runner<C>, config?: Partial<C>): Promise<void> {
    try {
      const defaultConfig = this.builder()
      await runner(Object.assign(defaultConfig, config))
    } catch (error) {
      setFailed(error as Error)
    }
  }
}

export { Actions }
export type { BaseConfig, RunnerEvent, Runner }
