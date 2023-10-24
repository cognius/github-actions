const buildKey = (name: string) => {
  return name
    .replace(".", "__")
    .replace("-", "_")
    .replace(" ", "")
    .toUpperCase()
}

export const findEnv = (
  name: string,
  defaults?: string,
  env: Record<string, string | undefined> = process.env
): string | undefined => {
  const key = buildKey(name)
  return env[key] ?? defaults
}
