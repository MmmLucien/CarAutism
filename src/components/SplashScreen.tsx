import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

interface SplashScreenProps {
  onDone: () => void
  minDuration?: number
  preload?: () => Promise<void>
}

const MESSAGES = [
  'Mise en grille…',
  'Vérification des pneus…',
  'Chauffe moteur…',
  'Calage de la stratégie…',
  'Ouverture des stands…',
]

export function SplashScreen({ onDone, minDuration = 5000, preload }: SplashScreenProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [exiting, setExiting] = useState(false)
  const [message, setMessage] = useState(MESSAGES[0])
  const [notification, setNotification] = useState<string | null>(null)
  const [modelReady, setModelReady] = useState(false)

  // Messages cycling
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % MESSAGES.length
      setMessage(MESSAGES[i])
    }, 900)
    return () => clearInterval(id)
  }, [])

  // Notification
  useEffect(() => {
    const t = setTimeout(() => {
      setNotification('🏁 Le Mans Classic 2026 — 120 questions disponibles')
    }, 1500)
    return () => clearTimeout(t)
  }, [])

  // Three.js scene
  useEffect(() => {
    const container = mountRef.current
    if (!container) return

    const W = container.offsetWidth
    const H = container.offsetHeight

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
    renderer.setSize(W, H)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.shadowMap.enabled = true
    renderer.shadowMap.type = THREE.PCFSoftShadowMap
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.4
    renderer.domElement.style.position = 'absolute'
    renderer.domElement.style.inset = '0'
    container.appendChild(renderer.domElement)

    // Scene & camera
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(38, W / H, 0.01, 100)
    camera.position.set(0, 1.0, 4.2)
    camera.lookAt(0, 0.2, 0)

    // Lights
    scene.add(new THREE.AmbientLight(0x111122, 2))

    const key = new THREE.DirectionalLight(0xffeedd, 5)
    key.position.set(4, 6, 4)
    key.castShadow = true
    key.shadow.mapSize.setScalar(2048)
    key.shadow.camera.near = 0.1
    key.shadow.camera.far = 20
    key.shadow.camera.left = -3
    key.shadow.camera.right = 3
    key.shadow.camera.top = 3
    key.shadow.camera.bottom = -3
    scene.add(key)

    const fill = new THREE.DirectionalLight(0x4466ff, 1.5)
    fill.position.set(-4, 2, 2)
    scene.add(fill)

    const rim = new THREE.DirectionalLight(0xff1100, 2.5)
    rim.position.set(0, 0.5, -4)
    scene.add(rim)

    scene.add(new THREE.DirectionalLight(0xffffff, 0.8).position.set(0, 8, 0) as any)

    const under = new THREE.PointLight(0xcc0000, 2, 4)
    under.position.set(0, -0.8, 0.5)
    scene.add(under)

    // Ground shadow
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(10, 10),
      new THREE.ShadowMaterial({ opacity: 0.3 })
    )
    ground.rotation.x = -Math.PI / 2
    ground.position.y = -0.02
    ground.receiveShadow = true
    scene.add(ground)

    // Red reflection disc
    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1.4, 64),
      new THREE.MeshBasicMaterial({ color: 0xcc0000, transparent: true, opacity: 0.07 })
    )
    disc.rotation.x = -Math.PI / 2
    disc.position.y = -0.015
    scene.add(disc)

    // Interaction state
    let rotY = -0.3, rotX = -0.08, velY = 0.004
    let dragging = false, lastX = 0, lastY = 0
    let carModel: THREE.Group | null = null
    let animId: number

    // Pointer events
    const onDown = (e: PointerEvent) => {
      dragging = true
      lastX = e.clientX
      lastY = e.clientY
      container.setPointerCapture(e.pointerId)
    }
    const onMove = (e: PointerEvent) => {
      if (!dragging) return
      rotY += (e.clientX - lastX) * 0.007
      rotX = Math.max(-0.45, Math.min(0.45, rotX - (e.clientY - lastY) * 0.004))
      lastX = e.clientX
      lastY = e.clientY
    }
    const onUp = () => { dragging = false; velY = 0.004 }
    container.addEventListener('pointerdown', onDown)
    container.addEventListener('pointermove', onMove)
    container.addEventListener('pointerup', onUp)
    container.addEventListener('pointerleave', onUp)

    // Animate
    function animate() {
      animId = requestAnimationFrame(animate)
      if (!dragging) rotY += velY
      if (carModel) {
        carModel.rotation.y = rotY
        carModel.rotation.x = rotX
        carModel.position.y = 0.08 + Math.sin(Date.now() * 0.0008) * 0.04
      }
      renderer.render(scene, camera)
    }
    animate()

    // Load GLB
    const loader = new GLTFLoader()
    loader.load(
      '/models/f1.glb',
      (gltf) => {
        carModel = gltf.scene

        // Auto-center and scale
        const box = new THREE.Box3().setFromObject(carModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.2 / maxDim
        carModel.scale.setScalar(scale)
        carModel.position.sub(center.multiplyScalar(scale))
        carModel.position.y += 0.08

        // Enhance materials
        carModel.traverse((child) => {
          if ((child as THREE.Mesh).isMesh) {
            const mesh = child as THREE.Mesh
            mesh.castShadow = true
            mesh.receiveShadow = true
            const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
            mats.forEach((mat) => {
              const m = mat as THREE.MeshStandardMaterial
              if (m.isMeshStandardMaterial) {
                m.metalness = Math.max(m.metalness, 0.4)
                m.roughness = Math.min(m.roughness, 0.55)
                m.needsUpdate = true
              }
            })
          }
        })

        scene.add(carModel)
        setModelReady(true)
      },
      undefined,
      (err) => {
        console.error('GLB error:', err)
        setModelReady(true)
      }
    )

    return () => {
      cancelAnimationFrame(animId)
      container.removeEventListener('pointerdown', onDown)
      container.removeEventListener('pointermove', onMove)
      container.removeEventListener('pointerup', onUp)
      container.removeEventListener('pointerleave', onUp)
      renderer.dispose()
      if (renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [])

  // Timer
  useEffect(() => {
    const start = Date.now()
    async function run() {
      try { if (preload) await preload() } catch {}
      const remaining = Math.max(0, minDuration - (Date.now() - start))
      setTimeout(() => {
        setExiting(true)
        setTimeout(onDone, 500)
      }, remaining)
    }
    run()
  }, [minDuration, onDone, preload])

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      background: '#0A0A0A',
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      transition: 'opacity 500ms ease-out',
      opacity: exiting ? 0 : 1,
      pointerEvents: exiting ? 'none' : 'auto',
      touchAction: 'none',
    }}>
      {/* Halo */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 42%, rgba(232,0,13,0.14) 0%, transparent 58%)',
      }} />

      {/* Three.js canvas */}
      <div ref={mountRef} style={{
        position: 'absolute', inset: 0,
        cursor: draggingCursor(false),
      }} />

      {/* Spinner while model loads */}
      {!modelReady && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%, -60%)',
          fontSize: 56, lineHeight: 1,
          animation: 'f1spin 2s linear infinite',
          pointerEvents: 'none',
        }}>
          🏎️
        </div>
      )}

      {/* Brand */}
      <div style={{
        position: 'absolute', bottom: 40, zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 22, fontWeight: 900, color: '#fff', letterSpacing: '-0.5px',
        }}>
          Car<span style={{ color: '#E8000D' }}>Autism</span>
        </div>
        <div style={{
          color: '#8E8E93', fontSize: 10,
          letterSpacing: '3px', textTransform: 'uppercase',
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
        }}>
          {message}
        </div>
        <div style={{ width: 80, height: 2, background: '#2C2C2E', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%', background: '#E8000D', borderRadius: 2,
            animation: 'splashbar 1.1s ease-in-out infinite',
          }} />
        </div>
      </div>

      {/* Notification */}
      {notification && !exiting && (
        <div style={{
          position: 'absolute', bottom: 128, left: 20, right: 20,
          animation: 'notifin 0.4s ease-out', zIndex: 10, pointerEvents: 'none',
        }}>
          <div style={{
            background: '#1C1C1E', border: '1px solid #2C2C2E',
            borderRadius: 12, padding: '10px 16px',
            fontSize: 12, color: 'rgba(255,255,255,0.88)', textAlign: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          }}>
            {notification}
          </div>
        </div>
      )}

      <style>{`
        @keyframes splashbar {
          0%{transform:translateX(-100%)} 50%{transform:translateX(0)} 100%{transform:translateX(100%)}
        }
        @keyframes notifin {
          from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)}
        }
        @keyframes f1spin {
          from{transform:translate(-50%,-60%) rotate(0deg)}
          to{transform:translate(-50%,-60%) rotate(360deg)}
        }
      `}</style>
    </div>
  )
}

function draggingCursor(_dragging: boolean) {
  return 'grab'
}
