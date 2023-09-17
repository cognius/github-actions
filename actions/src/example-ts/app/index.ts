import type { Config } from "./types"

import { Actions } from "@utils/actions"

export default Actions.builder<Config>(() => {
  return { name: "example" }
})
