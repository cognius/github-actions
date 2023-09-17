import app from "."

jest.mock("@actions/core")

describe("action application", () => {
  test("contains export default", () => {
    expect(app).toBeDefined()
  })

  test("executes default config", async () => {
    const fn = jest.fn()
    await app.exec(fn)

    expect(fn).toHaveBeenCalledTimes(1)
    expect(fn).toHaveBeenCalledWith({
      name: "example",
    })
  })
})
