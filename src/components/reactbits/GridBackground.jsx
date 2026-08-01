import React from 'react'

/**
 * Aceternity Grid Background component
 * Renders a customizable CSS grid pattern with a radial fade mask for modern aesthetics.
 */
export default function GridBackground({ className = 'fixed inset-0 pointer-events-none z-0 w-full h-full' }) {
    return (
        <div className={`pointer-events-none overflow-hidden ${className}`}>
            {/* Grid Lines */}
            <div className="absolute inset-0 [background-size:40px_40px] [background-image:linear-gradient(to_right,#e4e4e7_1px,transparent_1px),linear-gradient(to_bottom,#e4e4e7_1px,transparent_1px)] dark:[background-image:linear-gradient(to_right,#262626_1px,transparent_1px),linear-gradient(to_bottom,#262626_1px,transparent_1px)] opacity-70 dark:opacity-50" />
        </div>
    )
}
