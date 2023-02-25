import { FunctionComponent } from "react";
import SurfaceView from "./SurfaceView/SurfaceView";
import { ViewData } from "./ViewData";

type Props = {
    data: ViewData
    width: number
    height: number
}

const View: FunctionComponent<Props> = ({data, width, height}) => {
    if (data.type === 'vizor.surface') {
        return <SurfaceView data={data} width={width} height={height} />
    }
    else return <div>Unexpected view type</div>
}

export default View