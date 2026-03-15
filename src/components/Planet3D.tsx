'use client'

import { useEffect, useRef } from 'react'
import * as THREE from 'three'

interface Planet3DProps {
    textureUrl: string          // path to /public/textures/xxx.jpg
    size?: number               // sphere radius, default 2
    rotationSpeed?: number      // radians per frame, default 0.003
    hasRings?: boolean          // show Saturn rings
    ringColor?: string          // ring tint
    atmosphereColor?: string    // outer glow color hex string
    bgAlpha?: number            // canvas bg alpha
}

export default function Planet3D({
    textureUrl,
    size = 2,
    rotationSpeed = 0.003,
    hasRings = false,
    ringColor = '#c8a96e',
    atmosphereColor,
    bgAlpha = 0,
}: Planet3DProps) {
    const mountRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const el = mountRef.current
        if (!el) return

        const w = el.clientWidth
        const h = el.clientHeight

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.setSize(w, h)
        renderer.setClearColor(0x000000, bgAlpha)
        el.appendChild(renderer.domElement)

        // Scene
        const scene = new THREE.Scene()
        const camera = new THREE.PerspectiveCamera(45, w / h, 0.1, 100)
        camera.position.set(0, 0, 5.5)

        // Lights
        const ambient = new THREE.AmbientLight(0xffffff, 0.25)
        scene.add(ambient)
        const sun = new THREE.DirectionalLight(0xfff8e7, 1.6)
        sun.position.set(5, 3, 5)
        scene.add(sun)

        // Texture
        const loader = new THREE.TextureLoader()
        const tex = loader.load(textureUrl)

        // Planet
        const geo = new THREE.SphereGeometry(size, 64, 64)
        const mat = new THREE.MeshPhongMaterial({ map: tex, shininess: 8 })
        const planet = new THREE.Mesh(geo, mat)
        scene.add(planet)

        // Atmosphere glow (optional)
        if (atmosphereColor) {
            const atmGeo = new THREE.SphereGeometry(size * 1.04, 32, 32)
            const atmMat = new THREE.MeshPhongMaterial({
                color: new THREE.Color(atmosphereColor),
                transparent: true,
                opacity: 0.08,
                side: THREE.FrontSide,
            })
            scene.add(new THREE.Mesh(atmGeo, atmMat))
        }

        // Saturn rings
        if (hasRings) {
            const ringGeo = new THREE.RingGeometry(size * 1.3, size * 2.1, 64)
            // Map UVs radially so a texture could be used
            const pos = ringGeo.attributes.position
            const uv = ringGeo.attributes.uv
            for (let i = 0; i < pos.count; i++) {
                const v = new THREE.Vector3().fromBufferAttribute(pos, i)
                uv.setXY(i, v.length() / (size * 2.1), 0)
            }
            const ringMat = new THREE.MeshBasicMaterial({
                color: new THREE.Color(ringColor),
                side: THREE.DoubleSide,
                transparent: true,
                opacity: 0.65,
            })
            const rings = new THREE.Mesh(ringGeo, ringMat)
            rings.rotation.x = Math.PI / 2.4
            scene.add(rings)
        }

        // Mouse drag
        let isDragging = false
        let prevX = 0, prevY = 0
        const onDown = (e: MouseEvent | TouchEvent) => {
            isDragging = true
            const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
            prevX = clientX; prevY = clientY
        }
        const onMove = (e: MouseEvent | TouchEvent) => {
            if (!isDragging) return
            const { clientX, clientY } = 'touches' in e ? e.touches[0] : e
            planet.rotation.y += (clientX - prevX) * 0.01
            planet.rotation.x += (clientY - prevY) * 0.005
            prevX = clientX; prevY = clientY
        }
        const onUp = () => { isDragging = false }

        renderer.domElement.addEventListener('mousedown', onDown)
        renderer.domElement.addEventListener('mousemove', onMove)
        renderer.domElement.addEventListener('mouseup', onUp)
        renderer.domElement.addEventListener('touchstart', onDown, { passive: true })
        renderer.domElement.addEventListener('touchmove', onMove, { passive: true })
        renderer.domElement.addEventListener('touchend', onUp)

        // Animate
        let animId: number
        const animate = () => {
            animId = requestAnimationFrame(animate)
            if (!isDragging) planet.rotation.y += rotationSpeed
            renderer.render(scene, camera)
        }
        animate()

        // Resize
        const handleResize = () => {
            const nw = el.clientWidth, nh = el.clientHeight
            renderer.setSize(nw, nh)
            camera.aspect = nw / nh
            camera.updateProjectionMatrix()
        }
        const ro = new ResizeObserver(handleResize)
        ro.observe(el)

        return () => {
            cancelAnimationFrame(animId)
            ro.disconnect()
            renderer.dispose()
            if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement)
        }
    }, [textureUrl, size, rotationSpeed, hasRings, ringColor, atmosphereColor, bgAlpha])

    return <div ref={mountRef} style={{ width: '100%', height: '100%', cursor: 'grab' }} />
}
