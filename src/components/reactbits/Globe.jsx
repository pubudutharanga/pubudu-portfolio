import React, { useRef, useMemo, useEffect, useState } from "react"
import { Canvas, useFrame, extend, useThree } from "@react-three/fiber"
import { OrbitControls } from "@react-three/drei"
import ThreeGlobe from "three-globe"
import * as THREE from "three"

extend({ ThreeGlobe })

function GlobeMesh({ data = [], globeConfig = {} }) {
    const groupRef = useRef()
    const globeRef = useRef()
    const [countriesData, setCountriesData] = useState(null)

    // Fetch world countries GeoJSON for Aceternity hex dot continents
    useEffect(() => {
        fetch("/world.json")
            .then(res => res.json())
            .then(data => setCountriesData(data.features))
            .catch(err => console.error("Failed to load world GeoJSON:", err))
    }, [])

    const globeInstance = useMemo(() => {
        const globe = new ThreeGlobe()
            .globeMaterial(
                new THREE.MeshPhongMaterial({
                    color: globeConfig.globeColor || "#062056",
                    emissive: globeConfig.emissive || "#062056",
                    emissiveIntensity: globeConfig.emissiveIntensity !== undefined ? globeConfig.emissiveIntensity : 0.12,
                    shininess: globeConfig.shininess !== undefined ? globeConfig.shininess : 0.9,
                })
            )

        if (globeConfig.showAtmosphere) {
            globe
                .showAtmosphere(true)
                .atmosphereColor(globeConfig.atmosphereColor || "#FFFFFF")
                .atmosphereAltitude(globeConfig.atmosphereAltitude || 0.12)
        }

        if (data && data.length > 0) {
            globe
                .arcsData(data)
                .arcStartLat(d => d.startLat)
                .arcStartLng(d => d.startLng)
                .arcEndLat(d => d.endLat)
                .arcEndLng(d => d.endLng)
                .arcColor(d => d.color)
                .arcAltitude(d => d.arcAlt || 0.3)
                .arcDashLength(globeConfig.arcLength || 0.9)
                .arcDashGap(2)
                .arcDashAnimateTime(globeConfig.arcTime || 1000)
                .arcDashInitialGap(() => Math.random() * 5)
                .arcStroke(0.6)

            const origins = data.map(d => ({ lat: d.startLat, lng: d.startLng, color: d.color }))
            const destinations = data.map(d => ({ lat: d.endLat, lng: d.endLng, color: d.color }))
            const combinedNodes = [...origins, ...destinations]

            globe
                .ringsData(combinedNodes)
                .ringColor(d => d.color)
                .ringMaxRadius(3.5)
                .ringPropagationSpeed(3)
                .ringRepeatPeriod(700)

            globe
                .pointsData(combinedNodes)
                .pointColor(d => d.color)
                .pointAltitude(0.005)
                .pointRadius(0.35)
        }

        return globe
    }, [data])

    // Reactive theme & config updates when switching between Light & Dark modes
    useEffect(() => {
        if (!globeRef.current) return
        const globe = globeRef.current
        const mat = globe.globeMaterial()
        if (mat) {
            mat.color.set(globeConfig.globeColor || "#062056")
            mat.emissive.set(globeConfig.emissive || "#062056")
            mat.emissiveIntensity = globeConfig.emissiveIntensity !== undefined ? globeConfig.emissiveIntensity : 0.12
            mat.shininess = globeConfig.shininess !== undefined ? globeConfig.shininess : 0.9
            mat.needsUpdate = true
        }
        if (globeConfig.showAtmosphere) {
            globe.atmosphereColor(globeConfig.atmosphereColor || "#FFFFFF")
            globe.atmosphereAltitude(globeConfig.atmosphereAltitude || 0.12)
        }
        if (data && data.length > 0) {
            globe.arcColor(d => d.color)
            globe.ringColor(d => d.color)
            globe.pointColor(d => d.color)
        }
    }, [globeConfig, data])

    // Initialize continent hex polygons ONCE when GeoJSON loads
    useEffect(() => {
        if (globeInstance && countriesData) {
            globeInstance
                .hexPolygonsData(countriesData)
                .hexPolygonResolution(3)
                .hexPolygonMargin(0.7)
                .hexPolygonColor(() => globeConfig.polygonColor || "rgba(255,255,255,0.7)")
        }
    }, [globeInstance, countriesData])

    // Update hex polygon color dynamically without recomputing polygon mesh data
    useEffect(() => {
        if (globeInstance && countriesData) {
            globeInstance.hexPolygonColor(() => globeConfig.polygonColor || "rgba(255,255,255,0.7)")
        }
    }, [globeInstance, countriesData, globeConfig.polygonColor])

    // Continuous rotation in animation loop
    useFrame((state, delta) => {
        if (groupRef.current && globeConfig.autoRotate !== false) {
            const speed = globeConfig.autoRotateSpeed !== undefined ? globeConfig.autoRotateSpeed : 0.5
            groupRef.current.rotation.y += delta * (speed * 0.3)
        }
    })

    return (
        <group ref={groupRef}>
            <primitive object={globeInstance} ref={globeRef} />
        </group>
    )
}

// Dynamically adjust camera distance on smaller mobile screens so the sphere fits without cropping
function ResponsiveCamera() {
    const { size, camera } = useThree()

    useEffect(() => {
        if (size.width < 480) {
            camera.position.z = 370 // Mobile devices: pull camera back for optimal viewing geometry
        } else if (size.width < 768) {
            camera.position.z = 320 // Tablets & smaller notebooks
        } else {
            camera.position.z = 275 // Standard desktop view
        }
        camera.updateProjectionMatrix()
    }, [size.width, camera])

    return null
}

export function World({ data = [], globeConfig = {} }) {
    return (
        <div className="w-full h-full relative overflow-hidden flex items-center justify-center">
            <Canvas
                camera={{ position: [0, 0, 275], fov: 45 }}
                className="w-full h-full cursor-grab active:cursor-grabbing"
                gl={{ antialias: true, alpha: true }}
            >
                <ResponsiveCamera />
                <ambientLight color={globeConfig.ambientLight || "#38bdf8"} intensity={globeConfig.ambientIntensity !== undefined ? globeConfig.ambientIntensity : 0.8} />
                <directionalLight color={globeConfig.directionalTopLight || "#ffffff"} position={[-200, 500, 200]} intensity={1.8} />
                <directionalLight color={globeConfig.directionalLeftLight || "#ffffff"} position={[-500, 200, -200]} intensity={1.4} />
                <pointLight color={globeConfig.pointLight || "#ffffff"} position={[200, -200, 200]} intensity={1.6} />

                <GlobeMesh data={data} globeConfig={globeConfig} />

                <OrbitControls
                    enablePan={false}
                    enableZoom={false}
                    minDistance={150}
                    maxDistance={450}
                    autoRotate={false}
                    rotateSpeed={0.8}
                />
            </Canvas>
        </div>
    )
}

export default World
