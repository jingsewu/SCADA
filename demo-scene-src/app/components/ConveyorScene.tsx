import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import {
  useGLTF,
  ContactShadows,
  Environment,
  OrbitControls,
  Bounds,
} from '@react-three/drei'
import type { GLTF } from 'three-stdlib'
import * as THREE from 'three'

// 预加载模型
useGLTF.preload('/models/conveyor.glb')

type ConveyorGLTF = GLTF & {
  nodes: {
    [key: string]: THREE.Mesh
  }
  materials: {
    M_01___Default: THREE.MeshStandardMaterial
    M_02___Default: THREE.MeshStandardMaterial
    M_03___Default: THREE.MeshStandardMaterial
    M_04___Default: THREE.MeshStandardMaterial
    M_05___Default: THREE.MeshStandardMaterial
    M_022___Default: THREE.MeshStandardMaterial
    [key: string]: THREE.MeshStandardMaterial
  }
}

function ConveyorModel() {
  const { nodes } = useGLTF('/models/conveyor.glb') as ConveyorGLTF

  return (
    <group>
      {Object.entries(nodes).map(([name, node]) => {
        if ((node as THREE.Mesh).isMesh) {
          const mesh = node as THREE.Mesh
          return (
            <mesh
              key={name}
              castShadow
              receiveShadow
              geometry={mesh.geometry}
              material={mesh.material}
              position={mesh.position}
              rotation={mesh.rotation}
              scale={mesh.scale}
            />
          )
        }
        return null
      })}
    </group>
  )
}

function SceneLights() {
  return (
    <>
      <color attach="background" args={['#cfcfcf']} />
      <hemisphereLight intensity={0.32} color="#b8d4de" groundColor="#141f1e" />
      <ambientLight intensity={0.14} color="#a8b8b5" />
      <directionalLight
        castShadow
        position={[20, 28, 16]}
        intensity={3.72}
        color="#fff6ed"
        shadow-mapSize={[2048, 2048] as unknown as THREE.Vector2}
        shadow-bias={-0.00015}
        shadow-normalBias={0.025}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-36, 36, 36, -36, 0.5, 140]}
        />
      </directionalLight>
      <directionalLight position={[-16, 12, -14]} intensity={0.22} color="#8faabe" />
      <directionalLight position={[6, 8, -22]} intensity={0.3} color="#6bb8a8" />
      <pointLight position={[10, 4, 8]} intensity={0.18} color="#dceae8" distance={40} />
    </>
  )
}

function SceneContent() {
  return (
    <>
      <SceneLights />
      <group>
        <Bounds fit clip observe damping={6} margin={1.2}>
          <group scale={0.003}>
            <ConveyorModel />
          </group>
        </Bounds>
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.02, 0]} receiveShadow>
          <planeGeometry args={[160, 160]} />
          <meshStandardMaterial color="#f7f9fb" roughness={0.9} metalness={0.02} />
        </mesh>
        <ContactShadows
          opacity={1}
          scale={40}
          blur={0.5}
          far={16}
          resolution={1024}
          color="#2c2c2c"
          frames={1}
        />
      </group>
      <Environment preset="city" environmentIntensity={0.18} />
      <OrbitControls
        makeDefault
        enableDamping
        dampingFactor={0.06}
        minDistance={2}
        maxDistance={80}
      />
    </>
  )
}

export function ConveyorScene() {
  return (
    <main className="flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-hidden">
      <div className="relative min-h-0 w-full min-w-0 flex-1">
        <Canvas
          className="absolute inset-0 h-full w-full"
          camera={{ position: [14, 10, 18], fov: 45, near: 0.1, far: 50000 }}
          dpr={[1, 2]}
          shadows="soft"
          gl={{ antialias: true }}
        >
          <Suspense fallback={null}>
            <SceneContent />
          </Suspense>
        </Canvas>
      </div>
    </main>
  )
}
