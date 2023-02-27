import { FunctionComponent, useEffect, useState } from "react";
import SurfaceWidget from "../SurfaceView/SurfaceWidget";
import ScalarDataClient from "./ScalarDataClient";


type Props = {
    vertices: number[][]
    faces: number[][]
    scalarDataClient: ScalarDataClient
    scalarRange: [number, number]
    width: number
    height: number
}

const DynamicSurfaceWidget: FunctionComponent<Props> = ({vertices, faces, scalarDataClient, scalarRange, width, height}) => {
    const [scalarData, setScalarData] = useState<Uint8Array | Float32Array | undefined>()
    useEffect(() => {
        let canceled = false
        ; (async () => {
            const d = await scalarDataClient.getFrame(0)
            if (!d) return
            if (canceled) return
            setScalarData(d)
        })()
        return () => {canceled = true}
    }, [scalarDataClient])
    return (
        <SurfaceWidget
            vertices={vertices}
            faces={faces}
            scalarData={scalarData}
            scalarRange={scalarRange}
            width={width}
            height={height}
        />
    )
}

export default DynamicSurfaceWidget