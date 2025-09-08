"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { AnalysisHistoryCard } from "@/components/analysis-history-card"
import { StatsOverview } from "@/components/stats-overview"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardTitle } from "@/components/ui/card"
import { Plus, Calendar, Trophy } from "lucide-react"
import { AnalysisStorageService } from "@/lib/mock-api"
import type { AnalysisResult } from "@/lib/types"

export default function DashboardPage() {
  const router = useRouter()
  const [analyses, setAnalyses] = useState<AnalysisResult[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAnalyses = () => {
      const allAnalyses = AnalysisStorageService.getAllAnalyses()
      // Sort by date, most recent first
      const sortedAnalyses = allAnalyses.sort(
        (a, b) => new Date(b.analysisDate).getTime() - new Date(a.analysisDate).getTime(),
      )
      setAnalyses(sortedAnalyses)
      setIsLoading(false)
    }

    loadAnalyses()
  }, [])

  const handleAnalysisClick = (submissionId: string) => {
    router.push(`/analysis/${submissionId}`)
  }

  const handleNewAnalysis = () => {
    router.push("/")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">我的进度</h1>
            <p className="text-muted-foreground">跟踪您的牙冠修复分析历史</p>
          </div>
          <Button onClick={handleNewAnalysis}>
            <Plus className="mr-2 h-4 w-4" />
            新分析
          </Button>
        </div>

        {analyses.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Trophy className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <CardTitle className="mb-2">暂无分析</CardTitle>
              <CardDescription className="mb-4">通过上传您的第一个牙冠修复模型开始学习之旅</CardDescription>
              <Button onClick={handleNewAnalysis}>
                <Plus className="mr-2 h-4 w-4" />
                创建首个分析
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Stats Overview */}
            <StatsOverview analyses={analyses} />

            {/* Analysis History */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Calendar className="h-5 w-5" />
                <h2 className="text-xl font-semibold">分析历史</h2>
                <span className="text-sm text-muted-foreground">（共{analyses.length}个）</span>
              </div>

              <div className="grid gap-4">
                {analyses.map((analysis) => (
                  <AnalysisHistoryCard
                    key={analysis.submissionId}
                    analysis={analysis}
                    onClick={() => handleAnalysisClick(analysis.submissionId)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
