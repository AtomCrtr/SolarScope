'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface ISSPos {
    latitude: number
    longitude: number
    altitude: number
    velocity: number
    timestamp: number
}

function latLngToVec3(lat: number, lng: number, radius: number): THREE.Vector3 {
    const phi = (90 - lat) * (Math.PI / 180)
    const theta = (lng + 180) * (Math.PI / 180)
    return new THREE.Vector3(
        -radius * Math.sin(phi) * Math.cos(theta),
        radius * Math.cos(phi),
        radius * Math.sin(phi) * Math.sin(theta)
    )
}

export default function ISSGlobe({ issPos }: { issPos: ISSPos | null }) {
    const mountRef = useRef<HTMLDivElement>(null)
    const sceneRef = useRef<{
        renderer: THREE.WebGLRenderer
        scene: THREE.Scene
        camera: THREE.PerspectiveCamera
        issMarker: THREE.Group
        trail: THREE.Line
        trailPositions: THREE.Vector3[]
        animId: number
        isDragging: boolean
        previousMousePosition: { x: number; y: number }
    } | null>(null)

    useEffect(() => {
        if (!mountRef.current) return
        const el = mountRef.current
        const W = el.clientWidth
        const H = el.clientHeight

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setSize(W, H)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        el.appendChild(renderer.domElement)

        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 1000)
        camera.position.set(0, 0, 3.5)

        // Stars
        const starGeo = new THREE.BufferGeometry()
        const starCount = 2000
        const starPositions = new Float32Array(starCount * 3)
        for (let i = 0; i < starCount * 3; i++) starPositions[i] = (Math.random() - 0.5) * 400
        starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3))
        scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: '#ffffff', size: 0.3, transparent: true, opacity: 0.7 })))

        // Lights
        scene.add(new THREE.AmbientLight(0x222233, 0.8))
        const sun = new THREE.DirectionalLight(0xffeedd, 2.2)
        sun.position.set(5, 3, 5)
        scene.add(sun)

        // Earth group (for rotation control)
        const earthGroup = new THREE.Group()
        scene.add(earthGroup)

        // Earth
        const loader = new THREE.TextureLoader()
        const earthGeo = new THREE.SphereGeometry(1, 64, 64)
        const earthMat = new THREE.MeshPhongMaterial({
            map: loader.load('/textures/earth.jpg'),
            specular: new THREE.Color(0x226699),
            shininess: 18,
        })
        const earth = new THREE.Mesh(earthGeo, earthMat)
        earthGroup.add(earth)

        // Atmosphere glow
        const atmGeo = new THREE.SphereGeometry(1.055, 64, 64)
        const atmMat = new THREE.MeshPhongMaterial({ color: 0x3a6bbb, transparent: true, opacity: 0.12, side: THREE.FrontSide })
        earthGroup.add(new THREE.Mesh(atmGeo, atmMat))

        // Grid overlay
        const gridGeo = new THREE.SphereGeometry(1.01, 24, 12)
        const gridMat = new THREE.MeshBasicMaterial({ color: 0x3b82f6, wireframe: true, transparent: true, opacity: 0.06 })
        earthGroup.add(new THREE.Mesh(gridGeo, gridMat))

        // ISS Marker group
        const issMarker = new THREE.Group()
        // Core dot
        const issDot = new THREE.Mesh(
            new THREE.SphereGeometry(0.018, 12, 12),
            new THREE.MeshBasicMaterial({ color: 0x60a5fa })
        )
        issMarker.add(issDot)
        // Outer ring pulse
        const ringGeo = new THREE.RingGeometry(0.025, 0.035, 32)
        const ringMat = new THREE.MeshBasicMaterial({ color: 0x60a5fa, side: THREE.DoubleSide, transparent: true, opacity: 0.6 })
        const ring = new THREE.Mesh(ringGeo, ringMat)
        issMarker.add(ring)
        earthGroup.add(issMarker)

        // Trail
        const trailPositions: THREE.Vector3[] = []
        const trailGeo = new THREE.BufferGeometry()
        const trailMat = new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0.4 })
        const trail = new THREE.Line(trailGeo, trailMat)
        earthGroup.add(trail)

        // Drag to rotate
        let isDragging = false
        let previousMousePosition = { x: 0, y: 0 }
        let autoRotate = true

        const onMouseDown = (e: MouseEvent) => { isDragging = true; autoRotate = false; previousMousePosition = { x: e.clientX, y: e.clientY } }
        const onMouseUp = () => { isDragging = false; setTimeout(() => { autoRotate = true }, 3000) }
        const onMouseMove = (e: MouseEvent) => {
            if (!isDragging) return
            const dx = e.clientX - previousMousePosition.x
            const dy = e.clientY - previousMousePosition.y
            earthGroup.rotation.y += dx * 0.005
            earthGroup.rotation.x += dy * 0.005
            earthGroup.rotation.x = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, earthGroup.rotation.x))
            previousMousePosition = { x: e.clientX, y: e.clientY }
        }
        renderer.domElement.addEventListener('mousedown', onMouseDown)
        window.addEventListener('mouseup', onMouseUp)
        window.addEventListener('mousemove', onMouseMove)

        let t = 0
        const animId = requestAnimationFrame(function loop() {
            t += 0.005
            if (autoRotate) earthGroup.rotation.y += 0.0015
            // Ring pulse
            const scale = 1 + 0.4 * Math.abs(Math.sin(t * 3))
            ring.scale.setScalar(scale)
            ring.material.opacity = 0.7 - 0.4 * Math.abs(Math.sin(t * 3))
            renderer.render(scene, camera)
            requestAnimationFrame(loop)
        })

        sceneRef.current = { renderer, scene, camera, issMarker, trail, trailPositions, animId, isDragging, previousMousePosition }

        return () => {
            cancelAnimationFrame(animId)
            renderer.domElement.removeEventListener('mousedown', onMouseDown)
            window.removeEventListener('mouseup', onMouseUp)
            window.removeEventListener('mousemove', onMouseMove)
            renderer.dispose()
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
        }
    }, [])

    // Update ISS position when it changes
    useEffect(() => {
        if (!sceneRef.current || !issPos) return
        const { issMarker, trail, trailPositions } = sceneRef.current

        const pos = latLngToVec3(issPos.latitude, issPos.longitude, 1.14)
        // Position in local space of earthGroup
        issMarker.position.copy(pos)
        issMarker.lookAt(new THREE.Vector3(0, 0, 0))

        trailPositions.push(pos.clone())
        if (trailPositions.length > 120) trailPositions.shift()

        const trailGeo = new THREE.BufferGeometry().setFromPoints(trailPositions)
        trail.geometry.dispose()
        trail.geometry = trailGeo
    }, [issPos])

    return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />
}
