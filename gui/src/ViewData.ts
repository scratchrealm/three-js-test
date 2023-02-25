import { isArrayOf, isEqualTo, isNumber, isString, optional, validateObject } from "@figurl/core-utils"

export type ViewData = {
    type: 'vizor.Surface'
    vertices: number[][]
    faces: number[][]
    scalarData?: number[]
    scalarRange?: [number, number]
}

export const isViewData = (x: any): x is ViewData => {
    return validateObject(x, {
        type: isEqualTo('vizor.Surface'),
        vertices: () => (true),
        faces: () => (true),
        scalarData: optional(() => (true)),
        scalarRange: optional(isArrayOf(isNumber))
    })
}