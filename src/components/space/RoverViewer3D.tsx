'use client'

import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import SpaceIcon from '@/components/ui/SpaceIcon'
import { Canvas, useFrame } from '@react-three/fiber'
import { useGLTF, OrbitControls, Html } from '@react-three/drei'
import Image from 'next/image'
import * as THREE from 'three'
import { useSiteLocale } from '@/components/layout/LanguageToggle'

// Passed down as props: the WebGL canvas renders in its own tree.
const COPY = {
    fr: { loading: 'Chargement du modèle 3D…', canvas: 'Modèle interactif en trois dimensions du rover Perseverance', curiosityAlt: 'Le rover Curiosity — rendu 3D officiel de la NASA', curiosityCaption: 'Rendu 3D officiel NASA/JPL · Curiosity MSL · cratère Gale', perseveranceAlt: 'Le rover Perseverance — rendu officiel NASA/JPL', unavailable: 'Le modèle interactif est indisponible. Voici le rendu officiel de Perseverance.', interactive: 'Modèle 3D interactif', official: 'Rendu officiel NASA/JPL', controls: 'Clic + glisser · molette pour zoomer' },
    en: { loading: 'Loading the 3D model…', canvas: 'Interactive 3D model of the Perseverance rover', curiosityAlt: 'The Curiosity rover — official NASA 3D rendering', curiosityCaption: 'Official NASA/JPL 3D rendering · Curiosity MSL · Gale Crater', perseveranceAlt: 'The Perseverance rover — official NASA/JPL rendering', unavailable: 'The interactive model is unavailable. Here is the official rendering of Perseverance.', interactive: 'Interactive 3D model', official: 'Official NASA/JPL rendering', controls: 'Click + drag · scroll to zoom' },
}
type Copy = (typeof COPY)['fr']

/* ─── Rover 3D mesh (only for Perseverance GLB) ─── */
function RoverMesh({ url, reduceMotion }: { url: string; reduceMotion: boolean }) {
    const { scene } = useGLTF(url, '/draco/gltf/')
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
        if (groupRef.current && !reduceMotion) groupRef.current.rotation.y += 0.004
    })

    return (
        <group ref={groupRef} scale={modelScale} position={offset}>
            <primitive object={scene} />
        </group>
    )
}

class RoverModelBoundary extends Component<{
    children: ReactNode
    fallback: ReactNode
    onError: () => void
}, { failed: boolean }> {
    state = { failed: false }

    static getDerivedStateFromError() {
        return { failed: true }
    }

    componentDidCatch() {
        this.props.onError()
    }

    render() {
        return this.state.failed ? this.props.fallback : this.props.children
    }
}

/* ─── Loading state inside Canvas ─── */
function CanvasLoader({ copy }: { copy: Copy }) {
    return (
        <Html center>
            <div style={{ color: 'var(--nebula)', fontSize: '0.75rem', textAlign: 'center', pointerEvents: 'none' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}><SpaceIcon name="refresh" size={18} className="inline-icon" /></div>
                {copy.loading}
            </div>
        </Html>
    )
}

/* ─── Perseverance 3D Canvas ─── */
function PerseveranceCanvas({ height, reduceMotion, copy }: { height: number; reduceMotion: boolean; copy: Copy }) {
    return (
        <div style={{ height, width: '100%' }}>
            <Canvas role="img" aria-label={copy.canvas} camera={{ position: [6, 3, 6], fov: 40 }} gl={{ antialias: true, alpha: true }} dpr={[1, 1.5]} frameloop={reduceMotion ? 'demand' : 'always'}>
                <ambientLight intensity={0.5} />
                <directionalLight position={[10, 8, 5]} intensity={2} color="#fff5e0" />
                <directionalLight position={[-6, 4, -4]} intensity={0.5} color="#6688ff" />
                <pointLight position={[0, -6, 0]} intensity={0.25} color="#330000" />
                <Suspense fallback={<CanvasLoader copy={copy} />}>
                    <RoverMesh url="/models/perseverance.glb" reduceMotion={reduceMotion} />
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
function CuriosityDisplay({ height, copy }: { height: number; copy: Copy }) {
    return (
        <div style={{
            height, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            background: 'radial-gradient(ellipse at center, rgba(239,68,68,0.08) 0%, rgba(0,0,0,0.97) 100%)',
            gap: '0.5rem', padding: '1rem'
        }}>
            <Image
                src="/rovers/curiosity.png"
                alt={copy.curiosityAlt}
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
            <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', textAlign: 'center', marginTop: '0.25rem' }}>
                {copy.curiosityCaption}
            </p>
        </div>
    )
}

function PerseveranceFallback({ height, copy }: { height: number; copy: Copy }) {
    return (
        <div style={{ height, display: 'grid', placeItems: 'center', padding: '2rem', textAlign: 'center' }} role="status">
            <div>
                <Image src="/rovers/perseverance.png" alt={copy.perseveranceAlt} width={1000} height={700} style={{ width: 'min(100%, 720px)', maxHeight: height - 90, objectFit: 'contain' }} />
                <p style={{ marginTop: '0.75rem', color: 'var(--text-subtle)', fontSize: '0.82rem' }}>
                    {copy.unavailable}
                </p>
            </div>
        </div>
    )
}

/* ─── Main export ─── */
interface RoverViewer3DProps {
    rover: 'curiosity' | 'perseverance'
    height?: number
}

const ROVER_META = {
    curiosity: { name: 'Curiosity MSL', color: '#f87171', has3D: false },
    perseverance: { name: 'Perseverance Mars 2020', color: '#a78bfa', has3D: true },
}

export default function RoverViewer3D({ rover, height = 340 }: RoverViewer3DProps) {
    const meta = ROVER_META[rover]
    const copy = COPY[useSiteLocale()]
    const [glbError, setGlbError] = useState(false)
    const [reduceMotion, setReduceMotion] = useState(false)

    useEffect(() => {
        const media = window.matchMedia('(prefers-reduced-motion: reduce)')
        const sync = () => setReduceMotion(media.matches)
        sync()
        media.addEventListener('change', sync)
        return () => media.removeEventListener('change', sync)
    }, [])

    return (
        <div className="rover-viewer" style={{
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
                    <span style={{ fontSize: '0.65rem' }}><SpaceIcon name="satellite" size={18} className="inline-icon" /></span>
                    <span style={{ fontSize: '0.68rem', fontWeight: 700, color: meta.color, fontFamily: 'var(--font-display)' }}>{meta.name}</span>
                    <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                        {meta.has3D && !glbError ? copy.interactive : copy.official}
                    </span>
                </div>
            </div>

            {/* Content */}
            {rover === 'perseverance' && !glbError ? (
                <RoverModelBoundary
                    onError={() => setGlbError(true)}
                    fallback={<PerseveranceFallback height={height} copy={copy} />}
                >
                    <PerseveranceCanvas height={height} reduceMotion={reduceMotion} copy={copy} />
                </RoverModelBoundary>
            ) : rover === 'perseverance' ? (
                <PerseveranceFallback height={height} copy={copy} />
            ) : (
                <CuriosityDisplay height={height} copy={copy} />
            )}

            {/* Controls hint for 3D */}
            {rover === 'perseverance' && !glbError && (
                <div style={{ position: 'absolute', bottom: 8, right: 12, fontSize: '0.7rem', color: 'var(--text-muted)', pointerEvents: 'none' }}>
                    {copy.controls}
                </div>
            )}
        </div>
    )
}
