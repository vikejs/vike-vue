import { isObject } from './isObject'

// Same as `Object.assign()` but with type inference
export function objectAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum,
): asserts obj is Obj & ObjAddendum {
  Object.assign(obj, objAddendum)
}

export function objectCleanAssign<Obj extends object, ObjAddendum>(
  obj: Obj,
  objAddendum: ObjAddendum,
): asserts obj is Obj & ObjAddendum {
  const objCleanup: any = {}
  const keys = Object.keys(obj)
  const cleanAllKeys = !isObject(objAddendum)
  for (let i = keys.length; --i >= 0; ) {
    if (cleanAllKeys || !objAddendum.hasOwnProperty(keys[i] as string)) {
      objCleanup[keys[i] as string] = undefined
    }
  }
  Object.assign(obj, objCleanup, objAddendum)
}
