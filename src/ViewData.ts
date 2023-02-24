import { isEqualTo, isString, validateObject } from "@figurl/core-utils"

export type ViewData = {
    type: 'surface'
    surfaceUri: string
}

export const isViewData = (x: any): x is ViewData => {
    return validateObject(x, {
        type: isEqualTo('surface'),
        surfaceUri: isString
    })
}