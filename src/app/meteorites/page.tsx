'use client'

import { useState, useRef, useMemo } from 'react'
import { motion } from 'framer-motion'

interface Meteorite {
    name: string
    id: string
    recclass: string
    mass: string
    year: string
    reclat: string
    reclong: string
    fall: string
}

const CLASS_COLOR: Record<string, string> = {
    'L': '#f97316', 'H': '#ef4444', 'LL': '#f59e0b',
    'Iron': '#94a3b8', 'Pallasite': '#10b981', 'CM': '#6366f1',
    'CV': '#a855f7', 'CO': '#0ea5e9', 'CK': '#06b6d4',
}

function getColor(recclass: string): string {
    for (const [k, v] of Object.entries(CLASS_COLOR)) {
        if (recclass.startsWith(k)) return v
    }
    return '#64748b'
}

/* Very fast equirectangular projection */
function latLngToSvg(lat: number, lng: number, W: number, H: number) {
    const x = ((lng + 180) / 360) * W
    const y = ((90 - lat) / 180) * H
    return { x, y }
}

/* ── Curated static dataset: always shown, API enriches if available ── */
const STATIC_METEORITES: Meteorite[] = [
    { name: 'Hoba', id: '1', recclass: 'Iron, IVB', mass: '60000000', year: '1920-01-01T00:00:00.000', reclat: '-19.5833', reclong: '17.9167', fall: 'Found' },
    { name: 'Cape York (Ahnighito)', id: '2', recclass: 'Iron, IIIAB', mass: '31000000', year: '1894-01-01T00:00:00.000', reclat: '76.13', reclong: '-64.93', fall: 'Found' },
    { name: 'Gao-Guenie', id: '3', recclass: 'H5', mass: '9000000', year: '1960-01-01T00:00:00.000', reclat: '14.17', reclong: '-2.5', fall: 'Fell' },
    { name: 'Mundrabilla', id: '4', recclass: 'Iron, IAB-sHL', mass: '11000000', year: '1966-01-01T00:00:00.000', reclat: '-30.79', reclong: '127.55', fall: 'Found' },
    { name: 'Sikhote-Alin', id: '5', recclass: 'Iron, IIAB', mass: '23000000', year: '1947-01-01T00:00:00.000', reclat: '46.1', reclong: '134.67', fall: 'Fell' },
    { name: 'Allende', id: '6', recclass: 'CV3', mass: '2000000', year: '1969-01-01T00:00:00.000', reclat: '26.97', reclong: '-105.32', fall: 'Fell' },
    { name: 'Murchison', id: '7', recclass: 'CM2', mass: '100000', year: '1969-01-01T00:00:00.000', reclat: '-36.62', reclong: '145.23', fall: 'Fell' },
    { name: 'Nakhla', id: '8', recclass: 'Martian (nakhlite)', mass: '10000', year: '1911-01-01T00:00:00.000', reclat: '30.9', reclong: '30.65', fall: 'Fell' },
    { name: 'Chelyabinsk', id: '9', recclass: 'LL5', mass: '9000000', year: '2013-01-01T00:00:00.000', reclat: '54.82', reclong: '61.12', fall: 'Fell' },
    { name: 'Peekskill', id: '10', recclass: 'H6', mass: '12600', year: '1992-01-01T00:00:00.000', reclat: '41.29', reclong: '-73.92', fall: 'Fell' },
    { name: 'Canyon Diablo', id: '11', recclass: 'Iron, IAB-MG', mass: '30000000', year: '1891-01-01T00:00:00.000', reclat: '35.05', reclong: '-111.03', fall: 'Found' },
    { name: 'Gibeon', id: '12', recclass: 'Iron, IVA', mass: '26000000', year: '1836-01-01T00:00:00.000', reclat: '-25.5', reclong: '18.0', fall: 'Found' },
    { name: 'Ensisheim', id: '13', recclass: 'LL6', mass: '127000', year: '1492-01-01T00:00:00.000', reclat: '47.87', reclong: '7.35', fall: 'Fell' },
    { name: 'Orgueil', id: '14', recclass: 'CI1', mass: '14000', year: '1864-01-01T00:00:00.000', reclat: '43.87', reclong: '1.38', fall: 'Fell' },
    { name: 'Norton County', id: '15', recclass: 'Aubrite', mass: '1077000', year: '1948-01-01T00:00:00.000', reclat: '39.8', reclong: '-99.89', fall: 'Fell' },
    { name: 'Willamette', id: '16', recclass: 'Iron, IIIAB', mass: '15500000', year: '1902-01-01T00:00:00.000', reclat: '45.38', reclong: '-122.53', fall: 'Found' },
    { name: 'Cold Bokkeveld', id: '17', recclass: 'CM2', mass: '4000', year: '1838-01-01T00:00:00.000', reclat: '-33.38', reclong: '19.08', fall: 'Fell' },
    { name: 'Jilin', id: '18', recclass: 'H5', mass: '4000000', year: '1976-01-01T00:00:00.000', reclat: '44.1', reclong: '126.0', fall: 'Fell' },
    { name: 'Mbosi', id: '19', recclass: 'Iron, ungrouped', mass: '16000000', year: '1930-01-01T00:00:00.000', reclat: '-8.97', reclong: '33.68', fall: 'Found' },
    { name: 'Nantan', id: '20', recclass: 'Iron, IIICD', mass: '9500000', year: '1516-01-01T00:00:00.000', reclat: '24.97', reclong: '107.32', fall: 'Fell' },
    { name: 'Zagami', id: '21', recclass: 'Martian (shergottite)', mass: '18000', year: '1962-01-01T00:00:00.000', reclat: '13.8', reclong: '6.69', fall: 'Fell' },
    { name: 'St. Mesmin', id: '22', recclass: 'LL', mass: '2700', year: '1866-01-01T00:00:00.000', reclat: '47.98', reclong: '1.58', fall: 'Fell' },
    { name: 'L\'Aigle', id: '23', recclass: 'L6', mass: '37000', year: '1803-01-01T00:00:00.000', reclat: '48.77', reclong: '0.62', fall: 'Fell' },
    { name: 'Barbotan', id: '24', recclass: 'H5', mass: '72000', year: '1790-01-01T00:00:00.000', reclat: '43.95', reclong: '-0.02', fall: 'Fell' },
    { name: 'Cranbourne', id: '25', recclass: 'Iron, IIIAB', mass: '3500000', year: '1854-01-01T00:00:00.000', reclat: '-38.1', reclong: '145.35', fall: 'Found' },
    { name: 'Agpalilik (Man)', id: '26', recclass: 'Iron, IIIAB', mass: '20000000', year: '1963-01-01T00:00:00.000', reclat: '76.1', reclong: '-64.95', fall: 'Found' },
    { name: 'Stannern', id: '27', recclass: 'Eucrite', mass: '52000', year: '1808-01-01T00:00:00.000', reclat: '49.27', reclong: '15.57', fall: 'Fell' },
    { name: 'Johnstown', id: '28', recclass: 'Diogenite', mass: '23600', year: '1924-01-01T00:00:00.000', reclat: '40.33', reclong: '-78.92', fall: 'Fell' },
    { name: 'Karoonda', id: '29', recclass: 'CK4', mass: '41700', year: '1930-01-01T00:00:00.000', reclat: '-35.1', reclong: '139.98', fall: 'Fell' },
    { name: 'Coolac', id: '30', recclass: 'Pallasite', mass: '8600', year: '1904-01-01T00:00:00.000', reclat: '-34.83', reclong: '148.18', fall: 'Found' },
    { name: 'Brenham', id: '31', recclass: 'Pallasite', mass: '4300000', year: '1882-01-01T00:00:00.000', reclat: '37.62', reclong: '-99.18', fall: 'Found' },
    { name: 'Esquel', id: '32', recclass: 'Pallasite', mass: '750000', year: '1951-01-01T00:00:00.000', reclat: '-42.93', reclong: '-70.57', fall: 'Found' },
    { name: 'Campo del Cielo', id: '33', recclass: 'Iron, IAB-MG', mass: '100000000', year: '1576-01-01T00:00:00.000', reclat: '-27.47', reclong: '-60.58', fall: 'Found' },
    { name: 'Fukang', id: '34', recclass: 'Pallasite', mass: '1003000', year: '2000-01-01T00:00:00.000', reclat: '44.26', reclong: '87.98', fall: 'Found' },
    { name: 'Kaba', id: '35', recclass: 'CV3', mass: '3000000', year: '1857-01-01T00:00:00.000', reclat: '47.37', reclong: '21.29', fall: 'Fell' },
    { name: 'Park Forest', id: '36', recclass: 'L5', mass: '18000', year: '2003-01-01T00:00:00.000', reclat: '41.5', reclong: '-87.68', fall: 'Fell' },
    { name: 'Tatahouine', id: '37', recclass: 'Diogenite', mass: '12000', year: '1931-01-01T00:00:00.000', reclat: '32.94', reclong: '10.05', fall: 'Fell' },
    { name: 'Dhofar 019', id: '38', recclass: 'Martian (shergottite)', mass: '1056', year: '2000-01-01T00:00:00.000', reclat: '18.77', reclong: '55.18', fall: 'Found' },
    { name: 'Kaidun', id: '39', recclass: 'CR2', mass: '1700', year: '1980-01-01T00:00:00.000', reclat: '13.03', reclong: '46.08', fall: 'Fell' },
    { name: 'Almahata Sitta', id: '40', recclass: 'Ureilite (polymict)', mass: '10500', year: '2008-01-01T00:00:00.000', reclat: '20.42', reclong: '32.71', fall: 'Fell' },
    { name: 'Bjurböle', id: '41', recclass: 'L/LL4', mass: '330000', year: '1899-01-01T00:00:00.000', reclat: '60.32', reclong: '25.67', fall: 'Fell' },
    { name: 'Odessa', id: '42', recclass: 'Iron, IAB-MG', mass: '1487000', year: '1922-01-01T00:00:00.000', reclat: '31.77', reclong: '-102.48', fall: 'Found' },
    { name: 'Springwater', id: '43', recclass: 'Pallasite', mass: '71000', year: '1931-01-01T00:00:00.000', reclat: '51.43', reclong: '-108.13', fall: 'Found' },
    { name: 'Mundrabilla 002', id: '44', recclass: 'Iron, IAB-sHL', mass: '9000000', year: '1966-01-01T00:00:00.000', reclat: '-30.79', reclong: '127.55', fall: 'Found' },
    { name: 'Watson', id: '45', recclass: 'Iron, IIIAB', mass: '1200000', year: '1983-01-01T00:00:00.000', reclat: '-29.35', reclong: '133.68', fall: 'Found' },
    { name: 'Tsarev', id: '46', recclass: 'L5', mass: '1225000', year: '1922-01-01T00:00:00.000', reclat: '48.18', reclong: '45.6', fall: 'Found' },
    { name: 'Meteor Crater (Canyon Diablo 2)', id: '47', recclass: 'Iron, IAB-MG', mass: '500000', year: '1891-01-01T00:00:00.000', reclat: '35.03', reclong: '-111.02', fall: 'Found' },
    { name: 'El Hammami', id: '48', recclass: 'H5', mass: '390000', year: '1997-01-01T00:00:00.000', reclat: '22.53', reclong: '-13.45', fall: 'Found' },
    { name: 'Millbillillie', id: '49', recclass: 'Eucrite', mass: '351000', year: '1960-01-01T00:00:00.000', reclat: '-26.77', reclong: '120.37', fall: 'Found' },
    { name: 'Queen Alexandra Range 94201', id: '50', recclass: 'Lunar (mare basalt)', mass: '25.6', year: '1994-01-01T00:00:00.000', reclat: '-83.25', reclong: '168.22', fall: 'Found' },
    { name: 'Chassigny', id: '51', recclass: 'Martian (chassignite)', mass: '4000', year: '1815-01-01T00:00:00.000', reclat: '47.82', reclong: '5.27', fall: 'Fell' },
    { name: 'Shergotty', id: '52', recclass: 'Martian (shergottite)', mass: '5000', year: '1865-01-01T00:00:00.000', reclat: '25.25', reclong: '84.7', fall: 'Fell' },
    { name: 'Calcalong Creek', id: '53', recclass: 'Lunar (feldspathic)', mass: '19', year: '1990-01-01T00:00:00.000', reclat: '-19.92', reclong: '124.35', fall: 'Found' },
    { name: 'Pultusk', id: '54', recclass: 'H5', mass: '500000', year: '1868-01-01T00:00:00.000', reclat: '52.7', reclong: '21.06', fall: 'Fell' },
    { name: 'Pribram', id: '55', recclass: 'H5', mass: '5800', year: '1959-01-01T00:00:00.000', reclat: '49.68', reclong: '14.0', fall: 'Fell' },
    { name: 'Lost City', id: '56', recclass: 'H5', mass: '17000', year: '1970-01-01T00:00:00.000', reclat: '36.17', reclong: '-95.15', fall: 'Fell' },
    { name: 'Innisfree', id: '57', recclass: 'L5', mass: '4585', year: '1977-01-01T00:00:00.000', reclat: '53.38', reclong: '-111.55', fall: 'Fell' },
    { name: 'Tagish Lake', id: '58', recclass: 'C2', mass: '10000', year: '2000-01-01T00:00:00.000', reclat: '59.72', reclong: '-134.28', fall: 'Fell' },
    { name: 'Bassikounou', id: '59', recclass: 'H5', mass: '47000', year: '2006-01-01T00:00:00.000', reclat: '15.82', reclong: '-6.52', fall: 'Fell' },
    { name: 'Jesenice', id: '60', recclass: 'L6', mass: '3600', year: '2009-01-01T00:00:00.000', reclat: '46.43', reclong: '14.07', fall: 'Fell' },
    { name: 'Buzzard Coulee', id: '61', recclass: 'H4', mass: '41000', year: '2008-01-01T00:00:00.000', reclat: '52.98', reclong: '-109.87', fall: 'Fell' },
    { name: 'Sutter\'s Mill', id: '62', recclass: 'CM2', mass: '943', year: '2012-01-01T00:00:00.000', reclat: '38.8', reclong: '-120.9', fall: 'Fell' },
    { name: 'Novato', id: '63', recclass: 'L6', mass: '900', year: '2012-01-01T00:00:00.000', reclat: '38.1', reclong: '-122.57', fall: 'Fell' },
    { name: 'Chelyabinsk Orbit', id: '64', recclass: 'LL5', mass: '3000000', year: '2013-01-01T00:00:00.000', reclat: '54.9', reclong: '61.3', fall: 'Fell' },
    { name: 'Hamburg', id: '65', recclass: 'H4', mass: '1000', year: '2018-01-01T00:00:00.000', reclat: '42.1', reclong: '-84.0', fall: 'Fell' },
    { name: 'Winchcombe', id: '66', recclass: 'CM2', mass: '600', year: '2021-01-01T00:00:00.000', reclat: '51.94', reclong: '-1.97', fall: 'Fell' },
    { name: 'Flensburg', id: '67', recclass: 'C1', mass: '24.5', year: '2019-01-01T00:00:00.000', reclat: '54.79', reclong: '9.43', fall: 'Fell' },
    { name: 'Renchen', id: '68', recclass: 'L5-6', mass: '1200', year: '2021-01-01T00:00:00.000', reclat: '48.58', reclong: '8.03', fall: 'Fell' },
    { name: 'Elmshorn', id: '69', recclass: 'L', mass: '4900', year: '2023-01-01T00:00:00.000', reclat: '53.77', reclong: '9.65', fall: 'Fell' },
    { name: 'Aguas Zarcas', id: '70', recclass: 'CM2', mass: '27500', year: '2019-01-01T00:00:00.000', reclat: '10.42', reclong: '-84.35', fall: 'Fell' },
    { name: 'NWA 7034 (Black Beauty)', id: '71', recclass: 'Martian (regolith breccia)', mass: '319.8', year: '2011-01-01T00:00:00.000', reclat: '24.5', reclong: '-4.0', fall: 'Found' },
    { name: 'NWA 11119 (oldest achondrite)', id: '72', recclass: 'Ungrouped achondrite', mass: '100', year: '2016-01-01T00:00:00.000', reclat: '25.0', reclong: '-3.0', fall: 'Found' },
    { name: 'Dar al Gani 476 (lunar)', id: '73', recclass: 'Lunar (mare basalt)', mass: '2015', year: '1998-01-01T00:00:00.000', reclat: '27.03', reclong: '16.03', fall: 'Found' },
    { name: 'Alta\'ameem', id: '74', recclass: 'L6', mass: '10000', year: '1977-01-01T00:00:00.000', reclat: '33.53', reclong: '44.52', fall: 'Found' },
    { name: 'Dhofar 280', id: '75', recclass: 'Lunar (feldspathic)', mass: '527', year: '2000-01-01T00:00:00.000', reclat: '19.22', reclong: '56.33', fall: 'Found' },
    { name: 'Acapulco', id: '76', recclass: 'Acapulcoite', mass: '1914', year: '1976-01-01T00:00:00.000', reclat: '16.85', reclong: '-99.9', fall: 'Fell' },
    { name: 'São José do Rio Preto', id: '77', recclass: 'Iron, IIAB', mass: '200000', year: '1962-01-01T00:00:00.000', reclat: '-20.82', reclong: '-49.38', fall: 'Found' },
    { name: 'Bendegó', id: '78', recclass: 'Iron, IC', mass: '5360000', year: '1784-01-01T00:00:00.000', reclat: '-10.12', reclong: '-39.88', fall: 'Found' },
    { name: 'Santa Catharina', id: '79', recclass: 'Iron, IID', mass: '7800000', year: '1875-01-01T00:00:00.000', reclat: '-27.12', reclong: '-48.55', fall: 'Found' },
    { name: 'Coolamon', id: '80', recclass: 'L4', mass: '10000', year: '1939-01-01T00:00:00.000', reclat: '-34.82', reclong: '147.2', fall: 'Found' },
]

