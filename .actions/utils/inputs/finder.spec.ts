import { getInput } from "@actions/core"
import { toString } from "@utils/converters"
import { asMock, mockEnv } from "@utils/mocks"

import { findInputs } from "."

jest.mock("@actions/core")

describe("utils.inputs.finder", () => {
  test("impossible case: getInput return null", () => {
    asMock(getInput).mockReturnValueOnce(null as unknown as string)
    mockEnv({}, () => {
      const input = findInputs("test", toString)
      expect(input).toBeUndefined()
    })
  })

  test("if inputs is missing", () => {
    asMock(getInput).mockReturnValueOnce("")
    mockEnv({}, () => {
      const input = findInputs("test", toString)
      expect(input).toBeUndefined()
    })
  })

  test("if found inputs on env", () => {
    asMock(getInput).mockReturnValueOnce("")
    mockEnv({ TEST: "hello" }, () => {
      const input = findInputs("test", toString)
      expect(input).toEqual("hello")
    })
  })

  test("if found inputs on input", () => {
    asMock(getInput).mockImplementationOnce((name) => {
      switch (name) {
        case "test":
          return "hello"
        default:
          return ""
      }
    })
    mockEnv({}, () => {
      const input = findInputs("test", toString)
      expect(input).toEqual("hello")
    })
  })
})
