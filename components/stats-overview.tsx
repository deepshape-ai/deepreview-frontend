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
    if (score >= 90) return "text-gray-900"
    if (score >= 80) return "text-gray-700"
    if (score >= 70) return "text-gray-500"
    return "text-gray-400"
  }

  const getImprovementColor = (improvement: number) => {
    if (improvement > 0) return "text-gray-900"
    if (improvement < 0) return "text-gray-500"
    return "text-muted-foreground"
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {/* Average Score */}
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-lg shadow-blue-100/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-blue-800">平均分数</CardTitle>
          <div className="p-1.5 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full">
            <BarChart3 className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold text-blue-700`}>{averageScore.toFixed(1)}</div>
          <p className="text-xs text-blue-600">基于{analyses.length}次分析</p>
        </CardContent>
      </Card>

      {/* Best Score */}
      <Card className="bg-gradient-to-br from-amber-50 to-orange-100 border-amber-200 shadow-lg shadow-amber-100/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-amber-800">最佳分数</CardTitle>
          <div className="p-1.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full">
            <Trophy className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold text-amber-700`}>{bestScore}</div>
          <p className="text-xs text-amber-600">个人最佳</p>
        </CardContent>
      </Card>

      {/* Latest Improvement */}
      <Card className="bg-gradient-to-br from-emerald-50 to-green-100 border-emerald-200 shadow-lg shadow-emerald-100/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-emerald-800">最近变化</CardTitle>
          <div className="p-1.5 bg-gradient-to-r from-emerald-500 to-green-500 rounded-full">
            <TrendingUp className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${improvement > 0 ? "text-emerald-700" : improvement < 0 ? "text-red-600" : "text-gray-600"}`}>
            {improvement > 0 ? "+" : ""}
            {improvement.toFixed(1)}
          </div>
          <p className="text-xs text-emerald-600">与上次分析相比</p>
        </CardContent>
      </Card>

      {/* Total Analyses */}
      <Card className="bg-gradient-to-br from-purple-50 to-violet-100 border-purple-200 shadow-lg shadow-purple-100/50">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-purple-800">总分析数</CardTitle>
          <div className="p-1.5 bg-gradient-to-r from-purple-500 to-violet-500 rounded-full">
            <Target className="h-4 w-4 text-white" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-purple-700">{analyses.length}</div>
          <p className="text-xs text-purple-600">已完成提交</p>
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
