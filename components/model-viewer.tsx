"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"

interface ModelViewerProps {
  upperJawUrl?: string
  lowerJawUrl?: string
  restorationUrl?: string
  className?: string
}

export function ModelViewer({ upperJawUrl, lowerJawUrl, restorationUrl, className }: ModelViewerProps) {
  const mountRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)
  const rendererRef = useRef<any>(null)
  const cameraRef = useRef<any>(null)
  const controlsRef = useRef<any>(null)
  const upperJawModelRef = useRef<any>(null)
  const lowerJawModelRef = useRef<any>(null)
  const restorationModelRef = useRef<any>(null)

  const [showUpperJaw, setShowUpperJaw] = useState(true)
  const [showLowerJaw, setShowLowerJaw] = useState(true)
  const [showRestoration, setShowRestoration] = useState(true)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mountRef.current) return

    const initThreeJS = async () => {
      try {
        // Dynamic import of Three.js to avoid SSR issues
        const THREE = await import("three")
        const { OrbitControls } = await import("three/examples/jsm/controls/OrbitControls.js")
        const { STLLoader } = await import("three/examples/jsm/loaders/STLLoader.js")
        const { OBJLoader } = await import("three/examples/jsm/loaders/OBJLoader.js")

        const container = mountRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight || 500

        // Scene setup
        const scene = new THREE.Scene()
        scene.background = new THREE.Color(0xf8f9fa)
        sceneRef.current = scene

        const camera = new THREE.PerspectiveCamera(75, containerWidth / containerHeight, 0.1, 1000)
        camera.position.set(30, 20, 30)
        camera.lookAt(0, 0, 0)
        cameraRef.current = camera

        const renderer = new THREE.WebGLRenderer({ antialias: true })
        renderer.setSize(containerWidth, containerHeight)
        renderer.setPixelRatio(window.devicePixelRatio)
        renderer.shadowMap.enabled = true
        renderer.shadowMap.type = THREE.PCFSoftShadowMap
        rendererRef.current = renderer

        const controls = new OrbitControls(camera, renderer.domElement)
        controls.enableDamping = true
        controls.dampingFactor = 0.05
        controls.enableZoom = true
        controls.enablePan = true
        controls.target.set(0, 0, 0)
        controls.minDistance = 10
        controls.maxDistance = 100
        controlsRef.current = controls

        // Lighting setup
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(50, 50, 50)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
        directionalLight2.position.set(-50, -50, 50)
        scene.add(directionalLight2)

        // Mount renderer
        mountRef.current.appendChild(renderer.domElement)

        const handleResize = () => {
          if (!mountRef.current) return
          const newWidth = mountRef.current.clientWidth
          const newHeight = mountRef.current.clientHeight || 500

          camera.aspect = newWidth / newHeight
          camera.updateProjectionMatrix()
          renderer.setSize(newWidth, newHeight)
        }

        window.addEventListener("resize", handleResize)

        // Load models
        await loadModels(THREE, STLLoader, OBJLoader, scene)

        // Animation loop
        const animate = () => {
          requestAnimationFrame(animate)
          controls.update()
          renderer.render(scene, camera)
        }
        animate()

        setIsLoading(false)

        return () => {
          window.removeEventListener("resize", handleResize)
        }
      } catch (err) {
        console.error("Failed to initialize 3D viewer:", err)
        setError("无法加载3D查看器")
        setIsLoading(false)
      }
    }

    const loadModels = async (THREE: any, STLLoader: any, OBJLoader: any, scene: any) => {
      try {
        const stlLoader = new STLLoader()
        const objLoader = new OBJLoader()

        // Load upper jaw model
        if (upperJawUrl) {
          try {
            const geometry = upperJawUrl.endsWith(".stl")
              ? await new Promise((resolve, reject) => {
                  stlLoader.load(upperJawUrl, resolve, undefined, reject)
                })
              : await new Promise((resolve, reject) => {
                  objLoader.load(
                    upperJawUrl,
                    (obj) => {
                      resolve(obj.children[0].geometry)
                    },
                    undefined,
                    reject,
                  )
                })

            const upperJawMaterial = new THREE.MeshPhongMaterial({
              color: 0xf5f5dc, // Beige color for upper jaw
              transparent: true,
              opacity: 0.8,
            })
            const upperJawModel = new THREE.Mesh(geometry, upperJawMaterial)
            upperJawModel.castShadow = true
            upperJawModel.receiveShadow = true
            upperJawModel.position.set(0, 0, 0)
            scene.add(upperJawModel)
            upperJawModelRef.current = upperJawModel
            console.log("[v0] Successfully loaded upper jaw model from:", upperJawUrl)
          } catch (error) {
            console.error("[v0] Failed to load upper jaw model:", error)
            const upperJawGeometry = new THREE.BoxGeometry(20, 6, 12)
            const vertices = upperJawGeometry.attributes.position.array
            for (let i = 0; i < vertices.length; i += 3) {
              const x = vertices[i]
              vertices[i + 1] += Math.sin(Math.abs(x) * 0.1) * 1.5
            }
            upperJawGeometry.attributes.position.needsUpdate = true
            upperJawGeometry.computeVertexNormals()

            const upperJawMaterial = new THREE.MeshPhongMaterial({
              color: 0xf5f5dc,
              transparent: true,
              opacity: 0.8,
            })
            const upperJawModel = new THREE.Mesh(upperJawGeometry, upperJawMaterial)
            upperJawModel.castShadow = true
            upperJawModel.receiveShadow = true
            upperJawModel.position.set(0, 0, 0)
            scene.add(upperJawModel)
            upperJawModelRef.current = upperJawModel
            console.log("[v0] Created placeholder upper jaw model")
          }
        }

        // Load lower jaw model
        if (lowerJawUrl) {
          try {
            const geometry = lowerJawUrl.endsWith(".stl")
              ? await new Promise((resolve, reject) => {
                  stlLoader.load(lowerJawUrl, resolve, undefined, reject)
                })
              : await new Promise((resolve, reject) => {
                  objLoader.load(
                    lowerJawUrl,
                    (obj) => {
                      resolve(obj.children[0].geometry)
                    },
                    undefined,
                    reject,
                  )
                })

            const lowerJawMaterial = new THREE.MeshPhongMaterial({
              color: 0xffe4e1, // Light pink color for lower jaw
              transparent: true,
              opacity: 0.8,
            })
            const lowerJawModel = new THREE.Mesh(geometry, lowerJawMaterial)
            lowerJawModel.castShadow = true
            lowerJawModel.receiveShadow = true
            lowerJawModel.position.set(0, 0, 0)
            scene.add(lowerJawModel)
            lowerJawModelRef.current = lowerJawModel
            console.log("[v0] Successfully loaded lower jaw model from:", lowerJawUrl)
          } catch (error) {
            console.error("[v0] Failed to load lower jaw model:", error)
            const lowerJawGeometry = new THREE.BoxGeometry(18, 6, 11)
            const vertices = lowerJawGeometry.attributes.position.array
            for (let i = 0; i < vertices.length; i += 3) {
              const x = vertices[i]
              vertices[i + 1] -= Math.sin(Math.abs(x) * 0.1) * 1.2
            }
            lowerJawGeometry.attributes.position.needsUpdate = true
            lowerJawGeometry.computeVertexNormals()

            const lowerJawMaterial = new THREE.MeshPhongMaterial({
              color: 0xffe4e1,
              transparent: true,
              opacity: 0.8,
            })
            const lowerJawModel = new THREE.Mesh(lowerJawGeometry, lowerJawMaterial)
            lowerJawModel.castShadow = true
            lowerJawModel.receiveShadow = true
            lowerJawModel.position.set(0, 0, 0)
            scene.add(lowerJawModel)
            lowerJawModelRef.current = lowerJawModel
            console.log("[v0] Created placeholder lower jaw model")
          }
        }

        // Load restoration model
        if (restorationUrl) {
          try {
            const geometry = restorationUrl.endsWith(".stl")
              ? await new Promise((resolve, reject) => {
                  stlLoader.load(restorationUrl, resolve, undefined, reject)
                })
              : await new Promise((resolve, reject) => {
                  objLoader.load(
                    restorationUrl,
                    (obj) => {
                      resolve(obj.children[0].geometry)
                    },
                    undefined,
                    reject,
                  )
                })

            const restorationMaterial = new THREE.MeshPhongMaterial({
              color: 0x8b9dc3, // Blue color for restoration
              transparent: true,
              opacity: 0.9,
            })
            const restorationModel = new THREE.Mesh(geometry, restorationMaterial)
            restorationModel.castShadow = true
            restorationModel.receiveShadow = true
            restorationModel.position.set(0, 0, 0) // Position on upper jaw
            scene.add(restorationModel)
            restorationModelRef.current = restorationModel
            console.log("[v0] Successfully loaded restoration model from:", restorationUrl)
          } catch (error) {
            console.error("[v0] Failed to load restoration model:", error)
            const restorationGeometry = new THREE.CylinderGeometry(2, 3, 6, 8)
            const vertices = restorationGeometry.attributes.position.array
            for (let i = 0; i < vertices.length; i += 3) {
              vertices[i] += (Math.random() - 0.5) * 0.8
              vertices[i + 1] += (Math.random() - 0.5) * 0.4
              vertices[i + 2] += (Math.random() - 0.5) * 0.8
            }
            restorationGeometry.attributes.position.needsUpdate = true
            restorationGeometry.computeVertexNormals()

            const restorationMaterial = new THREE.MeshPhongMaterial({
              color: 0x8b9dc3,
              transparent: true,
              opacity: 0.9,
            })
            const restorationModel = new THREE.Mesh(restorationGeometry, restorationMaterial)
            restorationModel.castShadow = true
            restorationModel.receiveShadow = true
            restorationModel.position.set(0, 0, 0)
            scene.add(restorationModel)
            restorationModelRef.current = restorationModel
            console.log("[v0] Created placeholder restoration model")
          }
        }

        console.log("[v0] Model loading process completed")
      } catch (err) {
        console.error("Failed to create 3D models:", err)
        setError("无法创建3D模型")
      }
    }

    initThreeJS()

    // Cleanup
    return () => {
      if (mountRef.current && rendererRef.current) {
        mountRef.current.removeChild(rendererRef.current.domElement)
      }
      if (rendererRef.current) {
        rendererRef.current.dispose()
      }
    }
  }, [upperJawUrl, lowerJawUrl, restorationUrl])

  useEffect(() => {
    if (upperJawModelRef.current) {
      upperJawModelRef.current.visible = showUpperJaw
    }
  }, [showUpperJaw])

  useEffect(() => {
    if (lowerJawModelRef.current) {
      lowerJawModelRef.current.visible = showLowerJaw
    }
  }, [showLowerJaw])

  useEffect(() => {
    if (restorationModelRef.current) {
      restorationModelRef.current.visible = showRestoration
    }
  }, [showRestoration])

  const handleResetView = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(30, 20, 30)
      cameraRef.current.lookAt(0, 0, 0)
      controlsRef.current.target.set(0, 0, 0)
      controlsRef.current.update()
    }
  }

  const handleZoomIn = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(0.9)
    }
  }

  const handleZoomOut = () => {
    if (cameraRef.current) {
      cameraRef.current.position.multiplyScalar(1.1)
    }
  }

  if (error) {
    return (
      <Card className={className}>
        <CardContent className="flex items-center justify-center h-96">
          <div className="text-center">
            <p className="text-destructive mb-2">无法加载3D查看器</p>
            <p className="text-sm text-muted-foreground">请检查您的浏览器兼容性</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>3D模型查看器</span>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowUpperJaw(!showUpperJaw)}
              className={showUpperJaw ? "bg-yellow-100 text-yellow-700" : ""}
            >
              {showUpperJaw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              上颌
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowLowerJaw(!showLowerJaw)}
              className={showLowerJaw ? "bg-pink-100 text-pink-700" : ""}
            >
              {showLowerJaw ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              下颌
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowRestoration(!showRestoration)}
              className={showRestoration ? "bg-blue-100 text-blue-700" : ""}
            >
              {showRestoration ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
              修复体
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <div
            ref={mountRef}
            className="w-full h-[500px] rounded-lg overflow-hidden bg-gray-50"
            style={{ minHeight: "500px" }}
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">加载3D模型中...</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="text-sm text-muted-foreground">
            <p>
              <strong>控制：</strong>左键拖拽旋转 • 右键拖拽平移 • 滚轮缩放
            </p>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-yellow-300 rounded"></div>
                <span>上颌模型</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-pink-300 rounded"></div>
                <span>下颌模型</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-300 rounded"></div>
                <span>修复体模型</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={handleZoomIn} className="bg-white shadow-sm">
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleZoomOut} className="bg-white shadow-sm">
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleResetView} className="bg-white shadow-sm">
              <RotateCcw className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
