import { getInput, type InputOptions } from "@actions/core"

export class Input<Obj> {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  static builder() {
    return new Input()
  }

  private readonly data: Record<string, unknown>
  private constructor() {
    this.data = {}
  }

  addString<K extends string>(key: K, def?: string, option?: InputOptions) {
    return this.add(key, def, option)
  }

  add<K extends string, V>(
    key: K,
    defaultValue?: V,
    option?: InputOptions
  ): Input<Obj & Record<K, V>> {
    const defaultOption: InputOptions = {
      required: defaultValue == null,
    }

    const value = getInput(key, Object.assign({}, defaultOption, option))
    this.data[key] = value

    return this as Input<Obj & Record<K, V>>
  }

  build(): Obj {
    return this.data as Obj
  }
}
