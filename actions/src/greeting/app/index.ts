import { getInput, setFailed, setOutput, debug } from "@actions/core"
import { context } from "@actions/github"

const wait = async (milliseconds: number): Promise<string> => {
  return await new Promise((resolve) => {
    if (isNaN(milliseconds)) {
      throw new Error("milliseconds not a number")
    }

    setTimeout(() => resolve("done!"), milliseconds)
  })
}

export const run = async (): Promise<void> => {
  try {
    const ms: string = getInput("milliseconds")

    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    debug(`Waiting ${ms} milliseconds ...`)

    // Log the current timestamp, wait, then log the new timestamp
    debug(new Date().toTimeString())
    await wait(parseInt(ms, 10))
    debug(new Date().toTimeString())

    // Set outputs for other workflow steps to use
    setOutput("time", new Date().toTimeString())
    debug(JSON.stringify(context, undefined, 2))
  } catch (error) {
    setFailed((error as Error).message)
  }
}
