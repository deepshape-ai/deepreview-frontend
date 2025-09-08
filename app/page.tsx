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

      {/* Hero Section with Enhanced Gradient Background */}
      <div className="relative overflow-hidden">
        {/* Improved gradient background with smoother transition */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-700 via-slate-500 via-slate-300 to-gray-100"></div>
        <div className="absolute inset-0 bg-gradient-to-br from-slate-800/80 via-slate-600/60 via-slate-400/40 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-black/40 via-slate-700/20 via-slate-500/10 to-white/20"></div>
        
        {/* Grid pattern overlay similar to landing page */}
        <div className="absolute inset-0 opacity-[0.05]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='grid' width='40' height='40' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%23ffffff' stroke-width='1'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23grid)' /%3E%3C/svg%3E")`
        }}></div>
        
        {/* Additional decorative grid pattern */}
        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cdefs%3E%3Cpattern id='smallgrid' width='20' height='20' patternUnits='userSpaceOnUse'%3E%3Cpath d='M 20 0 L 0 0 0 20' fill='none' stroke='%23ffffff' stroke-width='0.5'/%3E%3C/pattern%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23smallgrid)' /%3E%3C/svg%3E")`
        }}></div>
        
        {/* Subtle animated overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-600/5 to-slate-400/10 animate-pulse" style={{
          animationDuration: '6s'
        }}></div>

        <main className="relative container mx-auto px-4 py-20 sm:py-32">
          <div className="max-w-6xl mx-auto space-y-16">
            <div className="text-center space-y-8 pt-12 pb-20">
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-bold text-balance leading-tight">
                <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                  AI驱动的口腔修复体分析系统
                </span>
              </h1>
              <div className="max-w-4xl mx-auto space-y-6">
                <p className="text-lg sm:text-xl text-gray-300 text-pretty leading-relaxed">
                  上传上下颌及修复体模型获得AI驱动的专业分析和评分
                </p>
                <div className="h-8"></div>
              </div>
            </div>
          </div>
        </main>
        
        {/* Improved bottom fade with reduced white concentration */}
        <div className="absolute bottom-0 left-0 right-0 h-80 bg-gradient-to-t from-white/95 via-white/60 via-white/30 via-white/15 via-white/5 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-white/98 via-white/40 via-white/15 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white/99 via-white/80 to-transparent"></div>
      </div>

      {/* Main Content Area - now with white background */}
      <div className="container mx-auto px-4 py-8 sm:py-12 bg-white relative z-10">
        <div className="max-w-6xl mx-auto space-y-16">

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
                    className={`flex items-center space-x-2 ${upperJawFile && lowerJawFile ? "text-emerald-700" : "text-muted-foreground"}`}
                  >
                    <div
                      className={`w-3 h-3 rounded-full ${upperJawFile && lowerJawFile ? "bg-emerald-500 shadow-sm" : "bg-muted"}`}
                    />
                    <span>颌骨模型</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${selectedToothPosition ? "text-emerald-700" : "text-muted-foreground"}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${selectedToothPosition ? "bg-emerald-500 shadow-sm" : "bg-muted"}`} />
                    <span>牙齿位置</span>
                  </div>
                  <div
                    className={`flex items-center space-x-2 ${restorationFile ? "text-emerald-700" : "text-muted-foreground"}`}
                  >
                    <div className={`w-3 h-3 rounded-full ${restorationFile ? "bg-emerald-500 shadow-sm" : "bg-muted"}`} />
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
      </div>
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
    console.log("[v0] fileInputRef.current:", fileInputRef.current)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
      fileInputRef.current.click()
    } else {
      console.error("[v0] fileInputRef.current is null")
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
            ? "upload-drag-over"
            : file
              ? "upload-success"
              : "bg-gray-50 border border-dashed border-gray-300"
        }`}
        style={file ? {
          background: 'linear-gradient(to bottom right, rgb(240, 253, 244), rgb(236, 253, 245))',
          border: '2px solid rgb(34, 197, 94)',
          boxShadow: '0 0 0 2px rgba(34, 197, 94, 0.3), 0 4px 6px -1px rgba(34, 197, 94, 0.1)'
        } : {}}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        {file ? (
          <div className="space-y-4">
            <CheckCircle className="h-12 w-12 mx-auto upload-success-icon" />
            <div className="space-y-1">
              <p className="upload-success-text">{file.file.name}</p>
              <p className="upload-success-subtext text-sm">{(file.file.size / 1024 / 1024).toFixed(2)} MB</p>
              <div className="flex items-center justify-center space-x-1 mt-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs upload-success-subtext">上传成功</span>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReplaceClick}
              className="upload-success-button"
            >
              替换文件
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <Upload
              className={`h-12 w-12 mx-auto transition-all duration-300 ${
                isDragOver ? "text-green-600 scale-110" : "text-slate-400"
              }`}
            />
            <div className="space-y-2">
              <p className={`font-medium transition-colors duration-300 ${isDragOver ? "text-green-700" : "text-slate-700"}`}>
                {isDragOver ? "将文件拖放到此处" : "拖放您的3D模型"}
              </p>
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
              className="transition-all hover:scale-105 border-gray-300 text-gray-700 hover:bg-gray-50 font-medium bg-white/80"
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
