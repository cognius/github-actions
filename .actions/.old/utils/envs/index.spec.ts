import { getEnvValue, getEnvInt, getEnvFloat, getEnvFlag } from "."

describe("environment variable utils", () => {
  describe("string", () => {
    test.each([
      ["string", undefined, "string"],
      [undefined, "default", "default"],
    ])(
      "ENV='%s' getEnvValue(ENV, '%s') should return '%p'",
      async (value, def, expected) => {
        const env =
          typeof value === "string"
            ? jest.replaceProperty(process, "env", {
                ENV: value,
              })
            : undefined

        const output = getEnvValue("ENV", def)
        expect(output).toEqual(expected)
        env?.restore()
      }
    )

    test.each([
      [
        undefined,
        undefined,
        new Error("Environment $ENV is required, but not defined"),
      ],
    ])(
      "ENV='%s' getEnvValue(ENV, '%s') should throw '%p'",
      async (value, def, expected) => {
        const env =
          typeof value === "string"
            ? jest.replaceProperty(process, "env", {
                ENV: value,
              })
            : undefined

        expect(() => getEnvValue("ENV", def)).toThrow(expected)
        env?.restore()
      }
    )
  })

  describe("integer", () => {
    test.each([
      ["123", undefined, 123],
      [undefined, 123, 123],
      ["12A", undefined, 12],
    ])(
      "ENV='%s' getEnvInt(ENV, '%s') should return '%p'",
      async (value, def, expected) => {
        const env =
          typeof value === "string"
            ? jest.replaceProperty(process, "env", {
                ENV: value,
              })
            : undefined

        const output = getEnvInt("ENV", def)
        expect(output).toEqual(expected)
        env?.restore()
      }
    )

    test.each([
      [
        undefined,
        undefined,
        new Error("Environment $ENV is required, but not defined"),
      ],
      ["A12", undefined, new Error("Cannot convert A12 to integer")],
    ])(
      "ENV='%s' getEnvInt(ENV, '%s') should throw '%p'",
      async (value, def, expected) => {
        const env =
          typeof value === "string"
            ? jest.replaceProperty(process, "env", {
                ENV: value,
              })
            : undefined

        expect(() => getEnvInt("ENV", def)).toThrow(expected)
        env?.restore()
      }
    )
  })

  describe("float", () => {
    test.each([
      ["123.11", undefined, 123.11],
      [undefined, 123, 123],
      ["12A", undefined, 12],
    ])(
      "ENV='%s' getEnvFloat(ENV, '%s') should return '%p'",
      async (value, def, expected) => {
        const env =
          typeof value === "string"
            ? jest.replaceProperty(process, "env", {
                ENV: value,
              })
            : undefined

        const output = getEnvFloat("ENV", def)
        expect(output).toEqual(expected)
        env?.restore()
      }
    )

    test.each([
      [
        undefined,
        undefined,
        new Error("Environment $ENV is required, but not defined"),
      ],
      ["A12", undefined, new Error("Cannot convert A12 to float")],
    ])(
      "ENV='%s' getEnvFloat(ENV, '%s') should throw '%p'",
      async (value, def, expected) => {
        const env =
          typeof value === "string"
            ? jest.replaceProperty(process, "env", {
                ENV: value,
              })
            : undefined

        expect(() => getEnvFloat("ENV", def)).toThrow(expected)
        env?.restore()
      }
    )
  })

  describe("boolean", () => {
    test.each([
      ["true", undefined, true],
      ["True", undefined, true],
      ["T", undefined, true],
      ["1", undefined, true],
      ["on", undefined, true],
      ["ON", undefined, true],
      [undefined, true, true],
      ["false", undefined, false],
      ["FALSE", undefined, false],
      ["F", undefined, false],
      ["0", undefined, false],
      ["Off", undefined, false],
      ["off", undefined, false],
      [undefined, false, false],
    ])(
      "ENV='%s' getEnvFlag(ENV, '%s') should return '%p'",
      async (value, def, expected) => {
        const env =
          typeof value === "string"
            ? jest.replaceProperty(process, "env", {
                ENV: value,
              })
            : undefined

        const output = getEnvFlag("ENV", def)
        expect(output).toEqual(expected)
        env?.restore()
      }
    )

    test.each([
      [
        undefined,
        undefined,
        new Error("Environment $ENV is required, but not defined"),
      ],
      ["abc", undefined, new Error("Cannot convert abc to boolean")],
    ])(
      "ENV='%s' getEnvFlag(ENV, '%s') should throw '%p'",
      async (value, def, expected) => {
        const env =
          typeof value === "string"
            ? jest.replaceProperty(process, "env", {
                ENV: value,
              })
            : undefined

        expect(() => getEnvFlag("ENV", def)).toThrow(expected)
        env?.restore()
      }
    )
  })
})
