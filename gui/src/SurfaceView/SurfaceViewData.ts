import { isArrayOf, isEqualTo, isNumber, optional, validateObject } from "@figurl/core-utils"

export type SurfaceViewData = {
    type: 'vizor.Surface'
    vertices: number[][]
    faces: number[][]
    scalarData?: number[]
    scalarRange?: [number, number]
}

export const isSurfaceViewData = (x: any): x is SurfaceViewData => {
    return validateObject(x, {
        type: isEqualTo('vizor.Surface'),
        vertices: () => (true),
        faces: () => (true),
        scalarData: optional(() => (true)),
        scalarRange: optional(isArrayOf(isNumber))
    })
}