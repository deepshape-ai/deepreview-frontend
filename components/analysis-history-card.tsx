"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, ChevronRight } from "lucide-react"
import type { AnalysisResult } from "@/lib/types"

interface AnalysisHistoryCardProps {
  analysis: AnalysisResult
  onClick: () => void
}

export function AnalysisHistoryCard({ analysis, onClick }: AnalysisHistoryCardProps) {
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

  const getDimensionColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 85) return "bg-green-500"
    if (percentage >= 70) return "bg-blue-500"
    if (percentage >= 60) return "bg-yellow-500"
    return "bg-red-500"
  }

  return (
    <Card className="cursor-pointer hover:shadow-lg transition-all duration-200 hover:scale-[1.02]" onClick={onClick}>
      <CardContent className="p-4 sm:p-6">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4 flex-shrink-0" />
                  <span className="truncate">{new Date(analysis.analysisDate).toLocaleDateString()}</span>
                </div>
                <div className="text-sm text-muted-foreground hidden sm:block">
                  ID: {analysis.submissionId.slice(-8)}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="text-right">
                  <div className={`text-xl sm:text-2xl font-bold ${getScoreColor(analysis.overallScore)}`}>
                    {analysis.overallScore}
                  </div>
                  <div className="text-sm text-muted-foreground">/100</div>
                </div>
                <Badge variant={getScoreBadgeVariant(analysis.overallScore)} className="flex-shrink-0">
                  {analysis.overallScore >= 90
                    ? "优秀"
                    : analysis.overallScore >= 80
                      ? "很好"
                      : analysis.overallScore >= 70
                        ? "良好"
                        : "需要改进"}
                </Badge>
              </div>
            </div>

            <div className="mb-4">
              <p className="text-sm text-muted-foreground line-clamp-2 text-pretty">{analysis.summary}</p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
              {analysis.detailedScores.map((score) => (
                <div key={score.dimension} className="text-center">
                  <div className="text-xs font-medium mb-1 truncate" title={score.dimension}>
                    {score.dimension.split(" ")[0]}
                  </div>
                  <div className="flex flex-col items-center space-y-1">
                    <Progress
                      value={(score.score / score.maxScore) * 100}
                      className="w-full h-2"
                      style={{
                        background: `${getDimensionColor(score.score, score.maxScore)}20`,
                      }}
                    />
                    <div className="text-xs text-muted-foreground">
                      {score.score}/{score.maxScore}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="ml-4 flex-shrink-0">
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
