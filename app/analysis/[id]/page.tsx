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
          <Card className="transition-all duration-300 hover:shadow-xl border-0 shadow-lg overflow-hidden p-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100">
            <CardContent className="p-0 h-full flex flex-col">
              {/* Score Display Section */}
              <div className="relative bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 text-white p-6">
                <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                <div className="relative z-10">
                  <div className="text-center mb-4">
                    <div className="text-5xl font-bold mb-2 drop-shadow-sm">{analysis.overallScore}</div>
                    <div className="text-lg mb-3 opacity-90">/100 分</div>
                    <Badge
                      variant="secondary"
                      className="bg-white/20 text-white border-white/30 px-3 py-1 text-sm font-medium backdrop-blur-sm"
                    >
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
              <div className="flex-1 p-6 bg-gradient-to-b from-white to-blue-50/30">
                <div className="mb-6">
                  <h3 className="font-bold text-lg mb-3 flex items-center text-gray-800">
                    <Trophy className="h-5 w-5 mr-2 text-blue-600" />
                    综合评估报告
                  </h3>
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-4 border border-blue-200/50 shadow-sm">
                    <p className="text-gray-700 leading-relaxed text-pretty text-sm">{analysis.summary}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-800 text-sm mb-3">各维度得分详情</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {analysis.detailedScores.map((score, index) => (
                      <div
                        key={score.dimension}
                        className="flex flex-col p-3 bg-white/70 backdrop-blur-sm rounded-lg border border-blue-200/30 hover:shadow-sm transition-all hover:bg-white/90"
                      >
                        <div className="flex items-center justify-between mb-1">
                          <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-600"></div>
                          <div className={`text-xs font-bold text-blue-700`}>{score.score}/20</div>
                        </div>
                        <span className="font-medium text-gray-800 text-xs leading-tight">{score.dimension}</span>
                        <div className="text-xs text-blue-600 mt-1">{Math.round((score.score / 20) * 100)}%</div>
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

        <Card className="bg-gradient-to-br from-slate-50 to-blue-50/50 border border-blue-200/30 shadow-sm">
          <CardHeader className="pb-4 bg-gradient-to-r from-blue-500/5 to-purple-500/5 border-b border-blue-200/30">
            <CardTitle className="text-xl text-gray-800">详细分析与视觉评估</CardTitle>
            <p className="text-sm text-blue-600">包含技术参数和视觉分析的综合评估</p>
          </CardHeader>
          <CardContent className="pt-0">
            <ScoreBreakdown scores={analysis.detailedScores} />
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
