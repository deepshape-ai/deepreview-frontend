"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { TrendingUp, Trophy, Target, BarChart3 } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface StatsOverviewProps {
  analyses: AnalysisResult[]
}

export function StatsOverview({ analyses }: StatsOverviewProps) {
  if (analyses.length === 0) return null

  // Calculate statistics
  const averageScore = analyses.reduce((sum, analysis) => sum + analysis.overallScore, 0) / analyses.length

  const latestScore = analyses[0]?.overallScore || 0
  const previousScore = analyses[1]?.overallScore || latestScore
  const improvement = latestScore - previousScore

  const bestScore = Math.max(...analyses.map((a) => a.overallScore))

  // Calculate dimension averages
  const dimensionAverages =
    analyses[0]?.detailedScores.map((dimension, index) => {
      const dimensionName = dimension.dimension
      const average =
        analyses.reduce((sum, analysis) => sum + analysis.detailedScores[index].score, 0) / analyses.length
      const maxScore = dimension.maxScore
      return { name: dimensionName, average, maxScore }
    }) || []

  const getScoreColor = (score: number) => {
    if (score >= 90) return "text-green-600"
    if (score >= 80) return "text-blue-600"
    if (score >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return "text-green-600"
    if (improvement < 0) return "text-red-600"
    return "text-muted-foreground"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">平均分数</CardTitle>
          <BarChart3 className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getScoreColor(averageScore)}`}>{averageScore.toFixed(1)}</div>
          <p className="text-xs text-muted-foreground">基于{analyses.length}次分析</p>
        </CardContent>
      </Card>

      {/* Best Score */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">最佳分数</CardTitle>
          <Trophy className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getScoreColor(bestScore)}`}>{bestScore}</div>
          <p className="text-xs text-muted-foreground">个人最佳</p>
        </CardContent>
      </Card>

      {/* Latest Improvement */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">最近变化</CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${getImprovementColor(improvement)}`}>
            {improvement > 0 ? "+" : ""}
            {improvement.toFixed(1)}
          </div>
          <p className="text-xs text-muted-foreground">与上次分析相比</p>
        </CardContent>
      </Card>

      {/* Total Analyses */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">总分析数</CardTitle>
          <Target className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{analyses.length}</div>
          <p className="text-xs text-muted-foreground">已完成提交</p>
        </CardContent>
      </Card>

      {/* Dimension Performance Overview */}
      <Card className="md:col-span-2 lg:col-span-4">
        <CardHeader>
          <CardTitle className="text-lg">各维度表现</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {dimensionAverages.map((dimension) => (
              <div key={dimension.name} className="text-center">
                <div className="font-medium text-sm mb-2">{dimension.name}</div>
                <div className="space-y-2">
                  <Progress value={(dimension.average / dimension.maxScore) * 100} className="h-3" />
                  <div className="text-sm text-muted-foreground">
                    {dimension.average.toFixed(1)}/{dimension.maxScore}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {((dimension.average / dimension.maxScore) * 100).toFixed(0)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
