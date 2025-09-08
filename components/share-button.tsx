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
  const [size, setSize] = useState({ width: 768, height: 600 })
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

  const handleMouseUp = useCallback(() => {
    setIsResizing(false)
  }, [])

  // Add global mouse event listeners
  React.useEffect(() => {
    if (isResizing) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
      return () => {
        document.removeEventListener("mousemove", handleMouseMove)
        document.removeEventListener("mouseup", handleMouseUp)
      }
    }
  }, [isResizing, handleMouseMove, handleMouseUp])

  return (
    <div
      ref={dialogRef}
      className={`fixed inset-0 z-50 flex items-center justify-center p-4 ${className}`}
      style={{ backgroundColor: "rgba(0, 0, 0, 0.5)" }}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
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
          onClick={(e) => e.stopPropagation()}
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

      // High resolution for better quality
      const scale = 2
      canvas.width = 800 * scale
      canvas.height = 600 * scale
      ctx.scale(scale, scale)

      // Background gradient
      const gradient = ctx.createLinearGradient(0, 0, 800, 600)
      gradient.addColorStop(0, "#f8fafc")
      gradient.addColorStop(1, "#e2e8f0")
      ctx.fillStyle = gradient
      ctx.fillRect(0, 0, 800, 600)

      // Header section
      ctx.fillStyle = "#1e293b"
      ctx.font = "bold 28px Arial"
      ctx.fillText("DeepShape - DeepReview", 40, 60)

      // Subtitle
      ctx.font = "16px Arial"
      ctx.fillStyle = "#64748b"
      ctx.fillText("AI驱动的口腔修复体分析", 40, 85)

      // Overall Score Circle
      const centerX = 150
      const centerY = 200
      const radius = 60

      // Score circle background
      ctx.beginPath()
      ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI)
      ctx.fillStyle = analysis.overallScore >= 80 ? "#10b981" : analysis.overallScore >= 70 ? "#3b82f6" : "#ef4444"
      ctx.fill()

      // Score text
      ctx.fillStyle = "#ffffff"
      ctx.font = "bold 36px Arial"
      ctx.textAlign = "center"
      ctx.fillText(analysis.overallScore.toString(), centerX, centerY + 5)
      ctx.font = "14px Arial"
      ctx.fillText("/100", centerX, centerY + 25)

      // Score label
      ctx.fillStyle = "#1e293b"
      ctx.font = "16px Arial"
      ctx.fillText("总体评分", centerX, centerY + 90)

      // Summary text
      ctx.textAlign = "left"
      ctx.font = "14px Arial"
      ctx.fillStyle = "#374151"
      const summaryWords = analysis.summary.split(" ")
      let line = ""
      let y = 140
      const maxWidth = 520
      for (let i = 0; i < summaryWords.length; i++) {
        const testLine = line + summaryWords[i] + " "
        const metrics = ctx.measureText(testLine)
        if (metrics.width > maxWidth && i > 0) {
          ctx.fillText(line, 280, y)
          line = summaryWords[i] + " "
          y += 20
        } else {
          line = testLine
        }
      }
      ctx.fillText(line, 280, y)

      // Dimension scores
      const startY = 320
      ctx.font = "bold 14px Arial"
      ctx.fillStyle = "#1e293b"
      ctx.fillText("维度分解:", 40, startY)

      analysis.detailedScores.forEach((score, index) => {
        const yPos = startY + 30 + index * 35
        const percentage = (score.score / score.maxScore) * 100

        // Dimension name
        ctx.font = "12px Arial"
        ctx.fillStyle = "#374151"
        ctx.fillText(score.dimension, 40, yPos)

        // Progress bar background
        ctx.fillStyle = "#e5e7eb"
        ctx.fillRect(200, yPos - 10, 200, 8)

        // Progress bar fill
        const barColor = percentage >= 85 ? "#10b981" : percentage >= 70 ? "#3b82f6" : "#ef4444"
        ctx.fillStyle = barColor
        ctx.fillRect(200, yPos - 10, (200 * percentage) / 100, 8)

        // Score text
        ctx.font = "12px Arial"
        ctx.fillStyle = "#6b7280"
        ctx.fillText(`${score.score}/${score.maxScore}`, 420, yPos)
      })

      // Footer
      ctx.font = "10px Arial"
      ctx.fillStyle = "#9ca3af"
      ctx.fillText(`分析日期：${new Date(analysis.analysisDate).toLocaleDateString()}`, 40, 570)
      ctx.fillText(`ID：${analysis.submissionId}`, 600, 570)

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
            <Card className="bg-gradient-to-br from-blue-50 via-white to-amber-50 border-2">
              <CardHeader className="text-center pb-2">
                <div className="flex items-center justify-center space-x-2 mb-1">
                  <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-bold text-sm">DR</span>
                  </div>
                  <div className="text-left">
                    <div className="text-lg font-bold">DeepReview</div>
                    <div className="text-xs text-muted-foreground">AI驱动的口腔修复体分析</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid lg:grid-cols-2 gap-4">
                  {/* Left side - Score and Summary */}
                  <div className="text-center space-y-2">
                    <div>
                      <div className="text-4xl font-bold text-primary mb-1">{analysis.overallScore}</div>
                      <div className="text-sm text-muted-foreground">/100</div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {analysis.overallScore >= 90
                          ? "优秀"
                          : analysis.overallScore >= 80
                            ? "很好"
                            : analysis.overallScore >= 70
                              ? "良好"
                              : "需要改进"}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground leading-relaxed px-2">
                      {analysis.summary.length > 100 ? `${analysis.summary.substring(0, 100)}...` : analysis.summary}
                    </div>
                  </div>

                  {/* Right side - Radar Chart */}
                  <div className="flex items-center justify-center">
                    <RadarChart data={radarData} size={200} />
                  </div>
                </div>

                {/* Dimension Scores Grid */}
                <div className="border-t pt-3">
                  <h4 className="font-semibold mb-2 text-center text-sm">维度分解</h4>
                  <div className="grid grid-cols-5 gap-2 text-xs">
                    {analysis.detailedScores.map((score) => (
                      <div key={score.dimension} className="text-center p-1">
                        <div className="font-medium mb-1 truncate" title={score.dimension}>
                          {score.dimension.split(" ")[0]}
                        </div>
                        <div className="text-sm font-bold text-primary">
                          {score.score}
                          <span className="text-muted-foreground">/{score.maxScore}</span>
                        </div>
                        <div className="text-muted-foreground">
                          {((score.score / score.maxScore) * 100).toFixed(0)}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-center text-xs text-muted-foreground border-t pt-2">
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
              <Button variant="outline" onClick={handleCopyLink} className="flex-1 bg-transparent">
                {copied ? <Check className="mr-2 h-4 w-4" /> : <Copy className="mr-2 h-4 w-4" />}
                {copied ? "已复制！" : "复制链接"}
              </Button>
              <Button variant="outline" onClick={() => window.open(window.location.href, "_blank")} className="flex-1">
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
