import { FunctionComponent, useMemo } from "react";
import Hyperlink from "../components/Hyperlink";
import SurfaceWidget from "../SurfaceView/SurfaceWidget";
import useRoute from "./useRoute";

type Props = {
    width: number
    height: number
}

const topBarHeight = 40

const E1Page: FunctionComponent<Props> = ({width, height}) => {
    const {setPage} = useRoute()
    const {vertices, faces, scalarData, scalarRange} = useMemo(() => (getSampleData()), [])
    return (
        <div>
            <div style={{position: 'absolute', width, height: topBarHeight, marginLeft: 20}}>
                <h3><Hyperlink onClick={() => setPage({page: 'home'})}>Back</Hyperlink></h3>
            </div>
            <div style={{position: 'absolute', width, top: topBarHeight, height: height - topBarHeight}}>
                <SurfaceWidget
                    width={width}
                    height={height}
                    vertices={vertices}
                    faces={faces}
                    scalarData={scalarData}
                    scalarRange={scalarRange}
                />
            </div>
        </div>
    )
}

const getSampleData = () => {
    const vertices: number[][] = []
    const faces: number[][] = []
    const scalarData: number[] = []

    const n = 10
    for (let j = 0; j < n; j++) {
        const x0 = j * 3
        const y0 = 0
        const z0 = 0
        const i = vertices.length
        vertices.push([x0, y0, z0])
        vertices.push([x0 + 2, y0, z0])
        vertices.push([x0, y0 + 4, z0])
        vertices.push([x0 - 2, y0 - 3, z0 + 4])

        faces.push([i, i + 1, i + 2])
        faces.push([i, i + 1, i + 3])
        faces.push([i, i + 2, i + 3])

        scalarData.push(j)
        scalarData.push(j)
        scalarData.push(j)
        scalarData.push(j)
    }
    const scalarRange=[0, n] as [number, number]
    return {vertices, faces, scalarData, scalarRange}
}

export default E1Page