"use client"

import type React from "react"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { ToothPositionSelector } from "@/components/tooth-position-selector"
import { Upload, Loader2, CheckCircle } from "lucide-react"
import { MockAnalysisService, AnalysisStorageService } from "@/lib/mock-api"
import type { UploadedFile } from "@/lib/types"

export default function UploadPage() {
  const router = useRouter()
  const [upperJawFile, setUpperJawFile] = useState<UploadedFile | null>(null)
  const [lowerJawFile, setLowerJawFile] = useState<UploadedFile | null>(null)
  const [restorationFile, setRestorationFile] = useState<UploadedFile | null>(null)
  const [selectedToothPosition, setSelectedToothPosition] = useState<string | null>(null)
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

  const availableJaws = {
    upper: !!upperJawFile,
    lower: !!lowerJawFile,
  }

  const isReadyToAnalyze = upperJawFile && lowerJawFile && restorationFile && selectedToothPosition && !isAnalyzing

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8 sm:py-12">
        <div className="max-w-6xl mx-auto space-y-12">
          <div className="text-center space-y-4">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-balance text-foreground">
              AI驱动的口腔修复体分析系统
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto text-pretty leading-relaxed">
              上传上下颌及修复体模型获得AI驱动的专业分析和评分
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-lg p-8 border border-black/20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">颌骨模型上传</h2>
                <p className="text-muted-foreground">上传上颌和下颌模型以开始分析流程</p>
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
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
            </div>

            <div className="bg-white rounded-lg p-8 border border-black/20">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-primary mb-2">牙齿位置选择与修复体上传</h2>
                <p className="text-muted-foreground">
                  {upperJawFile || lowerJawFile
                    ? "点击选择需要修复的牙齿位置，然后上传对应的修复体模型"
                    : "请先上传颌骨模型以启用牙齿位置选择"}
                </p>
              </div>

              <div className="space-y-8">
                <div
                  className={`transition-all duration-300 ${!(upperJawFile || lowerJawFile) ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <ToothPositionSelector
                    selectedPosition={selectedToothPosition}
                    onPositionSelect={setSelectedToothPosition}
                    availableJaws={availableJaws}
                  />
                </div>

                <div
                  className={`transition-all duration-300 ${!selectedToothPosition ? "opacity-50 pointer-events-none" : ""}`}
                >
                  <div className="max-w-2xl mx-auto">
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-semibold text-primary mb-2">修复体模型</h3>
                      <p className="text-muted-foreground">
                        {selectedToothPosition ? `上传牙齿 ${selectedToothPosition} 的修复体模型` : "请先选择牙齿位置"}
                      </p>
                    </div>
                    <UploadZone
                      title="修复体模型"
                      description={
                        selectedToothPosition ? `牙齿 ${selectedToothPosition} 的修复体` : "请先选择牙齿位置"
                      }
                      file={restorationFile}
                      onFileUpload={(file) => handleFileUpload(file, "restoration")}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center">
              <Button
                size="lg"
                onClick={handleAnalyze}
                disabled={!isReadyToAnalyze}
                className="px-12 py-4 text-lg font-bold bg-primary hover:bg-primary/90 transform hover:scale-105 transition-all duration-200 shadow-lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                    AI分析中...
                  </>
                ) : (
                  "开始AI分析"
                )}
              </Button>

              {/* Progress indicator */}
              <div className="mt-6 flex justify-center">
                <div className="flex items-center space-x-4 text-sm">
                  <div
                    className={`flex items-center space-x-2 ${upperJawFile && lowerJawFile ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${upperJawFile && lowerJawFile ? "bg-green-600" : "bg-muted"}`}
                    />
                    <span>颌骨模型</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${selectedToothPosition ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${selectedToothPosition ? "bg-green-600" : "bg-muted"}`} />
                    <span>牙齿位置</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${restorationFile ? "text-green-600" : "text-muted-foreground"}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${restorationFile ? "bg-green-600" : "bg-muted"}`} />
                    <span>修复体模型</span>
                  </div>
                </div>
              </div>
            </div>

            {/* File format info */}
            <div className="text-center space-y-2 pt-4 border-t border-border/30">
              <p className="text-sm text-muted-foreground">支持格式：.OBJ（.STL以及.DCM格式的支持正在开发中）</p>
              <p className="text-xs text-muted-foreground">AI分析通常需要2-3秒完成</p>
            </div>
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
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      setTimeout(() => {
        const label = document.querySelector(`label[for="${inputId}"]`) as HTMLLabelElement
        if (label) {
          label.click()
        }
      }, 10)
    }
  }

  const inputId = `file-input-${title.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <div className="bg-white rounded-lg p-6 border border-black/15">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-primary mb-1">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </div>

      <div
        className={`rounded-lg p-6 text-center transition-all duration-300 ${
          isDragOver
            ? "bg-blue-50 border-2 border-blue-300"
            : file
              ? "bg-green-50 border border-green-300"
              : "bg-gray-50 border border-dashed border-gray-300"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {file ? (
          <div className="space-y-3">
            <CheckCircle className="h-12 w-12 mx-auto text-green-600" />
            <div>
              <p className="font-semibold text-green-800">{file.file.name}</p>
              <p className="text-sm text-green-600">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReplaceClick}
              className="border-green-300 text-green-700 hover:bg-green-100 bg-white/80"
            >
              替换文件
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload
              className={`h-12 w-12 mx-auto transition-all duration-300 ${
                isDragOver ? "text-blue-600 scale-110" : "text-slate-400"
              }`}
            />
            <div className="space-y-2">
              <p className="font-medium text-slate-700">{isDragOver ? "将文件拖放到此处" : "拖放您的3D模型"}</p>
              <p className="text-sm text-slate-500">或点击选择文件</p>
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
              className="transition-all hover:scale-105 border-blue-200 text-blue-700 hover:bg-blue-50 font-medium bg-white/80"
              asChild
            >
              <label htmlFor={inputId} className="cursor-pointer">
                选择文件
              </label>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
