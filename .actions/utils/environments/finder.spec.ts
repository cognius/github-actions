import { mockEnv } from "@utils/mocks/mock"
import { findEnv } from "."

describe("utils.environments.finder", () => {
  test.each([
    ["hello world", { HELLOWORLD: "message" }, "message"],
    ["first-name", { FIRST_NAME: "name" }, "name"],
    ["last.name", { LAST__NAME: "last" }, "last"],
    ["", { HELLO: "world" }, undefined],
    ["name", { HELLO: "world" }, undefined],
  ])(
    "find environment of '%p' from '%p' should return %s",
    (name, obj, expected) => {
      mockEnv(obj, () => {
        const output = findEnv(name)
        expect(output).toEqual(expected)
      })
    }
  )

  test("find environment with defaults value", () => {
    const env = {
      NAME: "john",
    }
    mockEnv(env, () => {
      const output = findEnv("invalid", "example")
      expect(output).toEqual("example")
    })
  })
})
