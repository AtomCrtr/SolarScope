'use client'

import { useRef, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Stars } from '@react-three/drei'
import * as THREE from 'three'

function SunMesh() {
    const coreRef = useRef<THREE.Mesh>(null)
    const corona1Ref = useRef<THREE.Mesh>(null)
    const corona2Ref = useRef<THREE.Mesh>(null)
    const corona3Ref = useRef<THREE.Mesh>(null)
    const flareRef = useRef<THREE.Mesh>(null)

    useFrame((state) => {
        const t = state.clock.getElapsedTime()
        if (coreRef.current) {
            coreRef.current.rotation.y += 0.003
            coreRef.current.rotation.x = Math.sin(t * 0.3) * 0.05
        }
        if (corona1Ref.current) {
            corona1Ref.current.rotation.y -= 0.001
            corona1Ref.current.rotation.z += 0.0015
            // Breathe
            const s = 1 + Math.sin(t * 1.2) * 0.015
            corona1Ref.current.scale.set(s, s, s)
        }
        if (corona2Ref.current) {
            corona2Ref.current.rotation.y += 0.0008
            corona2Ref.current.rotation.x += 0.0012
            const s = 1 + Math.sin(t * 0.8 + 1) * 0.02
            corona2Ref.current.scale.set(s, s, s)
        }
        if (corona3Ref.current) {
            corona3Ref.current.rotation.z -= 0.0006
            const s = 1 + Math.sin(t * 0.5 + 2) * 0.025
            corona3Ref.current.scale.set(s, s, s)
        }
        if (flareRef.current) {
            flareRef.current.rotation.y += 0.005
            const s = 0.9 + Math.sin(t * 2) * 0.12
            flareRef.current.scale.set(s, s, s)
        }
    })

    return (
        <group>
            {/* Solar core — bright photosphere */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[2, 128, 128]} />
                <meshStandardMaterial
                    color={new THREE.Color('#ffd060')}
                    emissive={new THREE.Color('#ff8800')}
                    emissiveIntensity={1.8}
                    roughness={0.9}
                    metalness={0}
                />
            </mesh>

            {/* Chromosphere — hot plasma layer */}
            <mesh>
                <sphereGeometry args={[2.06, 64, 64]} />
                <meshStandardMaterial
                    color={new THREE.Color('#ff6b00')}
                    emissive={new THREE.Color('#ff4400')}
                    emissiveIntensity={0.5}
                    transparent
                    opacity={0.25}
                    side={THREE.FrontSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Corona ring 1 — inner glow */}
            <mesh ref={corona1Ref}>
                <sphereGeometry args={[2.35, 48, 48]} />
                <meshStandardMaterial
                    color={new THREE.Color('#ff9800')}
                    emissive={new THREE.Color('#ff6600')}
                    emissiveIntensity={0.3}
                    transparent
                    opacity={0.18}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Corona ring 2 — mid glow */}
            <mesh ref={corona2Ref}>
                <sphereGeometry args={[2.8, 32, 32]} />
                <meshStandardMaterial
                    color={new THREE.Color('#ff6600')}
                    emissive={new THREE.Color('#ff4400')}
                    emissiveIntensity={0.2}
                    transparent
                    opacity={0.10}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Corona ring 3 — outer diffuse */}
            <mesh ref={corona3Ref}>
                <sphereGeometry args={[3.5, 24, 24]} />
                <meshStandardMaterial
                    color={new THREE.Color('#ff4400')}
                    emissive={new THREE.Color('#ff2200')}
                    emissiveIntensity={0.15}
                    transparent
                    opacity={0.055}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Far outer haze */}
            <mesh>
                <sphereGeometry args={[5, 16, 16]} />
                <meshStandardMaterial
                    color={new THREE.Color('#ff8800')}
                    transparent
                    opacity={0.018}
                    side={THREE.BackSide}
                    depthWrite={false}
                />
            </mesh>

            {/* Solar flare blob — pulsing prominence */}
            <mesh ref={flareRef} position={[2.0, 0.8, 0.5]}>
                <sphereGeometry args={[0.28, 16, 16]} />
                <meshStandardMaterial
                    color={new THREE.Color('#ff4400')}
                    emissive={new THREE.Color('#ff2200')}
                    emissiveIntensity={1.5}
                    transparent
                    opacity={0.7}
                    depthWrite={false}
                />
            </mesh>

            {/* Solar flare blob 2 */}
            <mesh position={[-1.8, -1.0, 0.7]}>
                <sphereGeometry args={[0.18, 12, 12]} />
                <meshStandardMaterial
                    color={new THREE.Color('#ffaa00')}
                    emissive={new THREE.Color('#ff5500')}
                    emissiveIntensity={1.2}
                    transparent
                    opacity={0.6}
                    depthWrite={false}
                />
            </mesh>
        </group>
    )
}

interface Sun3DProps {
    height?: number | string
}

export default function Sun3D({ height = 480 }: Sun3DProps) {
    return (
        <Canvas
            role="img"
            aria-label="Représentation interactive du Soleil en trois dimensions"
            style={{ height, background: 'transparent' }}
            camera={{ position: [0, 0, 7.5], fov: 40 }}
            gl={{ antialias: true, alpha: true }}
        >
            <Suspense fallback={null}>
                {/* Sun is its own light */}
                <ambientLight intensity={0.04} color="#ff8800" />
                <pointLight position={[0, 0, 0]} intensity={3} color="#ffd060" distance={20} />
                <pointLight position={[0, 0, 0]} intensity={1.5} color="#ff6600" distance={30} />

                {/* Star field */}
                <Stars radius={200} depth={80} count={5000} factor={4} fade speed={0.15} />

                <SunMesh />
            </Suspense>
        </Canvas>
    )
}
