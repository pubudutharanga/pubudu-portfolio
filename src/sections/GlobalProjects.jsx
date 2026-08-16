import React, { useMemo } from "react"
import { motion } from "framer-motion"
import { World } from "../components/reactbits"
import { FaGlobe } from "react-icons/fa"

export default function GlobalProjects({ dark }) {
  // Dark mode remains 100% true to original Aceternity spec.
  // Light mode features a tailored, Stripe-inspired pearlescent cerulean sphere with royal indigo continent dots and azure atmosphere.
  const globeConfig = useMemo(() => ({
    pointSize: 4,
    globeColor: dark ? "#062056" : "#e0f2fe",
    showAtmosphere: true,
    atmosphereColor: dark ? "#FFFFFF" : "#0284c7",
    atmosphereAltitude: dark ? 0.12 : 0.16,
    emissive: dark ? "#062056" : "#7dd3fc",
    emissiveIntensity: dark ? 0.12 : 0.35,
    shininess: dark ? 0.9 : 0.6,
    polygonColor: dark ? "rgba(255, 255, 255, 0.7)" : "rgba(30, 58, 138, 0.88)",
    ambientLight: "#38bdf8",
    ambientIntensity: dark ? 0.8 : 1.5,
    directionalLeftLight: "#ffffff",
    directionalTopLight: "#ffffff",
    pointLight: "#ffffff",
    arcTime: 1100,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 0.5,
  }), [dark])

  // Neon palettes optimized for contrast against their respective backgrounds
  const sampleArcs = useMemo(() => {
    const darkColors = ["#06b6d4", "#3b82f6", "#6366f1", "#8b5cf6", "#38bdf8"]
    const lightColors = ["#0284c7", "#2563eb", "#6d28d9", "#7c3aed", "#0369a1"]
    const colors = dark ? darkColors : lightColors
    
    return [
      { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.1, color: colors[0] },
      { order: 1, startLat: 28.6139, startLng: 77.209, endLat: 3.139, endLng: 101.6869, arcAlt: 0.2, color: colors[1] },
      { order: 1, startLat: -19.885592, startLng: -43.951191, endLat: -1.303396, endLng: 36.852443, arcAlt: 0.5, color: colors[2] },
      { order: 2, startLat: 1.3521, startLng: 103.8198, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.2, color: colors[3] },
      { order: 2, startLat: 51.5072, startLng: -0.1276, endLat: 3.139, endLng: 101.6869, arcAlt: 0.3, color: colors[4] },
      { order: 2, startLat: -15.785493, startLng: -47.909029, endLat: 36.162809, endLng: -115.119411, arcAlt: 0.3, color: colors[0] },
      { order: 3, startLat: -33.8688, startLng: 151.2093, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[1] },
      { order: 3, startLat: 21.3099, startLng: -157.8581, endLat: 40.7128, endLng: -74.006, arcAlt: 0.3, color: colors[2] },
      { order: 3, startLat: -6.2088, startLng: 106.8456, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[3] },
      { order: 4, startLat: 11.986597, startLng: 8.571831, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.5, color: colors[4] },
      { order: 4, startLat: -34.6037, startLng: -58.3816, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.7, color: colors[0] },
      { order: 4, startLat: 51.5072, startLng: -0.1276, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.1, color: colors[1] },
      { order: 5, startLat: 14.5995, startLng: 120.9842, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[2] },
      { order: 5, startLat: 1.3521, startLng: 103.8198, endLat: -33.8688, endLng: 151.2093, arcAlt: 0.2, color: colors[3] },
      { order: 5, startLat: 34.0522, startLng: -118.2437, endLat: 48.8566, endLng: -2.3522, arcAlt: 0.2, color: colors[4] },
      { order: 6, startLat: -15.432563, startLng: 28.315853, endLat: 1.094136, endLng: -63.34546, arcAlt: 0.7, color: colors[0] },
      { order: 6, startLat: 37.5665, startLng: 126.978, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.1, color: colors[1] },
      { order: 6, startLat: 22.3193, startLng: 114.1694, endLat: 51.5072, endLng: -0.1276, arcAlt: 0.3, color: colors[2] },
      { order: 7, startLat: -19.885592, startLng: -43.951191, endLat: -15.595412, endLng: -56.05918, arcAlt: 0.1, color: colors[3] },
      { order: 7, startLat: 48.8566, startLng: -2.3522, endLat: 52.52, endLng: 13.405, arcAlt: 0.1, color: colors[4] },
      { order: 7, startLat: 52.52, startLng: 13.405, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[0] },
      { order: 8, startLat: -8.833221, startLng: 13.264837, endLat: -33.936138, endLng: 18.436529, arcAlt: 0.2, color: colors[1] },
      { order: 8, startLat: 49.2827, startLng: -123.1207, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.2, color: colors[2] },
      { order: 8, startLat: 1.3521, startLng: 103.8198, endLat: 40.7128, endLng: -74.006, arcAlt: 0.5, color: colors[3] },
      { order: 9, startLat: 51.5072, startLng: -0.1276, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[4] },
      { order: 9, startLat: 22.3193, startLng: 114.1694, endLat: -22.9068, endLng: -43.1729, arcAlt: 0.7, color: colors[0] },
      { order: 9, startLat: 1.3521, startLng: 103.8198, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.5, color: colors[1] },
      { order: 10, startLat: -22.9068, startLng: -43.1729, endLat: 28.6139, endLng: 77.209, arcAlt: 0.7, color: colors[2] },
      { order: 10, startLat: 34.0522, startLng: -118.2437, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.3, color: colors[3] },
      { order: 10, startLat: -6.2088, startLng: 106.8456, endLat: 52.3676, endLng: 4.9041, arcAlt: 0.3, color: colors[4] },
      { order: 11, startLat: 41.9028, startLng: 12.4964, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.2, color: colors[0] },
      { order: 11, startLat: -6.2088, startLng: 106.8456, endLat: 31.2304, endLng: 121.4737, arcAlt: 0.2, color: colors[1] },
      { order: 11, startLat: 22.3193, startLng: 114.1694, endLat: 1.3521, endLng: 103.8198, arcAlt: 0.2, color: colors[2] },
      { order: 12, startLat: 34.0522, startLng: -118.2437, endLat: 37.7749, endLng: -122.4194, arcAlt: 0.1, color: colors[3] },
      { order: 12, startLat: 35.6762, startLng: 139.6503, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.2, color: colors[4] },
      { order: 12, startLat: 22.3193, startLng: 114.1694, endLat: 34.0522, endLng: -118.2437, arcAlt: 0.3, color: colors[0] },
      { order: 13, startLat: 52.52, startLng: 13.405, endLat: 22.3193, endLng: 114.1694, arcAlt: 0.3, color: colors[1] },
      { order: 13, startLat: 11.986597, startLng: 8.571831, endLat: 35.6762, endLng: 139.6503, arcAlt: 0.3, color: colors[2] },
      { order: 13, startLat: -22.9068, startLng: -43.1729, endLat: -34.6037, endLng: -58.3816, arcAlt: 0.1, color: colors[3] },
      { order: 14, startLat: -33.936138, startLng: 18.436529, endLat: 21.395643, endLng: 39.883798, arcAlt: 0.3, color: colors[4] },
    ]
  }, [dark])

  return (
    <section id="global" className="relative py-20 overflow-hidden bg-transparent border-t border-gray-200/60 dark:border-gray-800/60 transition-colors duration-300 w-full">
      <div className="max-w-7xl mx-auto px-4 relative z-20">
        {/* Top Header Block */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="text-center mb-10 sm:mb-12"
        >
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full text-sm font-medium mb-4">
            <FaGlobe className="mr-2" />
            Global Engineering Solutions
          </div>

          <h2 className="text-3xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Doing Projects From Any Place <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Across The Globe</span>
          </h2>
          
          <p className="text-gray-600 dark:text-gray-300 text-lg max-w-2xl mx-auto leading-relaxed">
            Distance is never a boundary when world-class engineering meets agile remote execution. This interactive 3D globe represents active collaboration across every major continent and time zone.
          </p>
        </motion.div>

        {/* Dedicated 3D Globe Stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full max-w-5xl mx-auto h-[22rem] sm:h-[34rem] md:h-[40rem] lg:h-[42rem] flex items-center justify-center mt-4 sm:mt-6 mb-2 sm:mb-4 select-none"
        >
          {/* Theme-Adaptive Backdrop Spotlight (Soft opacity preserves grid background visibility) */}
          <div className="absolute w-[18rem] sm:w-[30rem] md:w-[42rem] h-[18rem] sm:h-[30rem] md:h-[42rem] rounded-full bg-gradient-to-tr from-sky-400/15 via-blue-500/10 to-indigo-500/15 dark:from-cyan-500/15 dark:via-blue-600/15 dark:to-purple-500/15 blur-[80px] pointer-events-none -z-10 transition-colors duration-500" />

          <div className="w-full h-full relative z-10 flex items-center justify-center">
            <World data={sampleArcs} globeConfig={globeConfig} />
          </div>
        </motion.div>
      </div>
    </section>
  )
}