export default function MeteoritesPage() {
    const [meteorites, setMeteorites] = useState<Meteorite[]>(STATIC_METEORITES)
    const loading = false
    const [search, setSearch] = useState('')
    const [sortBy, setSortBy] = useState<'mass' | 'year'>('mass')
    const [hovered, setHovered] = useState<Meteorite | null>(null)
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 })
    const [classFilter, setClassFilter] = useState<string>('Tous')

    const CLASS_CHIPS = ['Tous', 'L', 'H', 'LL', 'Iron', 'Pallasite', 'CM', 'CV']

    const stats = useMemo(() => {
        if (!meteorites.length) return null
        const withMass = meteorites.filter((m: Meteorite) => m.mass)
        const heaviest = [...withMass].sort((a: Meteorite, b: Meteorite) => parseFloat(b.mass) - parseFloat(a.mass))[0]
        const byClass: Record<string, number> = {}
        meteorites.forEach((m: Meteorite) => {
            const k = m.recclass?.split(' ')[0]?.slice(0, 2) || 'Autre'
            byClass[k] = (byClass[k] || 0) + 1
        })
        const byDecade: Record<string, number> = {}
        meteorites.forEach((m: Meteorite) => {
            if (!m.year) return
            const yr = new Date(m.year).getFullYear()
            const decade = Math.floor(yr / 10) * 10
            byDecade[decade] = (byDecade[decade] || 0) + 1
        })
        return { total: meteorites.length, heaviest, byClass, byDecade }
    }, [meteorites])

    const classFiltered = useMemo(() => {
        if (classFilter === 'Tous') return meteorites
        return meteorites.filter((m: Meteorite) => m.recclass?.startsWith(classFilter))
    }, [meteorites, classFilter])

    const filtered = useMemo(() => {
        let res = classFiltered
        if (search) res = res.filter((m: Meteorite) => m.name?.toLowerCase().includes(search.toLowerCase()) || m.recclass?.toLowerCase().includes(search.toLowerCase()))
        return res.slice(0, 30).sort((a: Meteorite, b: Meteorite) => {
            if (sortBy === 'mass') return parseFloat(b.mass || '0') - parseFloat(a.mass || '0')
            return new Date(b.year || '0').getTime() - new Date(a.year || '0').getTime()
        })
    }, [classFiltered, search, sortBy])

    const W = 900
    const H = 450

    return (
        <div className="container" style={{ paddingTop: '3rem', paddingBottom: '6rem' }}>

            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="page-header">
                <div className="badge" style={{ background: 'rgba(249,115,22,0.12)', color: '#fb923c', borderColor: 'rgba(249,115,22,0.25)' }}>
                    ☄️ ARCHIVE NASA — ÉCHANTILLON DE {meteorites.length.toLocaleString('fr-FR')} MÉTÉORITES
                </div>
                <h1 className="page-title" style={{ background: 'linear-gradient(135deg, #fed7aa, #f97316, #c2410c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
                    Carte des Météorites
                </h1>
                <p className="page-subtitle">
                    Un échantillon cartographié du catalogue historique « Meteorite Landings ». Chaque point représente une roche venue de l&apos;espace.
                </p>
            </motion.div>

            {/* Stats */}
            {stats && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.625rem', marginBottom: '2rem' }} className="max-sm:grid-cols-2">
                    {[
                        { icon: '☄️', val: stats.total.toLocaleString('fr-FR'), label: 'Météorites localisées' },
                        { icon: '⚖️', val: stats.heaviest ? `${(parseFloat(stats.heaviest.mass) / 1000).toFixed(0)} kg` : '—', label: `La + lourde (${stats.heaviest?.name || ''})` },
                        { icon: '🌍', val: '6 continents', label: 'Zones d\'impact' },
                        { icon: '📅', val: '860+', label: 'Années de données' },
                    ].map(s => (
                        <div key={s.label} className="stat-card">
                            <div style={{ fontSize: '1.4rem' }}>{s.icon}</div>
                            <div className="stat-value" style={{ color: '#fb923c', fontSize: '1rem' }}>{s.val}</div>
                            <div className="stat-label">{s.label}</div>
                        </div>
                    ))}
                </div>
            )}

            {/* Class filter chips */}
            <div style={{ display: 'flex', gap: '0.375rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                {CLASS_CHIPS.map(chip => (
                    <button key={chip} onClick={() => setClassFilter(chip)} style={{
                        padding: '0.25rem 0.75rem', borderRadius: 99, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer',
                        background: classFilter === chip ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                        border: `1px solid ${classFilter === chip ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.07)'}`,
                        color: classFilter === chip ? '#fb923c' : '#64748b',
                        transition: 'all 0.15s',
                    }}>
                        {chip === 'Tous' ? '☄️ Tous' : chip}
                    </button>
                ))}
                {classFilter !== 'Tous' && (
                    <span style={{ color: '#475569', fontSize: '0.68rem', alignSelf: 'center', marginLeft: '0.25rem' }}>
                        {classFiltered.length.toLocaleString('fr-FR')} résultats
                    </span>
                )}
            </div>

            {/* World Map */}
            <div className="card" style={{ padding: 0, overflow: 'hidden', marginBottom: '1.5rem', position: 'relative' }}>
                <div style={{ background: 'rgba(249,115,22,0.06)', borderBottom: '1px solid rgba(249,115,22,0.12)', padding: '0.75rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <span style={{ fontSize: '1rem' }}>🗺️</span>
                        <span style={{ color: '#e2e8f0', fontWeight: 600, fontSize: '0.85rem' }}>Carte mondiale des impacts</span>
                    </div>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                        {Object.entries(CLASS_COLOR).slice(0, 5).map(([k, v]) => (
                            <div key={k} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: v }} />
                                <span style={{ color: '#64748b', fontSize: '0.65rem' }}>{k}</span>
                            </div>
                        ))}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#64748b' }} />
                            <span style={{ color: '#64748b', fontSize: '0.65rem' }}>Autres</span>
                        </div>
                    </div>
                </div>

                {loading ? (
                    <div style={{ height: 400, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b' }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔄</div>
                            <p>Chargement de la base NASA…</p>
                        </div>
                    </div>
                ) : (
                    <div style={{ position: 'relative', background: '#030314' }}>
                        <svg
                            viewBox={`0 0 ${W} ${H}`}
                            width="100%"
                            style={{ display: 'block', cursor: 'crosshair' }}
                            onMouseMove={e => {
                                const rect = e.currentTarget.getBoundingClientRect()
                                setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top })
                            }}
                            onMouseLeave={() => setHovered(null)}
                        >
                            {/* World map rectangle */}
                            <rect width={W} height={H} fill="#050520" />
                            {/* Graticule (latitude/longitude grid) */}
                            {[-60, -30, 0, 30, 60].map(lat => {
                                const y = ((90 - lat) / 180) * H
                                return <line key={lat} x1={0} y1={y} x2={W} y2={y} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            })}
                            {[-120, -60, 0, 60, 120].map(lng => {
                                const x = ((lng + 180) / 360) * W
                                return <line key={lng} x1={x} y1={0} x2={x} y2={H} stroke="rgba(255,255,255,0.05)" strokeWidth="0.5" />
                            })}
                            {/* Equator and prime meridian */}
                            <line x1={0} y1={H / 2} x2={W} y2={H / 2} stroke="rgba(255,255,255,0.1)" strokeWidth="0.8" />
                            <line x1={W / 2} y1={0} x2={W / 2} y2={H} stroke="rgba(255,255,255,0.08)" strokeWidth="0.5" />
                            {/* Axis labels */}
                            {[{ lat: 90, label: '90°N' }, { lat: 0, label: 'Éq.' }, { lat: -90, label: '90°S' }].map(l => (
                                <text key={l.lat} x={6} y={((90 - l.lat) / 180) * H + 4} fill="rgba(255,255,255,0.2)" fontSize="7">{l.label}</text>
                            ))}
                            {/* Meteorite dots */}
                            {classFiltered.map((m, i) => {
                                const lat = parseFloat(m.reclat)
                                const lng = parseFloat(m.reclong)
                                if (isNaN(lat) || isNaN(lng)) return null
                                const { x, y } = latLngToSvg(lat, lng, W, H)
                                const col = getColor(m.recclass || '')
                                const mass = parseFloat(m.mass || '0')
                                const r = mass > 100000 ? 3.5 : mass > 10000 ? 2.5 : mass > 1000 ? 2 : 1.2
                                return (
                                    <circle key={m.id || i} cx={x} cy={y} r={r}
                                        fill={col} opacity={0.6}
                                        onMouseEnter={() => setHovered(m)}
                                        style={{ cursor: 'pointer', transition: 'r 0.1s' }}
                                    />
                                )
                            })}
                        </svg>

                        {/* Tooltip */}
                        {hovered && (
                            <div style={{
                                position: 'absolute',
                                left: Math.min(mousePos.x + 12, 680),
                                top: Math.max(mousePos.y - 70, 10),
                                background: 'rgba(0,0,20,0.92)', backdropFilter: 'blur(12px)',
                                border: '1px solid rgba(249,115,22,0.3)', borderRadius: '0.625rem',
                                padding: '0.625rem 0.875rem', pointerEvents: 'none', zIndex: 10, minWidth: 180,
                            }}>
                                <div style={{ color: '#fb923c', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.25rem' }}>
                                    {hovered.name}
                                </div>
                                <div style={{ color: '#94a3b8', fontSize: '0.72rem' }}>
                                    {hovered.recclass} · {hovered.mass ? `${Number(hovered.mass).toFixed(0)}g` : 'masse inconnue'}
                                </div>
                                <div style={{ color: '#64748b', fontSize: '0.65rem' }}>
                                    {hovered.year ? new Date(hovered.year).getFullYear() : 'Année inconnue'} · {hovered.fall}
                                </div>
                                <div style={{ color: '#475569', fontSize: '0.62rem', marginTop: 2 }}>
                                    {parseFloat(hovered.reclat).toFixed(2)}°, {parseFloat(hovered.reclong).toFixed(2)}°
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Top meteorites table */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="card" style={{ padding: '1.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                        <h3 className="section-title" style={{ color: '#e2e8f0', fontSize: '0.95rem', marginBottom: 0 }}>🏆 Top météorites</h3>
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                            {(['mass', 'year'] as const).map(s => (
                                <button key={s} onClick={() => setSortBy(s)} style={{
                                    padding: '3px 8px', borderRadius: 99, fontSize: '0.65rem', fontWeight: 600, cursor: 'pointer',
                                    background: sortBy === s ? 'rgba(249,115,22,0.15)' : 'rgba(255,255,255,0.04)',
                                    border: `1px solid ${sortBy === s ? 'rgba(249,115,22,0.4)' : 'rgba(255,255,255,0.06)'}`,
                                    color: sortBy === s ? '#fb923c' : '#64748b',
                                }}>
                                    {s === 'mass' ? '⚖️ Masse' : '📅 Récentes'}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div style={{ display: 'flex', gap: '0.375rem', marginBottom: '0.75rem' }}>
                        <input
                            type="text" value={search} onChange={e => setSearch(e.target.value)}
                            placeholder="Rechercher par nom ou classe…"
                            style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', color: '#e2e8f0', fontSize: '0.75rem', outline: 'none' }}
                        />
                    </div>
                    <div style={{ maxHeight: 320, overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '0.3rem' }}>
                        {filtered.map((m, i) => (
                            <div key={m.id || i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.625rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', cursor: 'pointer' }}
                                onMouseEnter={() => setHovered(m)} onMouseLeave={() => setHovered(null)}>
                                <div style={{ width: 8, height: 8, borderRadius: '50%', background: getColor(m.recclass || ''), flexShrink: 0 }} />
                                <div style={{ flex: 1 }}>
                                    <div style={{ color: '#e2e8f0', fontSize: '0.75rem', fontWeight: 600 }}>{m.name}</div>
                                    <div style={{ color: '#475569', fontSize: '0.62rem' }}>{m.recclass} · {m.year ? new Date(m.year).getFullYear() : '?'}</div>
                                </div>
                                <div style={{ color: '#fb923c', fontSize: '0.72rem', fontWeight: 700, fontFamily: 'monospace' }}>
                                    {m.mass ? `${Number(m.mass) >= 1000 ? (Number(m.mass) / 1000).toFixed(1) + 'kg' : Number(m.mass).toFixed(0) + 'g'}` : '—'}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Classes */}
                <div className="card" style={{ padding: '1.25rem' }}>
                    <h3 className="section-title" style={{ color: '#e2e8f0', fontSize: '0.95rem' }}>📊 Répartition par classe</h3>
                    {stats && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                            {Object.entries(stats.byClass)
                                .sort(([, a], [, b]) => b - a)
                                .slice(0, 10)
                                .map(([cls, cnt]) => (
                                    <div key={cls} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <div style={{ width: 8, height: 8, borderRadius: '50%', background: getColor(cls), flexShrink: 0 }} />
                                        <span style={{ color: '#94a3b8', fontSize: '0.72rem', width: 35, flexShrink: 0 }}>{cls}*</span>
                                        <div style={{ flex: 1, height: 4, borderRadius: 99, background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                                            <div style={{ height: '100%', width: `${(cnt / stats.total) * 100 * 5}%`, maxWidth: '100%', background: getColor(cls), borderRadius: 99 }} />
                                        </div>
                                        <span style={{ color: '#64748b', fontSize: '0.68rem', minWidth: 35, textAlign: 'right' }}>{cnt.toLocaleString('fr-FR')}</span>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                    <div className="divider" />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        {[
                            { icon: '🪨', title: 'Chondrites', desc: 'Les plus communes — restent depuis la formation du système solaire (4,6 Ga)' },
                            { icon: '⚙️', title: 'Sidérites', desc: 'Métalliques (Fer/Nickel) — proviennent du noyau d\'astéroïdes fracturés' },
                            { icon: '🌕', title: 'Lunaires', desc: 'Éjectées par des impacts sur la Lune puis capturées par la Terre' },
                            { icon: '🔴', title: 'Martiennes', desc: 'Extraites de Mars par des impacts — 300 identifiées dans le monde' },
                        ].map(t => (
                            <div key={t.title} style={{ padding: '0.625rem', borderRadius: '0.5rem', background: 'rgba(249,115,22,0.04)', border: '1px solid rgba(249,115,22,0.08)' }}>
                                <div style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>{t.icon}</div>
                                <div style={{ color: '#fb923c', fontSize: '0.72rem', fontWeight: 700, marginBottom: '0.2rem' }}>{t.title}</div>
                                <div style={{ color: '#475569', fontSize: '0.65rem', lineHeight: 1.5 }}>{t.desc}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
