import { FunctionComponent } from "react";
import Hyperlink from "../components/Hyperlink";
import useRoute from "./useRoute";

type Props = {
    width: number
    height: number
}

const HomePage: FunctionComponent<Props> = ({width, height}) => {
    const {setPage} = useRoute()
    return (
        <div style={{margin: 20}}>
            <h1>Vizor</h1>
            <p><a href="http://github.com/scratchrealm/vizor">http://github.com/scratchrealm/vizor</a></p>
            <p><a href="https://github.com/scratchrealm/vizor/tree/main/examples">Python examples</a></p>
            <Hyperlink onClick={() => {setPage({page: 'e1'})}}>Example 1</Hyperlink>
        </div>
    )
}

export default HomePage