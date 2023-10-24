import type { Actions, BaseContext, Runner } from "@utils/actions"

export const mockRunner = <Input extends object, Context extends BaseContext>(
  _: Actions<Input, Context>
) => {
  return jest.fn<Promise<void>, Parameters<Runner<Input, Context>>>()
}

export const mockEnv = <Env extends NodeJS.ProcessEnv>(
  env: Env,
  callback: (env: Env) => void
) => {
  const mock = jest.replaceProperty(process, "env", env)

  try {
    callback(env)
  } finally {
    mock.restore()
  }
}
