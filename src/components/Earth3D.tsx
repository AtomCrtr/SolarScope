'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame, useLoader } from '@react-three/fiber'
import { Stars, OrbitControls } from '@react-three/drei'
import { TextureLoader } from 'three'
import * as THREE from 'three'

/* ── Beautiful Earth with real NASA texture ── */
function EarthMesh() {
    const meshRef = useRef<THREE.Mesh>(null)
    const cloudsRef = useRef<THREE.Mesh>(null)

    // Load NASA Earth texture from public folder
    const earthTex = useLoader(TextureLoader, '/textures/earth.jpg')

    useFrame(() => {
        if (meshRef.current) meshRef.current.rotation.y += 0.0006
        if (cloudsRef.current) {
            cloudsRef.current.rotation.y += 0.0008
            cloudsRef.current.rotation.x += 0.00006
        }
    })

    return (
        <group>
            {/* Earth with NASA texture */}
            <mesh ref={meshRef}>
                <sphereGeometry args={[2, 128, 128]} />
                <meshPhongMaterial
                    map={earthTex}
                    shininess={25}
                    specular={new THREE.Color('#4488cc')}
                />
            </mesh>

            {/* Thin cloud layer */}
            <mesh ref={cloudsRef}>
                <sphereGeometry args={[2.03, 64, 64]} />
                <meshPhongMaterial
                    color="#ffffff"
                    transparent
                    opacity={0.12}
                    depthWrite={false}
                />
            </mesh>

            {/* Blue atmosphere halo — visible from space */}
            <mesh>
                <sphereGeometry args={[2.18, 48, 48]} />
                <meshPhongMaterial
                    color="#4fc3f7"
                    transparent
                    opacity={0.07}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Outer diffuse glow */}
            <mesh>
                <sphereGeometry args={[2.5, 32, 32]} />
                <meshPhongMaterial
                    color="#1a6fa8"
                    transparent
                    opacity={0.025}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

interface Earth3DProps {
    height?: number | string
    autoRotate?: boolean
    showControls?: boolean
}

export default function Earth3D({ height = 520, autoRotate = true, showControls = true }: Earth3DProps) {
    return (
        <Canvas
            role="img"
            aria-label="Globe terrestre interactif en trois dimensions"
            style={{ width: '100%', height, display: 'block', background: 'transparent' }}
            camera={{ position: [0, 0.55, 7.6], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
        >
            <Suspense fallback={null}>
                {/* Warm directional sunlight from upper-right */}
                <ambientLight intensity={0.12} />
                <directionalLight
                    position={[8, 3, 5]}
                    intensity={2.4}
                    color="#fff5e0"
                />
                {/* Subtle blue fill from night side */}
                <pointLight position={[-10, -4, -8]} intensity={0.2} color="#1a55a0" />

                {/* Dense star field */}
                <Stars radius={180} depth={80} count={7000} factor={5} fade speed={0.2} />

                <EarthMesh />

                {showControls && (
                    <OrbitControls
                        enableZoom={false}
                        enablePan={false}
                        autoRotate={autoRotate}
                        autoRotateSpeed={0.12}
                        minPolarAngle={Math.PI * 0.2}
                        maxPolarAngle={Math.PI * 0.8}
                    />
                )}
            </Suspense>
        </Canvas>
    )
}
