export const asMock = <Input extends jest.MockableFunction>(
  input: Input
): jest.MockedFn<Input> => {
  return input as jest.MockedFn<Input>
}
