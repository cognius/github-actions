import { getInput, setOutput, setFailed, debug } from "@actions/core"
import { run } from "."

jest.mock("@actions/core")

describe("action", () => {
  const getInputMock = getInput as jest.Mock
  const setOutputMock = setOutput as jest.Mock
  const setFailedMock = setFailed as jest.Mock
  const debugMock = debug as jest.Mock

  // Other utilities
  const timeRegex = /^\d{2}:\d{2}:\d{2}/

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it("sets the time output", async () => {
    getInputMock.mockImplementation((): string => "500")

    await run()

    // Verify that all of the core library functions were called correctly
    expect(debugMock).toHaveBeenNthCalledWith(1, "Waiting 500 milliseconds ...")
    expect(debugMock).toHaveBeenNthCalledWith(
      2,
      expect.stringMatching(timeRegex)
    )
    expect(debugMock).toHaveBeenNthCalledWith(
      3,
      expect.stringMatching(timeRegex)
    )
    expect(setOutputMock).toHaveBeenNthCalledWith(
      1,
      "time",
      expect.stringMatching(timeRegex)
    )
  })

  it("sets a failed status", async () => {
    getInputMock.mockImplementation((): string => "not a number")

    await run()

    // Verify that all of the core library functions were called correctly
    expect(setFailedMock).toHaveBeenNthCalledWith(
      1,
      "milliseconds not a number"
    )
  })
})
