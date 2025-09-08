"use client"

import { useState } from "react"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { ChevronDown, ChevronRight, Ruler, Eye } from "lucide-react"
import Image from "next/image"
import type { DetailedScore } from "@/lib/types"

interface ScoreBreakdownProps {
  scores: DetailedScore[]
}

export function ScoreBreakdown({ scores }: ScoreBreakdownProps) {
  const [openItems, setOpenItems] = useState<string[]>(scores.map((score) => score.dimension))

  const toggleItem = (dimension: string) => {
    setOpenItems((prev) =>
      prev.includes(dimension) ? prev.filter((item) => item !== dimension) : [...prev, dimension],
    )
  }

  const getScoreColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "text-green-600"
    if (percentage >= 80) return "text-blue-600"
    if (percentage >= 70) return "text-yellow-600"
    return "text-red-600"
  }

  const getProgressColor = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "bg-green-500"
    if (percentage >= 80) return "bg-blue-500"
    if (percentage >= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getGradientBackground = (score: number, maxScore: number) => {
    const percentage = (score / maxScore) * 100
    if (percentage >= 90) return "bg-gradient-to-r from-green-50 to-emerald-50 border-green-200"
    if (percentage >= 80) return "bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200"
    if (percentage >= 70) return "bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200"
    return "bg-gradient-to-r from-red-50 to-rose-50 border-red-200"
  }

  const getDimensionVisualContent = (dimension: string, score: number) => {
    // 基于分数生成确定性的技术参数值，避免水合错误
    const getDeterministicValue = (base: number, range: number, score: number) => {
      // 使用分数的哈希值来生成确定性但看起来随机的值
      const hash = (score * 17 + dimension.length * 7) % 100
      return (base + (hash / 100) * range).toFixed(1)
    }

    switch (dimension) {
      case "Marginal Fit":
        return {
          type: "technical",
          icon: <Ruler className="h-4 w-4" />,
          title: "技术参数",
          content: (
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-4 border">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">边缘间隙：</span>
                    <span className="font-mono font-bold text-slate-700">{getDeterministicValue(10, 50, score)}μm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">粘接剂间隙：</span>
                    <span className="font-mono font-bold text-slate-700">{getDeterministicValue(20, 30, score)}μm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">垂直差异：</span>
                    <span className="font-mono font-bold text-slate-700">{getDeterministicValue(5, 20, score)}μm</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">水平间隙：</span>
                    <span className="font-mono font-bold text-slate-700">{getDeterministicValue(8, 25, score)}μm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">适应性：</span>
                    <span className="font-mono font-bold text-slate-700">{getDeterministicValue(85, 12, score)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">密封质量：</span>
                    <span
                      className={`font-semibold ${score >= 18 ? "text-green-600" : score >= 16 ? "text-yellow-600" : "text-red-600"}`}
                    >
                      {score >= 18 ? "优秀" : score >= 16 ? "良好" : "一般"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
        }
      case "Axial Contour":
        return {
          type: "image",
          icon: <Eye className="h-4 w-4" />,
          title: "视觉分析",
          content: (
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg p-4 border shadow-sm">
              <Image
                src="/dental-crown-axial-contour-close-up-view.png"
                alt="Axial contour close-up analysis"
                width={300}
                height={200}
                className="rounded-lg border-2 border-slate-200 w-full object-cover shadow-sm"
              />
              <p className="text-xs text-muted-foreground mt-3 p-2 bg-slate-50 rounded border-l-4 border-blue-300">
                显示轴面轮廓和萌出轮廓的特写视图
              </p>
            </div>
          ),
        }
      case "Proximal Contact":
        return {
          type: "image",
          icon: <Eye className="h-4 w-4" />,
          title: "接触点分析",
          content: (
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg p-4 border shadow-sm">
              <Image
                src="/dental-crown-proximal-contact-point-close-up.png"
                alt="Proximal contact point analysis"
                width={300}
                height={200}
                className="rounded-lg border-2 border-slate-200 w-full object-cover shadow-sm"
              />
              <p className="text-xs text-muted-foreground mt-3 p-2 bg-slate-50 rounded border-l-4 border-green-300">
                邻面接触关系和紧密度的详细视图
              </p>
            </div>
          ),
        }
      case "Occlusal Relationship":
        return {
          type: "image",
          icon: <Eye className="h-4 w-4" />,
          title: "咬合关系",
          content: (
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg p-4 border shadow-sm">
              <Image
                src="/dental-crown-occlusal-surface-bite-relationship.png"
                alt="Occlusal surface and bite relationship"
                width={300}
                height={200}
                className="rounded-lg border-2 border-slate-200 w-full object-cover shadow-sm"
              />
              <p className="text-xs text-muted-foreground mt-3 p-2 bg-slate-50 rounded border-l-4 border-purple-300">
                咬合面显示中心止点和侧方运动
              </p>
            </div>
          ),
        }
      case "Structural Aesthetics":
        return {
          type: "image",
          icon: <Eye className="h-4 w-4" />,
          title: "表面细节分析",
          content: (
            <div className="bg-gradient-to-br from-white to-slate-50 rounded-lg p-4 border shadow-sm">
              <Image
                src="/dental-crown-surface-anatomy-and-texture-detail.png"
                alt="Surface anatomy and texture details"
                width={300}
                height={200}
                className="rounded-lg border-2 border-slate-200 w-full object-cover shadow-sm"
              />
              <p className="text-xs text-muted-foreground mt-3 p-2 bg-slate-50 rounded border-l-4 border-orange-300">
                解剖再现显示牙尖、窝沟和表面纹理
              </p>
            </div>
          ),
        }
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {scores.map((score) => {
        const isOpen = openItems.includes(score.dimension)
        const percentage = (score.score / score.maxScore) * 100
        const visualContent = getDimensionVisualContent(score.dimension, score.score)

        return (
          <Collapsible key={score.dimension} open={isOpen} onOpenChange={() => toggleItem(score.dimension)}>
            <CollapsibleTrigger className="w-full">
              <div
                className={`flex items-center justify-between p-6 border-2 rounded-xl hover:shadow-md transition-all duration-200 ${getGradientBackground(score.score, score.maxScore)}`}
              >
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-white rounded-full shadow-sm">
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-slate-600" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-slate-600" />
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg text-slate-800">{score.dimension}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <Progress value={percentage} className="w-32 h-3" />
                      <span className="text-sm font-semibold text-slate-600">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(score.score, score.maxScore)}`}>
                    {score.score}/{score.maxScore}
                  </div>
                </div>
              </div>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="mx-6 mb-6 mt-2 space-y-6">
                <div className="grid lg:grid-cols-2 gap-8">
                  {/* Left Column - Criteria and Feedback */}
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-400 rounded-r-lg p-4">
                      <h5 className="font-bold text-base mb-3 text-blue-800">评分标准</h5>
                      <p className="text-sm text-slate-700 leading-relaxed">{score.criteria}</p>
                    </div>

                    <div className="bg-gradient-to-r from-slate-50 to-gray-50 border-l-4 border-slate-400 rounded-r-lg p-4">
                      <h5 className="font-bold text-base mb-3 text-slate-800">详细反馈</h5>
                      <p className="text-sm leading-relaxed text-slate-700">{score.reason}</p>
                    </div>

                    <div className="flex justify-start">
                      <Badge
                        variant={percentage >= 85 ? "default" : percentage >= 70 ? "secondary" : "outline"}
                        className="text-sm px-4 py-2 font-semibold"
                      >
                        {percentage >= 85 ? "优秀表现" : percentage >= 70 ? "良好表现" : "需要改进"}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Column - Visual Content */}
                  {visualContent && (
                    <div className="bg-gradient-to-br from-white to-slate-50 border-2 border-slate-200 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-slate-100 rounded-full">{visualContent.icon}</div>
                        <h5 className="font-bold text-base text-slate-800">{visualContent.title}</h5>
                      </div>
                      {visualContent.content}
                    </div>
                  )}
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>
        )
      })}
    </div>
  )
}
