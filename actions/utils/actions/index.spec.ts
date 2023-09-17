import { Actions, type Runner, type BaseConfig } from "."

interface Config extends BaseConfig {
  hello: string
}

// TODO: This is only example code, we didn't implement tests yet.
describe("Actions", () => {
  const defaultConfig: Config = {
    name: "default",
    hello: "world",
  }

  const run: Runner<Config> = async (config) => {}

  const actions = Actions.builder(defaultConfig)

  test("create", async () => {
    await actions.exec(run)
    expect(true).toBe(true)
  })
})
