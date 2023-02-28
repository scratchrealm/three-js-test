import { PlayArrow, Stop } from "@mui/icons-material";
import { createTheme, FormControl, IconButton, MenuItem, Select, SelectChangeEvent, Slider, ThemeProvider } from "@mui/material";
import { FunctionComponent, useCallback, useEffect, useRef, useState } from "react";
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
    const bottomBarHeight = 50

    const [currentFrame, setCurrentFrame] = useState<number>(0)

    const [playing, setPlaying] = useState<boolean>(false)
	const [playbackRate, setPlaybackRate] = useState<number>(5)
	const handlePlay = useCallback(() => {
		setPlaying(true)
	}, [])
	const handleStop = useCallback(() => {
		setPlaying(false)
	}, [])
	const currentFrameRef = useRef<number>(currentFrame || 0)
	useEffect(() => {
		currentFrameRef.current = currentFrame || 0
	}, [currentFrame])

    useEffect(() => {
        let canceled = false
        ; (async () => {
            const d = await scalarDataClient.getFrame(currentFrame)
            if (!d) return
            if (canceled) return
            setScalarData(d)
        })()
        return () => {canceled = true}
    }, [scalarDataClient, currentFrame])

    useEffect(() => {
		if (!playing) return
		let canceled = false
		const startFrame = currentFrameRef.current
		const timer = Date.now()
		let rr = 0
		const update = () => {
			const elapsed = (Date.now() - timer) / 1000
			setCurrentFrame(Math.min(Math.floor(startFrame + elapsed * playbackRate), scalarDataClient.numFrames - 1))
			setTimeout(() => { // apparently it's important to use a small timeout here so the controls still work (e.g., the slider)
				if (canceled) return
				rr = requestAnimationFrame(update)
			}, 10)
		}
		rr = requestAnimationFrame(update)
		return () => {cancelAnimationFrame(rr); canceled = true}
	}, [playing, setCurrentFrame, playbackRate, scalarDataClient.numFrames])

    const height2 = height - bottomBarHeight

    return (
        <div>
            <SurfaceWidget
                vertices={vertices}
                faces={faces}
                scalarData={scalarData}
                scalarRange={scalarRange}
                width={width}
                height={height2}
            />
            <div>
                <ThemeProvider theme={theme}>
                    <div style={{position: 'absolute', width, height: bottomBarHeight, top: height2}}>
                        {!playing && <IconButton title="Play video" disabled={playing} onClick={handlePlay}><PlayArrow /></IconButton>}
                        {playing && <IconButton title="Stop video" disabled={!playing} onClick={handleStop}><Stop /></IconButton>}
                        <PlaybackRateControl disabled={playing} playbackRate={playbackRate} setPlaybackRate={setPlaybackRate} />
                        &nbsp;
                        <FormControl size="small">
                            <Slider
                                min={0}
                                max={scalarDataClient.numFrames - 1}
                                step={1}
                                style={{width: 300}}
                                value={currentFrame || 0}
                                onChange={(e, v) => {setCurrentFrame(v as number)}}
                                disabled={playing}
                            />
                        </FormControl>
                    </div>
                </ThemeProvider>
            </div>
        </div>
    )
}

const theme = createTheme({
	components: {
		MuiSlider: {
			styleOverrides: {
				root: {
					paddingTop: 25,
					marginLeft: 10
				}	
			}
		}
	}
})

const PlaybackRateControl: FunctionComponent<{disabled: boolean, playbackRate: number, setPlaybackRate: (x: number) => void}> = ({disabled, playbackRate, setPlaybackRate}) => {
	const handleChange = useCallback((e: SelectChangeEvent) => {
		setPlaybackRate(parseFloat(e.target.value))
	}, [setPlaybackRate])
	return (
		<FormControl size="small">
			<Select disabled={disabled} onChange={handleChange} value={playbackRate + ''}>
				<MenuItem key={1} value={1}>1 fps</MenuItem>
				<MenuItem key={2} value={2}>2 fps</MenuItem>
				<MenuItem key={3} value={3}>3 fps</MenuItem>
				<MenuItem key={5} value={5}>5 fps</MenuItem>
				<MenuItem key={10} value={10}>10 fps</MenuItem>
				<MenuItem key={20} value={20}>20 fps</MenuItem>
				<MenuItem key={50} value={50}>50 fps</MenuItem>
			</Select>
		</FormControl>
	)
}

export default DynamicSurfaceWidget