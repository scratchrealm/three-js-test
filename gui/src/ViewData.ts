import { isOneOf } from "@figurl/core-utils"
import { DynamicSurfaceViewData, isDynamicSurfaceViewData } from "./DynamicSurfaceView/DynamicSurfaceViewData"
import { isSurfaceViewData, SurfaceViewData } from "./SurfaceView/SurfaceViewData"

export type ViewData = SurfaceViewData | DynamicSurfaceViewData

export const isViewData = (x: any): x is ViewData => (
    isOneOf([
        isSurfaceViewData,
        isDynamicSurfaceViewData
    ])(x)
)