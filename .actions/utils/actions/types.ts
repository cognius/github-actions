export interface BaseConfig {
  name: string
}

export type RunnerEvent = "pre" | "run" | "post"

export type Runner<C extends BaseConfig> = (config: C) => Promise<void>
