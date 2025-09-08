"use client"

import React from "react"

import { useState, useRef, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RadarChart } from "@/components/radar-chart"
import { Share2, Download, Copy, Check, ExternalLink, X } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface ShareButtonProps {
  analysis: AnalysisResult
}

function ResizableDialogContent({
  children,
  className = "",
  onClose,
}: { children: React.ReactNode; className?: string; onClose?: () => void }) {
  const [size, setSize] = useState({ width: 850, height: 700 })
  const [isResizing, setIsResizing] = useState(false)
  const dialogRef = useRef<HTMLDivElement>(null)
  const startPos = useRef({ x: 0, y: 0, width: 0, height: 0 })

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(true)
      startPos.current = {
        x: e.clientX,
        y: e.clientY,
        width: size.width,
        height: size.height,
      }
    },
    [size],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizing) return
      e.preventDefault()

      const deltaX = e.clientX - startPos.current.x
      const deltaY = e.clientY - startPos.current.y

      const newWidth = Math.max(400, startPos.current.width + deltaX)
      const newHeight = Math.max(300, startPos.current.height + deltaY)

      setSize({ width: newWidth, height: newHeight })
    },
    [isResizing],
  )

  const handleMouseUp = useCallback((e: MouseEvent) => {
    if (isResizing) {
      e.preventDefault()
      e.stopPropagation()
      setIsResizing(false)
    }
  }, [isResizing])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isResizing) {
      const handleGlobalMouseMove = (e: MouseEvent) => {
        e.preventDefault()
        handleMouseMove(e)
      }
      
      const handleGlobalMouseUp = (e: MouseEvent) => {
        e.preventDefault()
        e.stopPropagation()
        handleMouseUp(e)
      }

      document.addEventListener("mousemove", handleGlobalMouseMove, { passive: false })
      document.addEventListener("mouseup", handleGlobalMouseUp, { passive: false })
      
      return () => {
        document.removeEventListener("mousemove", handleGlobalMouseMove)
        document.removeEventListener("mouseup", handleGlobalMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={dialogRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => {
        // Don't close if currently resizing or if click is on dialog content
        if (!isResizing && e.target === e.currentTarget) {
          onClose?.()
        }
      }}
    >
      <div
        className="relative bg-background border rounded-lg shadow-lg overflow-hidden"
        style={{ width: size.width, height: size.height }}
      >
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-2 right-2 z-10 h-8 w-8 p-0 hover:bg-muted"
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>

        <div className="h-full overflow-y-auto p-6">{children}</div>

        {/* Resize handle */}
        <div
          className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize bg-muted hover:bg-muted-foreground/20 transition-colors"
          onMouseDown={handleMouseDown}
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
          onMouseUp={(e) => {
            e.preventDefault()
            e.stopPropagation()
          }}
        >
          <div className="absolute bottom-1 right-1 w-2 h-2 border-r-2 border-b-2 border-muted-foreground/50" />
        </div>
      </div>
    </div>
  )
}

export function ShareButton({ analysis }: ShareButtonProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [copied, setCopied] = useState(false)
  const [downloading, setDownloading] = useState(false)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy link:", err)
    }
  }

  const handleDownloadImage = async () => {
    setDownloading(true)
    try {
      // Create a high-quality canvas for the share card
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")
      if (!ctx) return

      // High resolution for better quality - wider for left-right layout
      const scale = 2
      canvas.width = 850 * scale
      canvas.height = 700 * scale
      ctx.scale(scale, scale)

      // Light tech gradient background
      const gradient = ctx.createLinearGradient(0, 0, 850, 700)
      gradient.addColorStop(0, "#f8fafc") // slate-50
      gradient.addColorStop(0.5, "#f1f5f9") // gray-100  
      gradient.addColorStop(1, "#e2e8f0") // slate-200
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 850, 700)
      
      // Subtle color overlay
      const overlayGradient = ctx.createLinearGradient(0, 0, 850, 700)
      overlayGradient.addColorStop(0, "rgba(239, 246, 255, 0.5)") // blue-50/50
      overlayGradient.addColorStop(0.5, "rgba(250, 245, 255, 0.3)") // purple-50/30
      overlayGradient.addColorStop(1, "rgba(253, 244, 255, 0.5)") // pink-50/50
      ctx.fillStyle = overlayGradient
      ctx.fillRect(0, 0, 850, 700)
      
      // Brand accent line at top
      const accentGradient = ctx.createLinearGradient(0, 0, 850, 0)
      accentGradient.addColorStop(0, "#06b6d4") // cyan-500
      accentGradient.addColorStop(0.33, "#3b82f6") // blue-500
      accentGradient.addColorStop(0.66, "#8b5cf6") // purple-500
      accentGradient.addColorStop(1, "#ec4899") // pink-500
      ctx.fillStyle = accentGradient
      ctx.fillRect(0, 0, 850, 4)

      // Header section
      ctx.fillStyle = "#0f172a" // slate-900
      ctx.font = "bold 28px Arial"
      ctx.fillText("DeepReview", 40, 60)

      // Subtitle
      ctx.font = "16px Arial"
      ctx.fillStyle = "#475569" // slate-600
      ctx.fillText("AI驱动的口腔修复体分析", 40, 85)

      // Left side - Overall Score Circle 
      const leftCenterX = 200 // left side center
      const centerY = 200
      const radius = 60

      // Score circle background
      ctx.beginPath()
      ctx.arc(leftCenterX, centerY, radius, 0, 2 * Math.PI)
      ctx.fillStyle = analysis.overallScore >= 80 ? "#10b981" : analysis.overallScore >= 70 ? "#3b82f6" : "#ef4444"
      ctx.fill()

      // Score text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 36px Arial"
      ctx.textAlign = "center"
      ctx.fillText(analysis.overallScore.toString(), leftCenterX, centerY + 5)
      ctx.font = "14px Arial"
      ctx.fillText("/100", leftCenterX, centerY + 25)

      // Score label
      ctx.fillStyle = "#0f172a" // slate-900
      ctx.font = "16px Arial"
      ctx.fillText("总体评分", leftCenterX, centerY + 90)

      // Left side summary text
      ctx.textAlign = "left"
      ctx.font = "14px Arial"
      ctx.fillStyle = "#374151" // gray-700
      const summaryWords = analysis.summary.split(" ")
      let line = ""
      let y = 140
      const maxWidth = 350 // narrower for left column
      for (let i = 0; i < summaryWords.length; i++) {
        const testLine = line + summaryWords[i] + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, 40, y) // left aligned
          line = summaryWords[i] + " "
          y += 20
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 40, y) // left aligned

      // Right side - Radar chart placeholder
      ctx.textAlign = "center"
      ctx.font = "16px Arial"
      ctx.fillStyle = "#6b7280"
      ctx.fillText("雷达图显示", 650, 200)

      // Dimension scores - adjusted for wider layout
      const startY = 380
      const centerX = 425 // center of 850px width
      ctx.font = "bold 14px Arial"
      ctx.fillStyle = "#0f172a" // slate-900
      ctx.textAlign = "center"
      ctx.fillText("维度分解:", centerX, startY)

      analysis.detailedScores.forEach((score, index) => {
        const yPos = startY + 30 + index * 35
        const percentage = (score.score / score.maxScore) * 100

        // Dimension name - left aligned
        ctx.font = "12px Arial"
        ctx.fillStyle = "#374151" // gray-700
        ctx.textAlign = "left"
        ctx.fillText(score.dimension, 100, yPos)

        // Progress bar background - adjusted for wider width
        ctx.fillStyle = "#e5e7eb"
        ctx.fillRect(320, yPos - 10, 280, 8)

        // Progress bar fill
        const barColor = percentage >= 85 ? "#10b981" : percentage >= 70 ? "#3b82f6" : "#ef4444"
        ctx.fillStyle = barColor
        ctx.fillRect(320, yPos - 10, (280 * percentage) / 100, 8)

        // Score text
        ctx.font = "12px Arial"
        ctx.fillStyle = "#6b7280"
        ctx.textAlign = "right"
        ctx.fillText(`${score.score}/${score.maxScore}`, 720, yPos)
      })

      // Footer - centered for wider layout
      ctx.font = "10px Arial"
      ctx.fillStyle = "#6b7280" // gray-500
      ctx.textAlign = "center"
      ctx.fillText(`分析日期：${new Date(analysis.analysisDate).toLocaleDateString()}`, centerX, 650)
      ctx.fillText(`ID：${analysis.submissionId}`, centerX, 670)

      // Download
      const link = document.createElement("a")
      link.download = `dental-reviewer-analysis-${analysis.submissionId}.png`
      link.href = canvas.toDataURL("image/png", 1.0)
      link.click()
    } catch (error) {
      console.error("Failed to download image:", error)
    } finally {
      setDownloading(false)
    }
  }

  const radarData = analysis.detailedScores.map((score) => ({
    dimension: score.dimension.split(" ")[0], // Shortened for radar chart
    score: score.score,
    maxScore: score.maxScore,
  }))

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Share2 className="mr-2 h-4 w-4" />
          分享结果
        </Button>
      </DialogTrigger>

      {isOpen && (
        <ResizableDialogContent onClose={() => setIsOpen(false)}>
          <DialogHeader>
            <DialogTitle>分享分析结果</DialogTitle>
            <DialogDescription>与他人分享您的牙冠分析结果</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <Card className="relative overflow-hidden border-0 shadow-2xl">
              {/* Light tech gradient background */}
              <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-gray-100 to-slate-200"></div>
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-50/50 via-purple-50/30 to-pink-50/50"></div>
              
              {/* Brand accent line */}
              <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-pink-500"></div>
              <CardHeader className="text-center pb-2 relative z-10">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-400 to-blue-500 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">DR</span>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold text-slate-900">DeepReview</div>
                    <div className="text-xs text-slate-600">AI驱动的口腔修复体分析</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4 relative z-10">
                {/* Left-right layout: score on left, radar chart on right */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Left side - Score and Summary */}
                  <div className="text-center space-y-2">
                    <div>
                      <div className="text-4xl font-bold text-slate-900 mb-1 drop-shadow-sm">{analysis.overallScore}</div>
                      <div className="text-sm text-slate-600">/100</div>
                      <Badge variant="outline" className="mt-1 text-xs border-slate-400 text-slate-700 bg-white/80 backdrop-blur-sm">
                        {analysis.overallScore >= 90
                          ? "优秀"
                          : analysis.overallScore >= 80
                            ? "很好"
                            : analysis.overallScore >= 70
                              ? "良好"
                              : "需要改进"}
                      </Badge>
                    </div>
                    <div className="text-xs text-slate-700 leading-relaxed px-2">
                      {analysis.summary.length > 120 ? `${analysis.summary.substring(0, 120)}...` : analysis.summary}
                    </div>
                  </div>

                  {/* Right side - Radar Chart */}
                  <div className="flex items-center justify-center">
                    <RadarChart data={radarData} size={180} />
                  </div>
                </div>

                {/* Dimension Scores Grid */}
                <div className="border-t border-slate-300 pt-3">
                  <h4 className="font-semibold mb-2 text-center text-sm text-slate-900">维度分解</h4>
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {analysis.detailedScores.map((score) => (
                      <div key={score.dimension} className="text-center p-1">
                        <div className="font-medium mb-1 truncate text-slate-700" title={score.dimension}>
                          {score.dimension.split(" ")[0]}
                        </div>
                        <div className="text-sm font-bold text-slate-900">
                          {score.score}
                          <span className="text-slate-600">/{score.maxScore}</span>
                        </div>
                        <div className="text-slate-600">{((score.score / score.maxScore) * 100).toFixed(0)}%</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-xs text-slate-500 border-t border-slate-300 pt-2">
                  分析日期：{new Date(analysis.analysisDate).toLocaleDateString()} • ID：{" "}
                  {analysis.submissionId.slice(-8)}
                </div>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2">
              <Button onClick={handleDownloadImage} disabled={downloading} className="flex-1">
                <Download className="mr-2 h-4 w-4" />
                {downloading ? "生成中..." : "下载为图片"}
              </Button>
              <Button variant="outline" onClick={handleCopyLink} className="flex-1 bg-transparent hover:bg-gray-50 hover:text-gray-900">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "已复制！" : "复制链接"}
              </Button>
              <Button variant="outline" onClick={() => window.open(window.location.href, "_blank")} className="flex-1 hover:bg-gray-50 hover:text-gray-900">
                <ExternalLink className="mr-2 h-4 w-4" />
                在新标签页打开
              </Button>
            </div>
          </div>
        </ResizableDialogContent>
      )}
    </Dialog>
  )
}
