import { convert, toInt, convertToInt } from ".."

type Testcases = Array<[unknown, number | Error]>

describe("utils.converters.dtypes.int", () => {
  const cases: Testcases = [
    [
      "hello",
      new Error(
        "Cannot convert hello (string) to int because 'hello is not an integer'"
      ),
    ],
    [123, 123],
  ]

  test.each(cases)(
    "convert(%p) should get either %p or %p",
    async (a, expected) => {
      if (typeof expected === "number") {
        const result = convert(a, toInt)
        // eslint-disable-next-line jest/no-conditional-expect
        expect(result).toEqual(expected)
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(() => convert(a, toInt)).toThrow(expected)
      }
    }
  )

  test.each(cases)(
    "convertToInt(%p) should get either %p or %p",
    async (a, expected) => {
      if (typeof expected === "number") {
        const result = convertToInt(a)
        // eslint-disable-next-line jest/no-conditional-expect
        expect(result).toEqual(expected)
      } else {
        // eslint-disable-next-line jest/no-conditional-expect
        expect(() => convertToInt(a)).toThrow(expected)
      }
    }
  )
})
