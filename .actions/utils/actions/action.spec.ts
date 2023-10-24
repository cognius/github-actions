import { Actions, DefaultContext, type BaseContext, type Runner } from "."

describe("utils.actions.action", () => {
  const mockRunner = <Input extends object, Context extends BaseContext>(
    _: Actions<Input, Context>
  ) => {
    return jest.fn<Promise<void>, Parameters<Runner<Input, Context>>>()
  }

  const context = new DefaultContext("", "")
  const input = { a: "animal", b: "bee", c: 123, d: false }
  const action = Actions.builder(() => input, context)

  test("use default data from builder", async () => {
    const fn = mockRunner(action)
    await action.exec(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith({ input }, context)
  })

  test("use custom data", async () => {
    const fn = mockRunner(action)
    await action.exec(fn, { c: 1234 })

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith(
      {
        input: {
          a: "animal",
          b: "bee",
          c: 1234,
          d: false,
        },
      },
      context
    )
  })
})
