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
    return "text-black"
  }

  const getProgressColor = (score: number, maxScore: number) => {
    return "bg-black"
  }

  const getGradientBackground = (score: number, maxScore: number) => {
    return "bg-white border-black/20"
  }

  const getDimensionVisualContent = (dimension: string, score: number) => {
    switch (dimension) {
      case "边缘密合性":
        return {
          type: "technical",
          icon: <Ruler className="h-4 w-4" style={{ color: "var(--tech-blue)" }} />,
          title: "技术参数",
          content: (
            <div className="bg-gradient-to-br from-slate-50 to-gray-100 rounded-lg p-4 border">
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">边缘间隙：</span>
                    <span className="font-mono font-bold text-slate-700">{(Math.random() * 50 + 10).toFixed(1)}μm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">粘接剂间隙：</span>
                    <span className="font-mono font-bold text-slate-700">{(Math.random() * 30 + 20).toFixed(1)}μm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">垂直差异：</span>
                    <span className="font-mono font-bold text-slate-700">{(Math.random() * 20 + 5).toFixed(1)}μm</span>
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">水平间隙：</span>
                    <span className="font-mono font-bold text-slate-700">{(Math.random() * 25 + 8).toFixed(1)}μm</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">适应性：</span>
                    <span className="font-mono font-bold text-slate-700">{(85 + Math.random() * 12).toFixed(1)}%</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-white rounded border">
                    <span className="text-muted-foreground font-medium">密封质量：</span>
                    <span
                      className={`font-semibold ${score >= 18 ? "text-gray-900" : score >= 16 ? "text-gray-600" : "text-gray-400"}`}
                    >
                      {score >= 18 ? "优秀" : score >= 16 ? "良好" : "一般"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ),
        }
      case "轴面外形":
        return {
          type: "image",
          icon: <Eye className="h-4 w-4" style={{ color: "var(--tech-green)" }} />,
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
              <p className="text-xs text-muted-foreground mt-3 p-2 bg-slate-50 rounded border-l-4 border-gray-400">
                显示轴面轮廓和萌出轮廓的特写视图
              </p>
            </div>
          ),
        }
      case "邻接触关系":
        return {
          type: "image",
          icon: <Eye className="h-4 w-4" style={{ color: "var(--tech-purple)" }} />,
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
              <p className="text-xs text-muted-foreground mt-3 p-2 bg-slate-50 rounded border-l-4 border-gray-400">
                邻面接触关系和紧密度的详细视图
              </p>
            </div>
          ),
        }
      case "咀合关系":
        return {
          type: "image",
          icon: <Eye className="h-4 w-4" style={{ color: "var(--tech-orange)" }} />,
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
              <p className="text-xs text-muted-foreground mt-3 p-2 bg-slate-50 rounded border-l-4 border-gray-400">
                咬合面显示中心止点和侧方运动
              </p>
            </div>
          ),
        }
      case "结构美学":
        return {
          type: "image",
          icon: <Eye className="h-4 w-4" style={{ color: "var(--tech-cyan)" }} />,
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
              <p className="text-xs text-muted-foreground mt-3 p-2 bg-slate-50 rounded border-l-4 border-gray-400">
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
              <div className="flex items-center justify-between p-6 border-2 border-slate-200 rounded-xl hover:shadow-lg transition-all duration-200 bg-gradient-to-r from-slate-50 via-white to-slate-50">
                <div className="flex items-center space-x-4">
                  <div className="p-2 bg-gradient-to-br from-indigo-100 to-purple-100 border border-indigo-200 rounded-full shadow-sm">
                    {isOpen ? (
                      <ChevronDown className="h-5 w-5 text-indigo-700" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-indigo-700" />
                    )}
                  </div>
                  <div className="text-left">
                    <h4 className="font-bold text-lg text-slate-800">{score.dimension}</h4>
                    <div className="flex items-center space-x-3 mt-2">
                      <Progress value={percentage} className="w-32 h-3" />
                      <span className="text-sm font-semibold text-slate-700">{percentage.toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-800">
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
                    <div className="bg-white border-l-4 border-black rounded-r-lg p-4 border border-black/20">
                      <h5 className="font-bold text-base mb-3 text-black">评分标准</h5>
                      <p className="text-sm text-black leading-relaxed">{score.criteria}</p>
                    </div>

                    <div className="bg-white border-l-4 border-black/60 rounded-r-lg p-4 border border-black/20">
                      <h5 className="font-bold text-base mb-3 text-black">详细反馈</h5>
                      <p className="text-sm leading-relaxed text-black">{score.reason}</p>
                    </div>

                    <div className="flex justify-start">
                      <Badge variant="outline" className="text-sm px-4 py-2 font-semibold border-black/30 text-black">
                        {percentage >= 85 ? "优秀表现" : percentage >= 70 ? "良好表现" : "需要改进"}
                      </Badge>
                    </div>
                  </div>

                  {/* Right Column - Visual Content */}
                  {visualContent && (
                    <div className="bg-white border-2 border-black/20 rounded-xl p-6 shadow-sm">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className="p-2 bg-white border border-black/20 rounded-full">{visualContent.icon}</div>
                        <h5 className="font-bold text-base text-black">{visualContent.title}</h5>
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
