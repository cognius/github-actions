import { debug } from "@actions/core"
import { DefaultContext } from "./context"

jest.mock("@actions/core")

describe("default context", () => {
  test.each([
    ["string", "string"],
    [["a", "b"], "[a,b]"],
    [{ a: "a", b: true }, '{"a":"a","b":true}'],
    [undefined, "<undefined>"],
    [null, "<null>"],
    [123, "123"],
    [0.333, "0.333"],
    [true, "true"],
    [false, "false"],
    [console.log, "<Function log>"],
    [Symbol.for("hello"), "Symbol(hello)"],
  ])("context.debug('%p') should log '%p'", (input, output) => {
    const context = new DefaultContext("asdf", "v1.0.0")

    context.debug(input)

    expect(debug).toHaveBeenCalledTimes(1)
    expect(debug).toHaveBeenCalledWith(output)
  })
})
