'use client'

import { Suspense, useMemo, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html } from '@react-three/drei'
import Image from 'next/image'
import * as THREE from 'three'

/* ─── Rover 3D mesh (only for Perseverance GLB) ─── */
function RoverMesh({ url }: { url: string }) {
    const { scene } = useGLTF(url)
    const groupRef = useRef<THREE.Group>(null)

    const { offset, modelScale } = useMemo(() => {
        const box = new THREE.Box3().setFromObject(scene)
        const center = new THREE.Vector3()
        const size = new THREE.Vector3()
        box.getCenter(center)
        box.getSize(size)
        const maxDim = Math.max(size.x, size.y, size.z) || 1
        const s = 4 / maxDim
        return {
            modelScale: s,
            offset: [-center.x * s, -center.y * s, -center.z * s] as [number, number, number],
        }
    }, [scene])

    useFrame(() => {
        if (groupRef.current) groupRef.current.rotation.y += 0.004
    })

    return (
        <group ref={groupRef} scale={modelScale} position={offset}>
            <primitive object={scene} />
        </group>
    )
}

/* ─── Loading state inside Canvas ─── */
function CanvasLoader() {
    return (
        <Html center>
            <div style={{ color: '#8b5cf6', fontSize: '0.75rem', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>⚙️</div>
                Chargement modèle 3D…
            </div>
        </Html>
    )
}

/* ─── Perseverance 3D Canvas ─── */
function PerseveranceCanvas({ height }: { height: number }) {
    return (
        <div style={{ height, width: '100%' }}>
            <Canvas role="img" aria-label="Modèle interactif en trois dimensions du rover Perseverance" camera={{ position: [6, 3, 6], fov: 40 }} gl={{ antialias: true, alpha: true }}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 8, 5]} intensity={2} color="#fff5e0" />
                <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#6688ff" />
                <pointLight position={[0, -6, 0]} intensity={0.25} color="#330000" />
                <Suspense fallback={<CanvasLoader />}>
                    <RoverMesh url="/models/perseverance.glb" />
                </Suspense>
                <OrbitControls
                    enableZoom={true}
                    enablePan={false}
                    minDistance={2}
                    maxDistance={16}
                    minPolarAngle={Math.PI * 0.05}
                    maxPolarAngle={Math.PI * 0.88}
                />
            </Canvas>
        </div>
    )
}

/* ─── Curiosity NASA image display ─── */
function CuriosityDisplay({ height }: { height: number }) {
    return (
        <div style={{
            height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, rgba(0,0,0,0.97) 100%)',
            gap: '0.5rem', padding: '1rem'
        }}>
            <Image
                src="/rovers/curiosity.png"
                alt="Curiosity rover — rendu 3D officiel NASA"
                width={1000}
                height={700}
                style={{
                    maxHeight: height - 60,
                    maxWidth: '100%',
                    objectFit: 'contain',
                    borderRadius: '0.5rem',
                    filter: 'drop-shadow(0 0 20px rgba(239,68,68,0.3))',
                }}
            />
            <p style={{ color: '#475569', fontSize: '0.65rem', textAlign: 'center', marginTop: '0.25rem' }}>
                🎨 Rendu 3D officiel NASA/JPL · Curiosity MSL · Cratère Gale
            </p>
        </div>
    )
}

/* ─── Main export ─── */
interface RoverViewer3DProps {
    rover: 'curiosity' | 'perseverance'
    height?: number
}

const ROVER_META = {
    curiosity: { name: 'Curiosity MSL', color: '#ef4444', has3D: false },
    perseverance: { name: 'Perseverance Mars 2020', color: '#8b5cf6', has3D: true },
}

export default function RoverViewer3D({ rover, height = 340 }: RoverViewer3DProps) {
    const meta = ROVER_META[rover]
    const [glbError, setGlbError] = useState(false)

    return (
        <div style={{
            position: 'relative', borderRadius: '1rem', overflow: 'hidden',
            border: `1px solid ${meta.color}20`,
            background: 'rgba(0,0,0,0.95)',
        }}>
            {/* Badge */}
            <div style={{ position: 'absolute', top: 10, left: 12, zIndex: 10 }}>
                <div style={{
                    background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)',
                    borderRadius: 99, padding: '3px 10px',
                    border: `1px solid ${meta.color}30`,
                    display: 'flex', alignItems: 'center', gap: 6,
                }}>
                    <span style={{ fontSize: '0.65rem' }}>🛸</span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: meta.color, fontFamily: 'Outfit' }}>{meta.name}</span>
                    <span style={{ fontSize: '0.55rem', color: '#475569' }}>
                        {meta.has3D && !glbError ? 'Modèle 3D interactif' : 'Rendu officiel NASA/JPL'}
                    </span>
                </div>
            </div>

            {/* Content */}
            {rover === 'perseverance' && !glbError ? (
                <div onError={() => setGlbError(true)}>
                    <PerseveranceCanvas height={height} />
                </div>
            ) : (
                <CuriosityDisplay height={height} />
            )}

            {/* Controls hint for 3D */}
            {rover === 'perseverance' && !glbError && (
                <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: '0.6rem', color: '#334155', pointerEvents: 'none' }}>
                    🖱 Clic + glisser · Scroll zoomer
                </div>
            )}
        </div>
    )
}

// Preload
useGLTF.preload('/models/perseverance.glb')
