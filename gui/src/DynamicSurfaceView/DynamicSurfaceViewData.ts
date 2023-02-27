import { isArrayOf, isEqualTo, isNumber, isOneOf, isString, validateObject } from "@figurl/core-utils"

export type DynamicSurfaceViewData = {
    type: 'vizor.DynamicSurface'
    vertices: number[][]
    faces: number[][]
    numFrames: number
    scalarDataType: 'uint8' | 'float32'
    scalarDataUri: string
    scalarRange: [number, number]
}

export const isDynamicSurfaceViewData = (x: any): x is DynamicSurfaceViewData => {
    return validateObject(x, {
        type: isEqualTo('vizor.DynamicSurface'),
        vertices: () => (true),
        faces: () => (true),
        numFrames: isNumber,
        scalarDataType: isOneOf([isEqualTo('uint8'), isEqualTo('float32')]),
        scalarDataUri: isString,
        scalarRange: isArrayOf(isNumber)
    })
}