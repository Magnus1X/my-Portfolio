import React, { useRef, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Points, PointMaterial } from '@react-three/drei'
import * as THREE from 'three'

// Particle system component
function ParticleField() {
  const pointsRef = useRef()
  const particleCount = 1000

  // Generate random particle positions
  const positions = React.useMemo(() => {
    const positions = new Float32Array(particleCount * 3)
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 100
      positions[i * 3 + 1] = (Math.random() - 0.5) * 100
      positions[i * 3 + 2] = (Math.random() - 0.5) * 100
    }
    return positions
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
      pointsRef.current.rotation.x = state.clock.elapsedTime * 0.05
      pointsRef.current.rotation.y = state.clock.elapsedTime * 0.075
    }
  })

  return (
    <Points ref={pointsRef} positions={positions} stride={3} frustumCulled={false}>
      <PointMaterial
        transparent
        color="#60a5fa"
        size={0.5}
        sizeAttenuation={true}
        depthWrite={false}
        opacity={0.6}
      />
    </Points>
  )
}

// Floating geometry component
// function FloatingGeometry() {
//   const meshRef = useRef()
//   const geometry = React.useMemo(() => new THREE.OctahedronGeometry(2, 0), [])

//   useFrame((state) => {
//     if (meshRef.current) {
//       meshRef.current.rotation.x = state.clock.elapsedTime * 0.2
//       meshRef.current.rotation.y = state.clock.elapsedTime * 0.3
//       meshRef.current.position.y = Math.sin(state.clock.elapsedTime * 0.5) * 2
//     }
//   })

//   return (
//     <mesh ref={meshRef} geometry={geometry} position={[10, 0, -20]}>
//       <meshBasicMaterial
//         color="#3b82f6"
//         wireframe
//         opacity={0.3}
//         transparent
//       />
//     </mesh>
//   )
// }

const ThreeBackground = () => {
  const canvasRef = useRef()

  useEffect(() => {
    // Set canvas to fixed position and behind content
    if (canvasRef.current) {
      canvasRef.current.style.position = 'fixed'
      canvasRef.current.style.top = '0'
      canvasRef.current.style.left = '0'
      canvasRef.current.style.width = '100%'
      canvasRef.current.style.height = '100%'
      canvasRef.current.style.zIndex = '-1'
      canvasRef.current.style.pointerEvents = 'none'
    }
  }, [])

  return (
    <div className="three-canvas">
      <Canvas
        ref={canvasRef}
        camera={{ position: [0, 0, 30], fov: 75 }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.5} />
        <ParticleField />
        {/* <FloatingGeometry /> */}
      </Canvas>
    </div>
  )
}

export default ThreeBackground
