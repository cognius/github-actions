export interface ActionInput {
  name: string
}

export type ActionRunner<Input extends ActionInput> = (
  input: Input
) => Promise<void>
