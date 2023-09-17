import type { Config } from "./types"

import { Actions } from "@utils/actions"

const config: Config = {
  name: "example",
}

export default Actions.builder<Config>(config)
