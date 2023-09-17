import type { BaseConfig } from "@utils/actions"

export interface Config extends BaseConfig {
  tableFile: string
  hosts: string[]
  ip: string
}
