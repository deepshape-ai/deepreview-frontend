"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ToothPositionSelector } from "@/components/tooth-position-selector"
import { Upload, Loader2, CheckCircle, ArrowRight } from "lucide-react"
import { MockAnalysisService, AnalysisStorageService } from "@/lib/mock-api"
import type { UploadedFile } from "@/lib/types"

export default function UploadPage() {
  const router = useRouter()
  const [upperJawFile, setUpperJawFile] = useState<UploadedFile | null>(null)
  const [lowerJawFile, setLowerJawFile] = useState<UploadedFile | null>(null)
  const [restorationFile, setRestorationFile] = useState<UploadedFile | null>(null)
  const [selectedToothPosition, setSelectedToothPosition] = useState<string | null>(null)
  const [currentStep, setCurrentStep] = useState<"models" | "position" | "restoration">("models")
  const [isAnalyzing, setIsAnalyzing] = useState(false)

  const handleFileUpload = (file: File, type: "upperJaw" | "lowerJaw" | "restoration") => {
    const url = URL.createObjectURL(file)
    const uploadedFile = { file, url }

    if (type === "upperJaw") {
      setUpperJawFile(uploadedFile)
    } else if (type === "lowerJaw") {
      setLowerJawFile(uploadedFile)
    } else {
      setRestorationFile(uploadedFile)
    }
  }

  const handleNextStep = () => {
    if (currentStep === "models" && upperJawFile && lowerJawFile) {
      setCurrentStep("position")
    } else if (currentStep === "position" && selectedToothPosition) {
      setCurrentStep("restoration")
    }
  }

  const handleAnalyze = async () => {
    if (!upperJawFile || !lowerJawFile || !restorationFile || !selectedToothPosition) return

    setIsAnalyzing(true)
    try {
      const result = await MockAnalysisService.analyzeModels(
        upperJawFile.file,
        lowerJawFile.file,
        restorationFile.file,
        selectedToothPosition,
      )
      AnalysisStorageService.saveAnalysis(result)
      router.push(`/analysis/${result.submissionId}`)
    } catch (error) {
      console.error("Analysis failed:", error)
    } finally {
      setIsAnalyzing(false)
    }
  }

  const canProceedToPosition = upperJawFile && lowerJawFile
  const canProceedToRestoration = selectedToothPosition
  const isReadyToAnalyze = upperJawFile && lowerJawFile && restorationFile && selectedToothPosition && !isAnalyzing

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-4 text-balance bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
              AI驱动的口腔修复体分析系统
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto text-pretty">
              上传您的牙科模型并选择牙齿位置，获得详细的评分和反馈
            </p>
          </div>

          {/* Progress Steps */}
          <div className="flex justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div
                className={`flex items-center space-x-2 ${currentStep === "models" ? "text-primary" : canProceedToPosition ? "text-green-600" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === "models" ? "bg-primary text-white" : canProceedToPosition ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}
                >
                  1
                </div>
                <span className="font-medium">上传模型</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div
                className={`flex items-center space-x-2 ${currentStep === "position" ? "text-primary" : canProceedToRestoration ? "text-green-600" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === "position" ? "bg-primary text-white" : canProceedToRestoration ? "bg-green-600 text-white" : "bg-muted text-muted-foreground"}`}
                >
                  2
                </div>
                <span className="font-medium">选择位置</span>
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground" />
              <div
                className={`flex items-center space-x-2 ${currentStep === "restoration" ? "text-primary" : "text-muted-foreground"}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${currentStep === "restoration" ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}
                >
                  3
                </div>
                <span className="font-medium">上传修复体</span>
              </div>
            </div>
          </div>

          {/* Step 1: Upload Jaw Models */}
          {currentStep === "models" && (
            <div className="space-y-8">
              <div className="grid lg:grid-cols-2 gap-6 sm:gap-8">
                <UploadZone
                  title="上颌模型"
                  description="上传上颌牙弓模型"
                  file={upperJawFile}
                  onFileUpload={(file) => handleFileUpload(file, "upperJaw")}
                />

                <UploadZone
                  title="下颌模型"
                  description="上传下颌牙弓模型"
                  file={lowerJawFile}
                  onFileUpload={(file) => handleFileUpload(file, "lowerJaw")}
                />
              </div>

              <div className="text-center">
                <Button
                  size="lg"
                  onClick={handleNextStep}
                  disabled={!canProceedToPosition}
                  className="px-8 py-3 text-lg font-semibold"
                >
                  下一步：选择牙齿位置
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Select Tooth Position */}
          {currentStep === "position" && (
            <div className="space-y-8">
              <ToothPositionSelector
                selectedPosition={selectedToothPosition}
                onPositionSelect={setSelectedToothPosition}
              />

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep("models")}>
                  返回模型
                </Button>
                <Button
                  size="lg"
                  onClick={handleNextStep}
                  disabled={!canProceedToRestoration}
                  className="px-8 py-3 text-lg font-semibold"
                >
                  下一步：上传修复体
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Upload Restoration */}
          {currentStep === "restoration" && (
            <div className="space-y-8">
              <div className="max-w-2xl mx-auto">
                <UploadZone
                  title="修复体模型"
                  description={`上传牙齿${selectedToothPosition}的牙冠修复体`}
                  file={restorationFile}
                  onFileUpload={(file) => handleFileUpload(file, "restoration")}
                />
              </div>

              <div className="flex justify-center space-x-4">
                <Button variant="outline" onClick={() => setCurrentStep("position")}>
                  返回位置
                </Button>
                <Button
                  size="lg"
                  onClick={handleAnalyze}
                  disabled={!isReadyToAnalyze}
                  className="px-8 py-3 text-lg font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      分析模型中...
                    </>
                  ) : (
                    "分析我的作品"
                  )}
                </Button>
              </div>
            </div>
          )}

          <div className="text-center mt-8 space-y-2">
            <p className="text-sm text-muted-foreground">支持格式：.OBJ</p>
            <p className="text-xs text-muted-foreground">分析通常需要2-3秒</p>
          </div>
        </div>
      </main>
    </div>
  )
}

