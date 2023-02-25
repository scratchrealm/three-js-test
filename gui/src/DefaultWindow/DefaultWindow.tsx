import { FunctionComponent } from "react";
import { BrowserRouter } from "react-router-dom";
import Routes from "./Routes";

type Props = {
    width: number
    height: number
}

const DefaultWindow: FunctionComponent<Props> = ({width, height}) => {
    return (
        <BrowserRouter>
            <Routes width={width} height={height} />
        </BrowserRouter>
    )
}

export default DefaultWindow