"use client"

import Spline from '@splinetool/react-spline'

interface SplineHeroProps {
  className?: string
}

export default function SplineHero({ className = "" }: SplineHeroProps) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Spline
        scene="https://prod.spline.design/XkR-v-hpK3dAdr7p/scene.splinecode"
        style={{ 
          width: '100%', 
          height: '100%',
          pointerEvents: 'auto'
        }}
      />
    </div>
  )
}
