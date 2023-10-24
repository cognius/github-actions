import type { BaseContext } from "./types"

import { debug } from "@actions/core"

export class DefaultContext implements BaseContext {
  constructor(
    readonly name: string,
    readonly version: string
  ) {}

  debug<T>(msg: T): void {
    if (msg === undefined) debug("<undefined>")
    else if (msg === null) debug("<null>")
    else if (Array.isArray(msg)) debug(`[${msg.toString()}]`)
    else if (typeof msg === "object") debug(JSON.stringify(msg))
    else if (typeof msg === "symbol") debug(msg.toString())
    else if (typeof msg === "function") debug(`<Function ${msg.name}>`)
    else debug(`${msg as string}`)
  }
}
