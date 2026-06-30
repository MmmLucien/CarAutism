import { useEffect, useRef, useState, useCallback } from 'react'

interface SplashScreenProps {
  onDone: () => void
  minDuration?: number
  preload?: () => Promise<void>
}

const LOADING_MESSAGES = [
  'Mise en grille…',
  'Vérification des pneus…',
  'Chauffe moteur…',
  'Calage de la stratégie…',
  'Ouverture des stands…',
]

export function SplashScreen({ onDone, minDuration = 5000, preload }: SplashScreenProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const [exiting, setExiting] = useState(false)
  const [message, setMessage] = useState(LOADING_MESSAGES[0])
  const [notification, setNotification] = useState<string | null>(null)
  const [modelLoaded, setModelLoaded] = useState(false)

  // Cycle messages
  useEffect(() => {
    let i = 0
    const id = setInterval(() => {
      i = (i + 1) % LOADING_MESSAGES.length
      setMessage(LOADING_MESSAGES[i])
    }, 900)
    return () => clearInterval(id)
  }, [])

  // Notification préchargée
  useEffect(() => {
    const t = setTimeout(() => {
      setNotification('🏁 Le Mans Classic 2026 — 120 questions disponibles')
    }, 1200)
    return () => clearTimeout(t)
  }, [])

  // Three.js scene
  useEffect(() => {
    if (!mountRef.current) return
    const container = mountRef.current
    let animId: number
    let renderer: any, scene: any, camera: any, carModel: any
    let rotY = -0.3, velY = 0.004
    let dragging = false, lastX = 0, lastY = 0, rotX = -0.08

    async function init() {
      // Load Three.js dynamically
      const THREE = await import('https://unpkg.com/three@0.157.0/build/three.module.js' as any)
      const { GLTFLoader } = await import('https://unpkg.com/three@0.157.0/examples/jsm/loaders/GLTFLoader.js' as any)

      const W = container.offsetWidth
      const H = container.offsetHeight

      // Renderer
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true })
      renderer.setSize(W, H)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap
      renderer.toneMapping = THREE.ACESFilmicToneMapping
      renderer.toneMappingExposure = 1.4
      renderer.outputColorSpace = THREE.SRGBColorSpace
      renderer.domElement.style.position = 'absolute'
      renderer.domElement.style.inset = '0'
      container.appendChild(renderer.domElement)

      // Scene
      scene = new THREE.Scene()

      // Camera
      camera = new THREE.PerspectiveCamera(40, W / H, 0.01, 100)
      camera.position.set(0, 1.2, 4.5)
      camera.lookAt(0, 0.2, 0)

      // Lights — cinematic setup
      const ambient = new THREE.AmbientLight(0x111122, 1.5)
      scene.add(ambient)

      // Key light — warm top right
      const key = new THREE.DirectionalLight(0xffeedd, 4)
      key.position.set(3, 5, 4)
      key.castShadow = true
      key.shadow.mapSize.width = 2048
      key.shadow.mapSize.height = 2048
      key.shadow.camera.near = 0.1
      key.shadow.camera.far = 20
      key.shadow.camera.left = -3
      key.shadow.camera.right = 3
      key.shadow.camera.top = 3
      key.shadow.camera.bottom = -3
      scene.add(key)

      // Fill — cool blue left
      const fill = new THREE.DirectionalLight(0x4466ff, 1.2)
      fill.position.set(-4, 2, 2)
      scene.add(fill)

      // Rim — red brand color from behind
      const rim = new THREE.DirectionalLight(0xff1100, 2.0)
      rim.position.set(0, 0.5, -4)
      scene.add(rim)

      // Under glow — subtle red
      const under = new THREE.PointLight(0xcc0000, 1.5, 3)
      under.position.set(0, -0.5, 0)
      scene.add(under)

      // Top fill
      const top = new THREE.DirectionalLight(0xffffff, 0.8)
      top.position.set(0, 8, 0)
      scene.add(top)

      // Ground plane (receives shadow)
      const groundGeo = new THREE.PlaneGeometry(10, 10)
      const groundMat = new THREE.ShadowMaterial({ opacity: 0.35 })
      const ground = new THREE.Mesh(groundGeo, groundMat)
      ground.rotation.x = -Math.PI / 2
      ground.position.y = -0.01
      ground.receiveShadow = true
      scene.add(ground)

      // Reflection disc
      const discGeo = new THREE.CircleGeometry(1.2, 64)
      const discMat = new THREE.MeshBasicMaterial({
        color: 0xcc0000, transparent: true, opacity: 0.06
      })
      const disc = new THREE.Mesh(discGeo, discMat)
      disc.rotation.x = -Math.PI / 2
      disc.position.y = -0.005
      scene.add(disc)

      // Load GLB
      const loader = new GLTFLoader()
      loader.load('/models/f1.glb', (gltf: any) => {
        carModel = gltf.scene

        // Compute bounding box to center and scale model
        const box = new THREE.Box3().setFromObject(carModel)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)
        const scale = 2.0 / maxDim
        carModel.scale.setScalar(scale)
        carModel.position.sub(center.multiplyScalar(scale))
        carModel.position.y += 0.1

        // Apply CarAutism red livery to all meshes
        carModel.traverse((child: any) => {
          if (child.isMesh) {
            child.castShadow = true
            child.receiveShadow = true
            // Tint the existing material red without destroying textures
            if (child.material) {
              const mats = Array.isArray(child.material) ? child.material : [child.material]
              mats.forEach((mat: any) => {
                if (mat.isMeshStandardMaterial || mat.isMeshPhysicalMaterial) {
                  // Keep texture but boost metalness/roughness for cinematic look
                  mat.metalness = Math.max(mat.metalness ?? 0, 0.3)
                  mat.roughness = Math.min(mat.roughness ?? 0.5, 0.6)
                  mat.envMapIntensity = 1.5
                }
              })
            }
          }
        })

        scene.add(carModel)
        setModelLoaded(true)
      }, undefined, (err: any) => {
        console.error('GLB load error:', err)
        setModelLoaded(true) // continue even if model fails
      })

      // Interaction
      const el = container
      const onDown = (e: PointerEvent) => {
        dragging = true
        lastX = e.clientX
        lastY = e.clientY
        el.setPointerCapture(e.pointerId)
      }
      const onMove = (e: PointerEvent) => {
        if (!dragging) return
        rotY += (e.clientX - lastX) * 0.007
        rotX = Math.max(-0.4, Math.min(0.4, rotX - (e.clientY - lastY) * 0.004))
        lastX = e.clientX
        lastY = e.clientY
      }
      const onUp = () => { dragging = false; velY = 0.004 }
      el.addEventListener('pointerdown', onDown)
      el.addEventListener('pointermove', onMove)
      el.addEventListener('pointerup', onUp)
      el.addEventListener('pointerleave', onUp)

      // Animate
      function animate() {
        animId = requestAnimationFrame(animate)
        if (!dragging) {
          rotY += velY
        }
        if (carModel) {
          carModel.rotation.y = rotY
          carModel.rotation.x = rotX
          carModel.position.y = 0.1 + Math.sin(Date.now() * 0.0008) * 0.05
        }
        renderer.render(scene, camera)
      }
      animate()
    }

    init().catch(console.error)

    return () => {
      cancelAnimationFrame(animId)
      if (renderer) {
        renderer.dispose()
        if (renderer.domElement.parentNode === container) {
          container.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  // Exit after minDuration + preload
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
    <div
      style={{
        position: 'fixed', inset: 0, zIndex: 100,
        background: '#0A0A0A',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        transition: 'opacity 500ms ease-out',
        opacity: exiting ? 0 : 1,
        pointerEvents: exiting ? 'none' : 'auto',
        touchAction: 'none',
      }}
    >
      {/* Halo */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none',
        background: 'radial-gradient(ellipse at 50% 42%, rgba(232,0,13,0.13) 0%, transparent 58%)',
      }} />

      {/* Three.js canvas mount */}
      <div
        ref={mountRef}
        style={{
          position: 'absolute', inset: 0,
          cursor: 'grab',
        }}
      />

      {/* Loading indicator — shown while model loading */}
      {!modelLoaded && (
        <div style={{
          position: 'absolute', top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          fontSize: 40, animation: 'spin 1s linear infinite',
        }}>
          🏎️
        </div>
      )}

      {/* Brand + message */}
      <div style={{
        position: 'absolute', bottom: 36,
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10,
        zIndex: 10, pointerEvents: 'none',
      }}>
        <div style={{
          fontFamily: '-apple-system, BlinkMacSystemFont, sans-serif',
          fontSize: 22, fontWeight: 900, letterSpacing: '-0.5px', color: '#fff',
        }}>
          Car<span style={{ color: '#E8000D' }}>Autism</span>
        </div>
        <div style={{
          color: '#8E8E93', fontSize: 10, letterSpacing: '3px',
          textTransform: 'uppercase' as const,
        }}>
          {message}
        </div>
        {/* Progress bar */}
        <div style={{
          width: 80, height: 2, background: '#2C2C2E',
          borderRadius: 2, overflow: 'hidden',
        }}>
          <div style={{
            height: '100%', background: '#E8000D', borderRadius: 2,
            animation: 'splashbar 1.1s ease-in-out infinite',
          }} />
        </div>
      </div>

      {/* Notification */}
      {notification && !exiting && (
        <div style={{
          position: 'absolute', bottom: 120, left: 20, right: 20,
          animation: 'notifin 0.4s ease-out',
          zIndex: 10, pointerEvents: 'none',
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
          0% { transform: translateX(-100%); }
          50% { transform: translateX(0%); }
          100% { transform: translateX(100%); }
        }
        @keyframes notifin {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes spin {
          from { transform: translate(-50%,-50%) rotate(0deg); }
          to { transform: translate(-50%,-50%) rotate(360deg); }
        }
      `}</style>
    </div>
  )
}
