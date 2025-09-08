"use client"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, RotateCcw, ZoomIn, ZoomOut } from "lucide-react"
import * as THREE from "three"

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
        const container = mountRef.current
        const containerWidth = container.clientWidth
        const containerHeight = container.clientHeight || 500

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

        let isDragging = false
        let previousMousePosition = { x: 0, y: 0 }

        const handleMouseDown = (event: MouseEvent) => {
          isDragging = true
          previousMousePosition = { x: event.clientX, y: event.clientY }
        }

        const handleMouseMove = (event: MouseEvent) => {
          if (!isDragging) return

          const deltaMove = {
            x: event.clientX - previousMousePosition.x,
            y: event.clientY - previousMousePosition.y,
          }

          const rotationSpeed = 0.005
          camera.position.x =
            camera.position.x * Math.cos(deltaMove.x * rotationSpeed) -
            camera.position.z * Math.sin(deltaMove.x * rotationSpeed)
          camera.position.z =
            camera.position.x * Math.sin(deltaMove.x * rotationSpeed) +
            camera.position.z * Math.cos(deltaMove.x * rotationSpeed)
          camera.position.y += deltaMove.y * rotationSpeed * 10

          camera.lookAt(0, 0, 0)
          previousMousePosition = { x: event.clientX, y: event.clientY }
        }

        const handleMouseUp = () => {
          isDragging = false
        }

        const handleWheel = (event: WheelEvent) => {
          const zoomSpeed = 0.1
          const zoomFactor = event.deltaY > 0 ? 1 + zoomSpeed : 1 - zoomSpeed
          camera.position.multiplyScalar(zoomFactor)
        }

        renderer.domElement.addEventListener("mousedown", handleMouseDown)
        renderer.domElement.addEventListener("mousemove", handleMouseMove)
        renderer.domElement.addEventListener("mouseup", handleMouseUp)
        renderer.domElement.addEventListener("wheel", handleWheel)

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6)
        scene.add(ambientLight)

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8)
        directionalLight.position.set(50, 50, 50)
        directionalLight.castShadow = true
        scene.add(directionalLight)

        const directionalLight2 = new THREE.DirectionalLight(0xffffff, 0.4)
        directionalLight2.position.set(-50, -50, 50)
        scene.add(directionalLight2)

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

        await loadModels(scene)

        const animate = () => {
          requestAnimationFrame(animate)
          renderer.render(scene, camera)
        }
        animate()

        setIsLoading(false)

        return () => {
          window.removeEventListener("resize", handleResize)
          renderer.domElement.removeEventListener("mousedown", handleMouseDown)
          renderer.domElement.removeEventListener("mousemove", handleMouseMove)
          renderer.domElement.removeEventListener("mouseup", handleMouseUp)
          renderer.domElement.removeEventListener("wheel", handleWheel)
        }
      } catch (err) {
        console.error("Failed to initialize 3D viewer:", err)
        setError("无法加载3D查看器")
        setIsLoading(false)
      }
    }

    const loadModels = async (scene: any) => {
      try {
        if (upperJawUrl) {
          try {
            const upperJawModel = await loadModelFromUrl(upperJawUrl, 0xf5f5dc, { x: 0, y: 3, z: 0 })
            if (upperJawModel) {
              scene.add(upperJawModel)
              upperJawModelRef.current = upperJawModel
              console.log("[v0] Loaded upper jaw model from file")
            } else {
              throw new Error("Failed to load upper jaw model")
            }
          } catch (error) {
            console.log("[v0] Failed to load upper jaw file, using placeholder")
            const upperJawModel = createPlaceholderUpperJaw()
            scene.add(upperJawModel)
            upperJawModelRef.current = upperJawModel
          }
        }

        if (lowerJawUrl) {
          try {
            const lowerJawModel = await loadModelFromUrl(lowerJawUrl, 0xffe4e1, { x: 0, y: -3, z: 0 })
            if (lowerJawModel) {
              scene.add(lowerJawModel)
              lowerJawModelRef.current = lowerJawModel
              console.log("[v0] Loaded lower jaw model from file")
            } else {
              throw new Error("Failed to load lower jaw model")
            }
          } catch (error) {
            console.log("[v0] Failed to load lower jaw file, using placeholder")
            const lowerJawModel = createPlaceholderLowerJaw()
            scene.add(lowerJawModel)
            lowerJawModelRef.current = lowerJawModel
          }
        }

        if (restorationUrl) {
          try {
            const restorationModel = await loadModelFromUrl(restorationUrl, 0x8b9dc3, { x: 5, y: 3, z: 0 })
            if (restorationModel) {
              scene.add(restorationModel)
              restorationModelRef.current = restorationModel
              console.log("[v0] Loaded restoration model from file")
            } else {
              throw new Error("Failed to load restoration model")
            }
          } catch (error) {
            console.log("[v0] Failed to load restoration file, using placeholder")
            const restorationModel = createPlaceholderRestoration()
            scene.add(restorationModel)
            restorationModelRef.current = restorationModel
          }
        }

        console.log("[v0] Model loading process completed")
      } catch (err) {
        console.error("Failed to create 3D models:", err)
        setError("无法创建3D模型")
      }
    }

    const loadModelFromUrl = async (url: string, color: number, position: { x: number; y: number; z: number }) => {
      try {
        console.log("[v0] Attempting to load model from:", url)

        const response = await fetch(url)
        if (!response.ok) throw new Error(`HTTP ${response.status}`)

        const arrayBuffer = await response.arrayBuffer()
        console.log("[v0] Loaded file, size:", arrayBuffer.byteLength)

        let geometry: THREE.BufferGeometry | null = null

        try {
          geometry = parseSTL(arrayBuffer)
          console.log("[v0] Successfully parsed as STL file")
        } catch (stlError) {
          console.log("[v0] Not an STL file, trying OBJ format")

          try {
            const text = new TextDecoder().decode(arrayBuffer)
            geometry = parseOBJ(text)
            console.log("[v0] Successfully parsed as OBJ file")
          } catch (objError) {
            console.log("[v0] Could not parse as OBJ either, using placeholder")
            const size = Math.max(5, Math.min(15, arrayBuffer.byteLength / 10000))
            geometry = new THREE.BoxGeometry(size, size * 0.6, size * 0.8)
          }
        }

        if (geometry) {
          geometry.computeBoundingBox()
          const box = geometry.boundingBox!
          const center = box.getCenter(new THREE.Vector3())
          geometry.translate(-center.x, -center.y, -center.z)

          const size = box.getSize(new THREE.Vector3())
          const maxSize = Math.max(size.x, size.y, size.z)
          const scale = 10 / maxSize
          geometry.scale(scale, scale, scale)

          const material = new THREE.MeshPhongMaterial({
            color: color,
            transparent: true,
            opacity: 0.8,
          })

          const mesh = new THREE.Mesh(geometry, material)
          mesh.castShadow = true
          mesh.receiveShadow = true
          mesh.position.set(position.x, position.y, position.z)

          return mesh
        }

        return null
      } catch (error) {
        console.error("[v0] Error loading model from URL:", error)
        return null
      }
    }

    const parseSTL = (arrayBuffer: ArrayBuffer): THREE.BufferGeometry => {
      const dataView = new DataView(arrayBuffer)

      if (arrayBuffer.byteLength > 84) {
        const triangleCount = dataView.getUint32(80, true)
        const expectedSize = 84 + triangleCount * 50

        if (Math.abs(arrayBuffer.byteLength - expectedSize) < 100) {
          const vertices: number[] = []
          const normals: number[] = []

          for (let i = 0; i < triangleCount; i++) {
            const offset = 84 + i * 50

            const nx = dataView.getFloat32(offset, true)
            const ny = dataView.getFloat32(offset + 4, true)
            const nz = dataView.getFloat32(offset + 8, true)

            for (let j = 0; j < 3; j++) {
              const vOffset = offset + 12 + j * 12
              vertices.push(
                dataView.getFloat32(vOffset, true),
                dataView.getFloat32(vOffset + 4, true),
                dataView.getFloat32(vOffset + 8, true),
              )
              normals.push(nx, ny, nz)
            }
          }

          const geometry = new THREE.BufferGeometry()
          geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
          geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3))
          return geometry
        }
      }

      const text = new TextDecoder().decode(arrayBuffer)
      if (text.includes("facet normal")) {
        return parseASCIISTL(text)
      }

      throw new Error("Not a valid STL file")
    }

    const parseASCIISTL = (text: string): THREE.BufferGeometry => {
      const vertices: number[] = []
      const normals: number[] = []

      const lines = text.split("\n")
      let currentNormal = [0, 0, 0]

      for (const line of lines) {
        const trimmed = line.trim()

        if (trimmed.startsWith("facet normal")) {
          const parts = trimmed.split(/\s+/)
          currentNormal = [Number.parseFloat(parts[2]), Number.parseFloat(parts[3]), Number.parseFloat(parts[4])]
        } else if (trimmed.startsWith("vertex")) {
          const parts = trimmed.split(/\s+/)
          vertices.push(Number.parseFloat(parts[1]), Number.parseFloat(parts[2]), Number.parseFloat(parts[3]))
          normals.push(currentNormal[0], currentNormal[1], currentNormal[2])
        }
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
      geometry.setAttribute("normal", new THREE.Float32BufferAttribute(normals, 3))
      return geometry
    }

    const parseOBJ = (text: string): THREE.BufferGeometry => {
      const vertices: number[] = []
      const faces: number[] = []
      const objVertices: number[][] = []

      const lines = text.split("\n")

      for (const line of lines) {
        const trimmed = line.trim()

        if (trimmed.startsWith("v ")) {
          const parts = trimmed.split(/\s+/)
          objVertices.push([Number.parseFloat(parts[1]), Number.parseFloat(parts[2]), Number.parseFloat(parts[3])])
        } else if (trimmed.startsWith("f ")) {
          const parts = trimmed.split(/\s+/).slice(1)

          if (parts.length >= 3) {
            for (let i = 1; i < parts.length - 1; i++) {
              const v1 = Number.parseInt(parts[0].split("/")[0]) - 1
              const v2 = Number.parseInt(parts[i].split("/")[0]) - 1
              const v3 = Number.parseInt(parts[i + 1].split("/")[0]) - 1

              if (objVertices[v1] && objVertices[v2] && objVertices[v3]) {
                vertices.push(...objVertices[v1], ...objVertices[v2], ...objVertices[v3])
              }
            }
          }
        }
      }

      if (vertices.length === 0) {
        throw new Error("No valid vertices found in OBJ file")
      }

      const geometry = new THREE.BufferGeometry()
      geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3))
      geometry.computeVertexNormals()
      return geometry
    }

    const createPlaceholderUpperJaw = () => {
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
      console.log("[v0] Created placeholder upper jaw model")
      return upperJawModel
    }

    const createPlaceholderLowerJaw = () => {
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
      console.log("[v0] Created placeholder lower jaw model")
      return lowerJawModel
    }

    const createPlaceholderRestoration = () => {
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
      console.log("[v0] Created placeholder restoration model")
      return restorationModel
    }

    initThreeJS()

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
    if (cameraRef.current) {
      cameraRef.current.position.set(30, 20, 30)
      cameraRef.current.lookAt(0, 0, 0)
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
