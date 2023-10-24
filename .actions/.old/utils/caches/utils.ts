export const getPlatform = (): NodeJS.Platform => {
  return process.platform
}

export const getArch = (): NodeJS.Architecture => {
  return process.arch
}
