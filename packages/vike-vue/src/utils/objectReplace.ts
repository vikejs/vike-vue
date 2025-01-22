export function objectReplace(obj: object, objAddendum: object) {
  Object.keys(obj).forEach((key) => delete obj[key as keyof typeof obj])
  Object.assign(obj, objAddendum)
}
