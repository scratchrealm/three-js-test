import { FunctionComponent } from "react";
import E1Page from "./E1Page";
import HomePage from "./HomePage";
import useRoute from "./useRoute";

type Props = {
    width: number
    height: number
}

const Routes: FunctionComponent<Props> = ({width, height}) => {
    const {page} = useRoute()
    return (
        page.page === 'home' ? (
            <HomePage width={width} height={height} />
        ) : page.page === 'e1' ? (
            <E1Page width={width} height={height} />
        ) : <span />
    )
}

export default Routes