import { DefaultContext } from "."

describe("utils.actions.context", () => {
  const context = new DefaultContext("example", "v1.0.0")

  test("format with object data", () => {
    expect(context.format("hello {name}", { name: "world" })).toEqual(
      "hello world"
    )
  })

  test("format with array data", () => {
    expect(context.format("hello {0}", "world")).toEqual("hello world")
  })
})
