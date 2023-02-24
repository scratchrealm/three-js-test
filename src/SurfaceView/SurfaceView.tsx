import { useFileData } from "@figurl/interface";
import { FunctionComponent } from "react";
import { ViewData } from "../ViewData";
import SurfaceWidget from "./SurfaceWidget";

type Props = {
    data: ViewData
    width: number
    height: number
}

const SurfaceView: FunctionComponent<Props> = ({data, width, height}) => {
    const {fileData} = useFileData(data.surfaceUri)
    if (!fileData) return <div>Loading data</div>
    return (
        <SurfaceWidget
            vertices={fileData.vertices}
            faces={fileData.faces}
            scalarData={fileData.scalarData}
            scalarRange={fileData.scalarRange}
            width={width}
            height={height}
        />
    )

}

export default SurfaceView