interface UploadZoneProps {
  title: string
  description: string
  file: UploadedFile | null
  onFileUpload: (file: File) => void
}

function UploadZone({ title, description, file, onFileUpload }: UploadZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = Array.from(e.dataTransfer.files)
    const validFile = files.find(
      (f) =>
        f.name.toLowerCase().endsWith(".stl") ||
        f.name.toLowerCase().endsWith(".obj") ||
        f.name.toLowerCase().endsWith(".ply"),
    )
    if (validFile) {
      onFileUpload(validFile)
    }
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      onFileUpload(selectedFile)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleReplaceClick = () => {
    console.log("[v0] Replace button clicked")
    // Reset the file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
    // Trigger the file input by clicking the hidden label
    const label = document.querySelector(`label[for="${title.replace(/\s+/g, "-").toLowerCase()}"]`) as HTMLLabelElement
    if (label) {
      label.click()
    }
  }

  const inputId = `file-input-${title.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <Card className="transition-all duration-200 hover:shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription className="text-base">{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div
          className={`border-2 border-dashed rounded-lg p-6 sm:p-8 text-center transition-all duration-200 ${
            isDragOver
              ? "border-primary bg-primary/5"
              : file
                ? "border-green-300 bg-green-50"
                : "border-muted-foreground/25 hover:border-muted-foreground/50"
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          {file ? (
            <div className="space-y-3">
              <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
              <div>
                <p className="font-medium text-green-800">{file.file.name}</p>
                <p className="text-sm text-green-600">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
              </div>
              <Button variant="outline" size="sm" onClick={handleReplaceClick}>
                替换文件
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <Upload
                className={`h-12 w-12 mx-auto transition-colors ${isDragOver ? "text-primary" : "text-muted-foreground"}`}
              />
              <div className="space-y-2">
                <p className="font-medium">{isDragOver ? "将文件拖放到此处" : "拖放您的3D模型"}</p>
                <p className="text-sm text-muted-foreground">或点击浏览</p>
              </div>
              <input
                ref={fileInputRef}
                id={inputId}
                type="file"
                accept=".stl,.obj,.ply"
                onChange={handleFileSelect}
                className="hidden"
              />
              <Button
                variant="outline"
                className="transition-all hover:scale-105 bg-transparent cursor-pointer"
                asChild
              >
                <label htmlFor={inputId}>选择文件</label>
              </Button>
              <label htmlFor={inputId} className="hidden" />
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
