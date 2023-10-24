import type { Configuration } from "@rspack/cli"
import StatoscopePlugin from "@statoscope/webpack-plugin"

import { existsSync } from "node:fs"
import { resolve } from "node:path"

type Callback<Conf, NewConf> = (config: Conf, ...args: any) => NewConf
type Merge<BaseObject, Key extends string, Value> = BaseObject & {
  [name in Key]: Value
}
type OmitFirst<T extends any[]> = T extends [any, ...infer R] ? R : never

class ConfigWrapper {
  constructor(private readonly base: Configuration) {}

  setEntry(
    input: Exclude<Configuration["entry"], undefined>,
    condition?: () => boolean
  ): this {
    if (condition === undefined || condition()) {
      this.base.entry = input
    }

    return this
  }

  addEntry(
    input: Exclude<Configuration["entry"], string | string[] | undefined>,
    condition?: () => boolean
  ): this {
    const entry =
      typeof this.base.entry === "object" ? this.base.entry ?? {} : {}
    return this.setEntry(
      {
        ...entry,
        ...input,
      },
      condition
    )
  }

  addEntryByName(
    name: string,
    input: Exclude<
      Configuration["entry"],
      string | string[] | undefined
    >[string],
    condition?: () => boolean
  ): this {
    return this.addEntry(
      {
        [name]: input,
      },
      condition
    )
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
    // console.log(this.base.config)
    return this.base.config as Conf
  }
}

const relative = (...paths: string[]): string => {
  return resolve(__dirname, ...paths)
}

const builder = Config.builder({
  // mode: "development",
  target: "node",
  output: {
    path: relative(".."),
    filename: "[name].js",
  },
  externals: {
    encoding: "encoding",
  },
  resolve: {
    tsConfigPath: "tsconfig.json",
  },
  // https://github.com/statoscope/statoscope/tree/master/packages/webpack-plugin#faq
  stats: {
    all: false, // disable all the stats
    hash: true, // compilation hash
    entrypoints: true, // entrypoints
    chunks: true, // chunks
    chunkModules: true, // modules
    reasons: true, // modules reasons
    ids: true, // IDs of modules and chunks (webpack 5)
    dependentModules: true, // dependent modules of chunks (webpack 5)
    chunkRelations: true, // chunk parents, children and siblings (webpack 5)
    cachedAssets: true, // information about the cached assets (webpack 5)

    nestedModules: true, // concatenated modules
    usedExports: true, // used exports
    providedExports: true, // provided imports
    assets: true, // assets
    chunkOrigins: true, // chunks origins stats (to find out which modules require a chunk)
    version: true, // webpack version
    builtAt: true, // build at time
    timings: true, // modules timing information
    performance: true, // info about oversized assets
    logging: "none",
  },
  plugins: [
    new StatoscopePlugin({
      saveReportTo: "reports/[name].html",
      saveStatsTo: "reports/[name].json",
      normalizeStats: false,
      saveOnlyStats: false,
      disableReportCompression: false,
      watchMode: false,
      open: false,
      name: "actions-stats",
      compressor: "gzip",
    }) as any,
  ],
}).define("module", (config, name: string) => {
  const basepath = relative("src", name)
  const preScript = resolve(basepath, "pre.ts")
  const postScript = resolve(basepath, "post.ts")

  return config
    .addEntryByName(`${name}/index`, basepath)
    .addEntryByName(`${name}/pre`, preScript, () => existsSync(preScript))
    .addEntryByName(`${name}/post`, postScript, () => existsSync(postScript))
    .copy(name, basepath, "README.md")
    .copy(name, basepath, "action.yaml")
})

export default builder
  .use("module", "example-ts")
  // .use("module", "create-hosts")
  // .use("module", "setup-asdf")
  .build()
