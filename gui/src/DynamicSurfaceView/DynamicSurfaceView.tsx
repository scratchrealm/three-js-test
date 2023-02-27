import { FunctionComponent, useMemo } from "react";
import { DynamicSurfaceViewData } from "./DynamicSurfaceViewData";
import DynamicSurfaceWidget from "./DynamicSurfaceWidget";
import ScalarDataClient from "./ScalarDataClient";

type Props = {
    data: DynamicSurfaceViewData
    width: number
    height: number
}

const DynamicSurfaceView: FunctionComponent<Props> = ({data, width, height}) => {
    const {vertices, faces, numFrames, scalarDataType, scalarDataUri, scalarRange} = data
    const scalarDataClient = useMemo(() => (
        new ScalarDataClient(scalarDataUri, {numFrames, scalarDataType, numVertices: vertices.length})
    ), [scalarDataUri, numFrames, scalarDataType, vertices.length])
    return (
        <DynamicSurfaceWidget
            vertices={vertices}
            faces={faces}
            scalarDataClient={scalarDataClient}
            scalarRange={scalarRange}
            width={width}
            height={height}
        />
    )

}

export default DynamicSurfaceView