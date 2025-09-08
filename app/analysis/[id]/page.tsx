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
    if (score >= 90) return "text-gray-900"
    if (score >= 80) return "text-gray-700"
    if (score >= 70) return "text-gray-500"
    return "text-gray-400"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 90) return "default"
    if (score >= 80) return "secondary"
    if (score >= 70) return "outline"
    return "destructive"
  }

  return (
    <div className="min-h-screen bg-white relative">
      {/* Subtle decorative gradient overlay */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-50/50 via-slate-50/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-gray-50/30 to-transparent"></div>
        <div className="absolute top-20 left-0 w-96 h-96 bg-gradient-radial from-blue-50/20 via-transparent to-transparent rounded-full blur-3xl transform -translate-x-48"></div>
        <div className="absolute top-40 right-0 w-80 h-80 bg-gradient-radial from-purple-50/15 via-transparent to-transparent rounded-full blur-3xl transform translate-x-40"></div>
      </div>
      
      <Header />

      <main className="container mx-auto px-4 py-8 max-w-7xl relative z-10">
        {/* Additional decorative elements for main content */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/3 left-1/4 w-64 h-64 bg-gradient-radial from-emerald-50/10 via-transparent to-transparent rounded-full blur-2xl"></div>
          <div className="absolute bottom-1/4 right-1/3 w-72 h-72 bg-gradient-radial from-indigo-50/8 via-transparent to-transparent rounded-full blur-2xl"></div>
        </div>
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
          <Card className="relative transition-all duration-300 hover:shadow-xl hover:scale-[1.01] border-0 shadow-xl overflow-hidden p-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500">
            {/* Animated background pattern */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500"></div>
            <div className="absolute inset-0 opacity-20" style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}></div>
            
            <CardContent className="relative z-10 p-0 h-full flex flex-col">
              {/* Score Display Section */}
              <div className="relative text-white p-8 border-b border-white/20">
                <div className="text-center">
                  <div className="mb-4">
                    <div className="text-6xl font-black mb-3 bg-gradient-to-r from-white to-yellow-200 bg-clip-text text-transparent drop-shadow-lg">
                      {analysis.overallScore}
                    </div>
                    <div className="text-xl mb-4 text-white/90 font-semibold">/100 分</div>
                    <div className="inline-flex px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
                      <span className="text-white font-bold text-sm tracking-wide">
                        {analysis.overallScore >= 90
                          ? "🏆 卓越表现"
                          : analysis.overallScore >= 80
                            ? "⭐ 优良水平"
                            : analysis.overallScore >= 70
                              ? "✨ 良好表现"
                              : "🔥 待提升"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Summary Section */}
              <div className="flex-1 p-6 bg-white/95 backdrop-blur-sm">
                <div className="mb-6">
                  <h3 className="font-bold text-xl mb-4 flex items-center text-slate-800">
                    <div className="p-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full mr-3">
                      <Trophy className="h-5 w-5 text-white" />
                    </div>
                    综合评估报告
                  </h3>
                  <div className="bg-gradient-to-br from-white to-slate-50 rounded-xl p-5 border border-slate-200 shadow-sm">
                    <p className="text-slate-700 leading-relaxed text-pretty">{analysis.summary}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-bold text-slate-800 mb-4 flex items-center">
                    <div className="w-1 h-6 bg-gradient-to-b from-indigo-500 to-purple-500 rounded-full mr-3"></div>
                    各维度得分详情
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {analysis.detailedScores.map((score, index) => {
                      const colors = [
                        'from-blue-500 to-blue-600',
                        'from-emerald-500 to-emerald-600', 
                        'from-purple-500 to-purple-600',
                        'from-amber-500 to-amber-600',
                        'from-rose-500 to-rose-600'
                      ];
                      const colorClass = colors[index % colors.length];
                      
                      return (
                        <div
                          key={score.dimension}
                          className="flex flex-col p-4 bg-gradient-to-br from-white to-slate-50 rounded-xl border border-slate-200 hover:shadow-sm transition-all duration-200 hover:scale-[1.02]"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colorClass} shadow-sm`}></div>
                            <div className="text-sm font-bold text-slate-700">{score.score}/20</div>
                          </div>
                          <span className="font-semibold text-slate-800 text-sm leading-tight mb-1">{score.dimension}</span>
                          <div className="text-xs text-slate-500 font-medium">{Math.round((score.score / 20) * 100)}%</div>
                        </div>
                      );
                    })}
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

        <Card className="bg-white/95 backdrop-blur-sm border-2 border-black/15 shadow-lg relative z-10">
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
