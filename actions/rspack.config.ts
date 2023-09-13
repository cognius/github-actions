import type { Configuration } from "@rspack/cli"
import { resolve } from "node:path"

type Callback<Conf, NewConf> = (config: Conf, ...args: any) => NewConf
type Merge<BaseObject, Key extends string, Value> = BaseObject & {
  [name in Key]: Value
}
type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never

class ConfigWrapper {
  constructor(private readonly base: Configuration) {}

  setEntry(input: Exclude<Configuration["entry"], undefined>): this {
    this.base.entry = input
    return this
  }

  addEntry(
    input: Exclude<Configuration["entry"], string | string[] | undefined>
  ): this {
    const entry =
      typeof this.base.entry === "object" ? this.base.entry ?? {} : {}
    this.base.entry = {
      ...entry,
      ...input,
    }
    return this
  }

  addEntryByName(
    name: string,
    input: Exclude<
      Configuration["entry"],
      string | string[] | undefined
    >[string]
  ): this {
    const entry =
      typeof this.base.entry === "object" ? this.base.entry ?? {} : {}
    this.base.entry = {
      ...entry,
      [name]: input,
    }
    return this
  }

  copy(name: string, basepath: string, ...paths: string[]): this {
    this.base.builtins = this.base.builtins ?? {}
    this.base.builtins.copy = this.base.builtins?.copy ?? { patterns: [] }

    const patterns = this.base.builtins?.copy?.patterns ?? []
    patterns.push({
      from: resolve(basepath, ...paths),
      to: resolve(this.base.output?.path ?? "", name, ...paths),
    })

    this.base.builtins.copy.patterns = patterns
    return this
  }

  get config(): Configuration {
    return this.base
  }
}

class Config<
  Conf,
  Callbacks extends Record<
    string,
    Callback<unknown, unknown>
  > = NonNullable<unknown>,
> {
  static builder<Conf extends Configuration>(base: Conf): Config<Conf> {
    return new Config(new ConfigWrapper(base))
  }

  private callbacks: Record<string, Callback<unknown, unknown>>
  private constructor(private readonly base: ConfigWrapper) {
    this.callbacks = {}
  }

  define<
    Name extends string,
    CB extends Callback<ConfigWrapper, ConfigWrapper>,
  >(name: Name, callback: CB): Config<Conf, Merge<Callbacks, Name, CB>> {
    this.callbacks[name] = callback as unknown as Callbacks[Name]
    return this as unknown as Config<Conf, Merge<Callbacks, Name, CB>>
  }

  use<Name extends keyof Callbacks>(
    name: Name,
    ...args: OmitFirst<Parameters<Callbacks[Name]>>
  ): Config<ReturnType<Callbacks[Name]>, Callbacks> {
    this.callbacks[name as string](this.base, ...args) as ConfigWrapper
    return this as unknown as Config<ReturnType<Callbacks[Name]>, Callbacks>
  }

  build(): Conf {
    return this.base.config as Conf
  }
}

const relative = (...paths: string[]): string => {
  return resolve(__dirname, ...paths)
}

const builder = Config.builder({
  target: "node",
  output: {
    path: relative("..", ".github", "actions"),
    filename: "[name]/index.js",
  },
  externals: {
    encoding: "encoding",
  },
  resolve: {
    tsConfigPath: "tsconfig.json",
  },
}).define("module", (config, name: string) => {
  const basepath = relative("src", name)
  return config
    .addEntryByName(name, basepath)
    .copy(name, basepath, "README.md")
    .copy(name, basepath, "action.yaml")
})

export default builder
  .use("module", "example-ts")
  .use("module", "setup-asdf")
  .build()
