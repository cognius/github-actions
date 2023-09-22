class NoSuchEnvironment extends Error {
  constructor(key: string) {
    super(`Environment $${key} is required, but not defined`)
  }
}

class InvalidEnvironmentType extends Error {
  constructor(data: string, type: string) {
    super(`Cannot convert ${data} to ${type}`)
  }
}

export type Converter<T> = (value: string) => T

const get = <T>(key: string, converter: Converter<T>, def?: T): T => {
  const value = process.env[key]
  if (typeof value === "string" && value !== "") return converter(value)
  if (def !== undefined && def !== null) return def
  throw new NoSuchEnvironment(key)
}

export const getEnvValue = (key: string, def?: string): string => {
  return get(key, (v) => v, def)
}

const toInt: Converter<number> = (v) => {
  const num = parseInt(v, 10)
  if (isFinite(num)) return num
  else throw new InvalidEnvironmentType(v, "integer")
}
export const getEnvInt = (key: string, def?: number): number => {
  return get(key, toInt, def)
}

const toFloat: Converter<number> = (v) => {
  const num = parseFloat(v)
  if (isFinite(num)) return num
  else throw new InvalidEnvironmentType(v, "float")
}
export const getEnvFloat = (key: string, def?: number): number => {
  return get(key, toFloat, def)
}

const toBoolean: Converter<boolean> = (v) => {
  const lv = v.toLowerCase()
  if (lv === "t" || lv === "true" || lv === "1" || lv === "on") return true
  else if (lv === "f" || lv === "false" || lv === "0" || lv === "off")
    return false
  else throw new InvalidEnvironmentType(v, "boolean")
}
export const getEnvFlag = (key: string, def?: boolean): boolean => {
  return get(key, toBoolean, def)
}
