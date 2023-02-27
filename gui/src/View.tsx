import { FunctionComponent } from "react";
import DynamicSurfaceView from "./DynamicSurfaceView/DynamicSurfaceView";
import SurfaceView from "./SurfaceView/SurfaceView";
import { ViewData } from "./ViewData";

type Props = {
    data: ViewData
    width: number
    height: number
}

const View: FunctionComponent<Props> = ({data, width, height}) => {
    if (data.type === 'vizor.Surface') {
        return <SurfaceView data={data} width={width} height={height} />
    }
    else if (data.type === 'vizor.DynamicSurface') {
        return <DynamicSurfaceView data={data} width={width} height={height} />
    }
    else return <div>Unexpected view type</div>
}

export default View