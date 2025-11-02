"use client"

import { useEffect } from 'react'
import Spline from '@splinetool/react-spline'

interface SplineHeroProps {
  className?: string
}

export default function SplineHero({ className = "" }: SplineHeroProps) {
  useEffect(() => {
    // Eliminar el logo de Spline
    const interval = setInterval(() => {
      const viewer = document.querySelector('spline-viewer')
      if (viewer && viewer.shadowRoot) {
        const logo = viewer.shadowRoot.querySelector('#logo')
        if (logo) {
          logo.remove() // 💥 remove the logo element entirely
          console.log("Logo removed!")
          clearInterval(interval)
        }
      }
    }, 500)

    // Limpiar el intervalo cuando el componente se desmonte
    return () => clearInterval(interval)
  }, [])

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
