import { FunctionComponent, useEffect, useMemo, useState } from "react";
import * as THREE from 'three';
import { TrackballControls } from 'three/examples/jsm/controls/TrackballControls';


type Props = {
    vertices: number[][]
    faces: number[][]
    scalarData?: number[] | Uint8Array | Float32Array
    scalarRange?: [number, number]
    width: number
    height: number
}

const SurfaceWidget: FunctionComponent<Props> = ({vertices, faces, scalarData, scalarRange, width, height}) => {
    const [container, setContainer] = useState<HTMLDivElement | null>()

    const renderer = useMemo(() => {
        const renderer = new THREE.WebGLRenderer()
        return renderer
    }, [])

    const useVertexColors = scalarData ? true : false

    const surface = useMemo(() => {
        return surfaceMesh(
            vertices, faces, {useVertexColors}
        )
    }, [vertices, faces, useVertexColors]) // important that this does not depend on scalarData (which might be changing rapidly)

    useEffect(() => {
        if ((scalarData) && (scalarRange)) {
            const color = new Float32Array(3 * vertices.length)
            for (let i = 0; i < vertices.length; i++) {
                const rgb = colorForValue((scalarData[i] - scalarRange[0]) / (scalarRange[1] - scalarRange[0]))
                color[i * 3 + 0] = rgb[0]
                color[i * 3 + 1] = rgb[1]
                color[i * 3 + 2] = rgb[2]
            }
            surface.geometry.setAttribute('color', new THREE.BufferAttribute(color, 3))
        }
    }, [scalarData, scalarRange, surface, vertices.length])

    const boundingBox = useMemo(() => {
        const xmin = min(vertices.map(v => (v[0])))
        const xmax = max(vertices.map(v => (v[0])))
        const ymin = min(vertices.map(v => (v[1])))
        const ymax = max(vertices.map(v => (v[1])))
        const zmin = min(vertices.map(v => (v[2])))
        const zmax = max(vertices.map(v => (v[2])))
        const center = [(xmin + xmax) / 2, (ymin + ymax) / 2, (zmin + zmax) / 2]
        const diameter = max([xmax - xmin, ymax - ymin, zmax - zmin])
        return {xmin, xmax, ymin, ymax, zmin, zmax, center, diameter}
    }, [vertices])

    const lights = useMemo(() => {
        const pointLight1 = new THREE.PointLight(0xffffff, 0.6, 1000)
        pointLight1.position.set(boundingBox.xmin, boundingBox.ymin, boundingBox.zmin)

        const pointLight2 = new THREE.PointLight(0xffffff, 0.6, 1000)
        pointLight1.position.set(boundingBox.xmax, boundingBox.ymax, boundingBox.zmax)

        const pointLight3 = new THREE.PointLight(0xffffff, 0.6, 1000)
        pointLight1.position.set(boundingBox.center[0], boundingBox.ymin, boundingBox.zmax)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.4)

        return [pointLight1, pointLight2, pointLight3, ambientLight]
    }, [boundingBox])

    const scene = useMemo(() => {
        const scene = new THREE.Scene()
        scene.add(surface)
        for (const light of lights) scene.add(light)
        return scene
    }, [surface, lights])

    const camera = useMemo(() => {
        const {diameter, center} = boundingBox
        const fov = 45 // degrees
        const aspectRatio = width / height
        const clippingPlane = {near: diameter / 10, far: diameter * 10}
        const camera = new THREE.PerspectiveCamera( fov, aspectRatio, clippingPlane.near, clippingPlane.far )
        camera.position.set(center[0], center[1], center[2] - diameter * 3)
        // camera.lookAt(center[0], center[1], center[2]) // setting trackball controls target
        return camera
    }, [width, height, boundingBox])

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
        controls.rotateSpeed = 16
        controls.panSpeed = 100 // pan doesn't seem to be working
        controls.zoomSpeed = 1.2
        controls.mouseButtons.MIDDLE = THREE.MOUSE.LEFT // if I don't do this, there is a problem when clicking the middle button
        controls.target = new THREE.Vector3(boundingBox.center[0], boundingBox.center[1], boundingBox.center[2])
        // not sure why panning is not working!

        // ArcballControls: panning works, but rotation is not fast enough and not as nice as TrackballControls
        // const controls = new ArcballControls(camera, container)
        // controls.scaleFactor = 3

        return controls
    }, [camera, container, boundingBox.center])

    useEffect(() => {
        if (!controls) return
        let canceled = false
        const doRender = () => {
            if (canceled) return
            controls.update()
            renderer.render(scene, camera)
            setTimeout(() => {
                // requestAnimationFrame pauses when user moves to another tab
                requestAnimationFrame(doRender)
            }, 10)
        }
        doRender()
        return () => {canceled = true}
    }, [camera, renderer, controls, scene])

    return (
        <div
            ref={setContainer}
        />
    )
}

const surfaceMesh = (vertices: number[][], faces: number[][], o: {useVertexColors: boolean}) => {
    // const material = new THREE.MeshPhongMaterial( {
    //     color: 'white',
    //     flatShading: true,
    //     side: THREE.DoubleSide,
    //     vertexColors: scalarData ? true : false
    // })
    const material = new THREE.MeshLambertMaterial({
        side: THREE.DoubleSide,
        vertexColors: o.useVertexColors
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

const min = (x: number[]) => {
    return x.reduce((prev, a) => Math.min(prev, a), x[0])
}

const max = (x: number[]) => {
    return x.reduce((prev, a) => Math.max(prev, a), x[0])
}

export default SurfaceWidget