"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { ModelViewer } from "@/components/model-viewer"
import { ScoreBreakdown } from "@/components/score-breakdown"
import { ShareButton } from "@/components/share-button"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Calendar, Trophy } from "lucide-react"
import { AnalysisStorageService } from "@/lib/mock-api"
import type { AnalysisResult } from "@/lib/types"

export default function AnalysisDetailPage() {
  const params = useParams()
  const router = useRouter()
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const id = params.id as string
    if (id) {
      const result = AnalysisStorageService.getAnalysisById(id)
      setAnalysis(result)
      setIsLoading(false)
    }
  }, [params.id])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  if (!analysis) {
    return (
      <div className="min-h-screen bg-white">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">未找到分析</h1>
            <p className="text-muted-foreground mb-4">无法找到请求的分析。</p>
            <Button onClick={() => router.push("/")}>返回上传</Button>
          </div>
        </main>
      </div>
    )
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 80) return "secondary"
    if (score >= 70) return "outline"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => router.push("/dashboard")}
            className="mb-4 transition-all hover:scale-105"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            返回仪表板
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold mb-2 text-balance">分析结果</h1>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-1 sm:space-y-0 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(analysis.analysisDate).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <span>ID: {analysis.submissionId}</span>
                </div>
              </div>
            </div>
            <ShareButton analysis={analysis} />
          </div>
        </div>

        {/* Overall Score and 3D Model Viewer in same row */}
        <div className="grid lg:grid-cols-2 gap-6 mb-6 items-stretch">
          {/* Overall Score Card */}
          <Card className="transition-all duration-300 hover:shadow-xl border-2 border-black/20 shadow-lg overflow-hidden p-0 bg-white">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Score Display Section */}
              <div className="relative bg-white border-b-2 border-black/20 text-black p-6">
                <div className="relative z-10">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold mb-2">{analysis.overallScore}</div>
                    <div className="text-lg mb-3">/100 分</div>
                    <Badge variant="outline" className="border-black/30 text-black px-3 py-1 text-sm font-medium">
                      {analysis.overallScore >= 90
                        ? "卓越表现"
                        : analysis.overallScore >= 80
                          ? "优良水平"
                          : analysis.overallScore >= 70
                            ? "良好表现"
                            : "待提升"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="flex-1 p-6 bg-white">
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center text-black">
                    <Trophy className="h-5 w-5 mr-2 text-black" />
                    综合评估报告
                  </h3>
                  <div className="bg-white rounded-xl p-4 border-2 border-black/20">
                    <p className="text-black leading-relaxed text-pretty text-sm">{analysis.summary}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-black text-sm mb-3">各维度得分详情</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {analysis.detailedScores.map((score, index) => (
                      <div
                        key={score.dimension}
                        className="flex flex-col p-3 bg-white rounded-lg border border-black/20 hover:shadow-sm transition-all"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="w-2 h-2 rounded-full bg-black"></div>
                          <div className={`text-xs font-bold text-black`}>{score.score}/20</div>
                        </div>
                        <span className="font-medium text-black text-xs leading-tight">{score.dimension}</span>
                        <div className="text-xs text-gray-600 mt-1">{Math.round((score.score / 20) * 100)}%</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* 3D Model Viewer */}
          <div className="h-full">
            <ModelViewer
              upperJawUrl={analysis.models.upperJawUrl}
              lowerJawUrl={analysis.models.lowerJawUrl}
              restorationUrl={analysis.models.restorationUrl}
              className="h-full"
            />
          </div>
        </div>

        <Card className="bg-white border-2 border-black/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl text-black">详细分析与视觉评估</CardTitle>
            <p className="text-sm text-gray-600">包含技术参数和视觉分析的综合评估</p>
          </CardHeader>
          <CardContent className="pt-0">
            <ScoreBreakdown scores={analysis.detailedScores} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
