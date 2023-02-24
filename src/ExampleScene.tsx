import { FunctionComponent, useEffect, useMemo, useState } from "react";
import * as THREE from 'three'
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls'
import useWindowDimensions from "./useWindowDimensions";

const ExampleScene: FunctionComponent = () => {
    const [container, setContainer] = useState<HTMLDivElement | null>()

    const {width, height} = useWindowDimensions()

    const renderer = useMemo(() => {
        const renderer = new THREE.WebGLRenderer()
        return renderer
    }, [])

    const cube = useMemo(() => {
        const geometry = new THREE.BoxGeometry( 20, 20, 10 )
        // const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } )
        const material = new THREE.MeshLambertMaterial( { color: 0xffffff } )
        const cube = new THREE.Mesh( geometry, material )
        cube.position.set(0, 0, -30)
        return cube
    }, [])

    const surface = useMemo(() => {
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
        const scalarDataRange=[0, n] as [number, number]
        return surfaceMesh(
            vertices, faces, scalarData, scalarDataRange
        )
    }, [])

    const lines = useMemo(() => {
        const lines: THREE.Line[] = []
        const material = new THREE.LineBasicMaterial( { color: 0xffffff } )

        {
            const points = []
            points.push( new THREE.Vector3( 10, 0, 0 ) )
            points.push( new THREE.Vector3( 0, 0, 0 ) )
            points.push( new THREE.Vector3( 0, 10, 0 ) )
            const geometry = new THREE.BufferGeometry().setFromPoints( points )

            lines.push(new THREE.Line( geometry, material ))
        }
        {
            const points = []
            points.push( new THREE.Vector3( 0, 40, 0 ) )
            points.push( new THREE.Vector3( 0, 30, 0 ) )
            points.push( new THREE.Vector3( 0, 30, 10 ) )
            const geometry = new THREE.BufferGeometry().setFromPoints( points )

            lines.push(new THREE.Line( geometry, material ))
        }
        {
            const points = []
            points.push( new THREE.Vector3( 0, 10, 30 ) )
            points.push( new THREE.Vector3( 0, 0, 30 ) )
            points.push( new THREE.Vector3( 0, 0, 40 ) )
            const geometry = new THREE.BufferGeometry().setFromPoints( points )

            lines.push(new THREE.Line( geometry, material ))
        }

        return lines
    }, [])

    const lights = useMemo(() => {
        const pointLight1 = new THREE.PointLight(0xffffff, 0.6, 1000)
        pointLight1.position.set(0, 0, 0)

        const pointLight2 = new THREE.PointLight(0xffffff, 0.6, 1000)
        pointLight2.position.set(0, 30, 0)

        const pointLight3 = new THREE.PointLight(0xffffff, 0.6, 1000)
        pointLight3.position.set(0, 0, 30)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.2)

        return [pointLight1, pointLight2, pointLight3, ambientLight]
    }, [])

    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.add(cube)
        for (const line of lines) scene.add(line)
        scene.add(surface)
        for (const light of lights) scene.add(light)
        return scene
    }, [cube, lines, surface, lights])

    const camera = useMemo(() => {
        const fov = 45 // degrees
        const aspectRatio = width / height
        const clippingPlane = {near: 1, far: 500}
        const camera = new THREE.PerspectiveCamera( fov, aspectRatio, clippingPlane.near, clippingPlane.far )
        camera.position.set(0, 0, 100)
        camera.lookAt(0, 0, 0)
        return camera
    }, [width, height])

    useEffect(() => {
        renderer.setSize(width, height)
    }, [width, height, renderer])

    useEffect(() => {
        if (!container) return
        container.appendChild(renderer.domElement)
    }, [container, renderer.domElement])

    const controls = useMemo(() => {
        if (!container) return

        // OrbitControls: problem is that you can't go beyond a certain angle in the vertical direction

        // TrackballControls: working pretty well -- except panning doesn't work!
        const controls = new TrackballControls( camera, container )
        controls.rotateSpeed = 8
        controls.panSpeed = 100 // pan doesn't seem to be working
        controls.zoomSpeed = 1.2
        controls.mouseButtons.MIDDLE = THREE.MOUSE.LEFT // if I don't do this, there is a problem when clicking the middle button
        // not sure why panning is not working!

        // ArcballControls: panning works, but rotation is not fast enough and not as nice as TrackballControls
        // const controls = new ArcballControls(camera, container)
        // controls.scaleFactor = 3

        return controls
    }, [camera, container])

    useEffect(() => {
        if (!controls) return
        let canceled = false
        const doRender = () => {
            if (canceled) return
            controls.update()
            cube.rotation.x += 0.01
            cube.rotation.y += 0.02
            renderer.render(scene, camera)
            setTimeout(() => {
                // requestAnimationFrame pauses when user moves to another tab
                requestAnimationFrame(doRender)
            }, 10)
        }
        doRender()
        return () => {canceled = true}
    }, [camera, cube, renderer, controls, scene])

    return (
        <div
            ref={setContainer}
        />
    )
}

const surfaceMesh = (vertices: number[][], faces: number[][], scalarData: number[] | undefined, scalarDataRange: [number, number]) => {
    // const material = new THREE.MeshPhongMaterial( {
    //     color: 'white',
    //     flatShading: true,
    //     side: THREE.DoubleSide,
    //     vertexColors: scalarData ? true : false
    // })
    const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        vertexColors: scalarData ? true : false
    })

    const geometry = new THREE.BufferGeometry()

    const indices0: number[] = [] // faces
    const vertices0 = []

    for (const v of vertices) {
        vertices0.push(v[0], v[1], v[2])
    }
    for (const f of faces) {
        indices0.push(f[0], f[1], f[2])
    }
    
    geometry.setIndex( indices0 );
    geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices0, 3 ) )
    geometry.computeVertexNormals()

    if (scalarData) {
        const color = new Float32Array(3 * vertices.length)
        for (let i = 0; i < vertices.length; i++) {
            const rgb = colorForValue((scalarData[i] - scalarDataRange[0]) / (scalarDataRange[1] - scalarDataRange[0]))
            color[i * 3 + 0] = rgb[0]
            color[i * 3 + 1] = rgb[1]
            color[i * 3 + 2] = rgb[2]
        }
        geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
    }

    const obj = new THREE.Mesh( geometry, material )
    return obj
}

const colorForValue = (v: number) => {
    const v2 = Math.min(1, Math.max(0, v))
    const r = v2
    const g = 0.5
    const b = 1 - v2

    return [r, g, b]
}

export default ExampleScene