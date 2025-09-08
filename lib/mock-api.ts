import type { AnalysisResult, ToothPosition } from "./types"

export const FDI_TOOTH_POSITIONS: ToothPosition[] = [
  // Quadrant 1 (Upper Right)
  { fdiNumber: "18", quadrant: 1, position: 8, name: "第三磨牙", type: "molar" },
  { fdiNumber: "17", quadrant: 1, position: 7, name: "第二磨牙", type: "molar" },
  { fdiNumber: "16", quadrant: 1, position: 6, name: "第一磨牙", type: "molar" },
  { fdiNumber: "15", quadrant: 1, position: 5, name: "第二前磨牙", type: "premolar" },
  { fdiNumber: "14", quadrant: 1, position: 4, name: "第一前磨牙", type: "premolar" },
  { fdiNumber: "13", quadrant: 1, position: 3, name: "尖牙", type: "canine" },
  { fdiNumber: "12", quadrant: 1, position: 2, name: "侧切牙", type: "incisor" },
  { fdiNumber: "11", quadrant: 1, position: 1, name: "中切牙", type: "incisor" },

  // Quadrant 2 (Upper Left)
  { fdiNumber: "21", quadrant: 2, position: 1, name: "中切牙", type: "incisor" },
  { fdiNumber: "22", quadrant: 2, position: 2, name: "侧切牙", type: "incisor" },
  { fdiNumber: "23", quadrant: 2, position: 3, name: "尖牙", type: "canine" },
  { fdiNumber: "24", quadrant: 2, position: 4, name: "第一前磨牙", type: "premolar" },
  { fdiNumber: "25", quadrant: 2, position: 5, name: "第二前磨牙", type: "premolar" },
  { fdiNumber: "26", quadrant: 2, position: 6, name: "第一磨牙", type: "molar" },
  { fdiNumber: "27", quadrant: 2, position: 7, name: "第二磨牙", type: "molar" },
  { fdiNumber: "28", quadrant: 2, position: 8, name: "第三磨牙", type: "molar" },

  // Quadrant 3 (Lower Left)
  { fdiNumber: "38", quadrant: 3, position: 8, name: "第三磨牙", type: "molar" },
  { fdiNumber: "37", quadrant: 3, position: 7, name: "第二磨牙", type: "molar" },
  { fdiNumber: "36", quadrant: 3, position: 6, name: "第一磨牙", type: "molar" },
  { fdiNumber: "35", quadrant: 3, position: 5, name: "第二前磨牙", type: "premolar" },
  { fdiNumber: "34", quadrant: 3, position: 4, name: "第一前磨牙", type: "premolar" },
  { fdiNumber: "33", quadrant: 3, position: 3, name: "尖牙", type: "canine" },
  { fdiNumber: "32", quadrant: 3, position: 2, name: "侧切牙", type: "incisor" },
  { fdiNumber: "31", quadrant: 3, position: 1, name: "中切牙", type: "incisor" },

  // Quadrant 4 (Lower Right)
  { fdiNumber: "41", quadrant: 4, position: 1, name: "中切牙", type: "incisor" },
  { fdiNumber: "42", quadrant: 4, position: 2, name: "侧切牙", type: "incisor" },
  { fdiNumber: "43", quadrant: 4, position: 3, name: "尖牙", type: "canine" },
  { fdiNumber: "44", quadrant: 4, position: 4, name: "第一前磨牙", type: "premolar" },
  { fdiNumber: "45", quadrant: 4, position: 5, name: "第二前磨牙", type: "premolar" },
  { fdiNumber: "46", quadrant: 4, position: 6, name: "第一磨牙", type: "molar" },
  { fdiNumber: "47", quadrant: 4, position: 7, name: "第二磨牙", type: "molar" },
  { fdiNumber: "48", quadrant: 4, position: 8, name: "第三磨牙", type: "molar" },
]

// Mock API service that simulates AI analysis
export class MockAnalysisService {
  static async analyzeModels(
    upperJawFile: File,
    lowerJawFile: File,
    restorationFile: File,
    toothPosition: string,
  ): Promise<AnalysisResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // Generate mock analysis data
    const submissionId = `sub_${Math.random().toString(36).substr(2, 9)}`
    const analysisDate = new Date().toISOString()

    // Random scoring with some variation
    const scores = {
      marginalFit: Math.floor(Math.random() * 5) + 15, // 15-20
      axialContour: Math.floor(Math.random() * 6) + 14, // 14-19
      proximalContact: Math.floor(Math.random() * 4) + 17, // 17-20
      occlusalRelationship: Math.floor(Math.random() * 5) + 16, // 16-20
      structuralAesthetics: Math.floor(Math.random() * 6) + 15, // 15-20
    }

    const overallScore = Math.round(
      ((scores.marginalFit +
        scores.axialContour +
        scores.proximalContact +
        scores.occlusalRelationship +
        scores.structuralAesthetics) /
        5) *
        5,
    )

    const mockResult: AnalysisResult = {
      submissionId,
      analysisDate,
      overallScore,
      summary: this.generateSummary(overallScore, scores),
      models: {
        upperJawUrl: URL.createObjectURL(upperJawFile),
        lowerJawUrl: URL.createObjectURL(lowerJawFile),
        restorationUrl: URL.createObjectURL(restorationFile),
      },
      toothPosition, // Added tooth position to result
      detailedScores: [
        {
          dimension: "边缘密合性",
          score: scores.marginalFit,
          maxScore: 20,
          criteria: "边缘应为连续、密封的界面，无间隙或台阶。",
          reason:
            scores.marginalFit >= 18
              ? "边缘密封性优异，适合度一致性良好。"
              : scores.marginalFit >= 16
                ? "边缘密合性良好，少数区域需要关注。"
                : "检测到轻微开放边缘，建议优化预备体边缘。",
        },
        {
          dimension: "轴面外形",
          score: scores.axialContour,
          maxScore: 20,
          criteria: "轴面应平坦或轻微凸出，从边缘以正确角度延伸。",
          reason:
            scores.axialContour >= 18
              ? "理想的轴面外形，有利于牙龈健康。"
              : scores.axialContour >= 16
                ? "轴面外形良好，可进行轻微优化。"
                : "部分表面过度突出，可能影响牙龈健康。",
        },
        {
          dimension: "邻面接触",
          score: scores.proximalContact,
          maxScore: 20,
          criteria: "接触点应宽阔、位置正确，具有适当的紧密度。",
          reason:
            scores.proximalContact >= 19
              ? "接触点优异，位置和紧密度理想。"
              : scores.proximalContact >= 17
                ? "接触关系良好，需要轻微调整。"
                : "接触点需要优化以获得最佳功能。",
        },
        {
          dimension: "咬合关系",
          score: scores.occlusalRelationship,
          maxScore: 20,
          criteria: "修复体应具有稳定的中心咬合点，并允许无干扰的侧方运动。",
          reason:
            scores.occlusalRelationship >= 18
              ? "中心咬合点清晰，未检测到干扰。"
              : scores.occlusalRelationship >= 16
                ? "咬合关系良好，需要轻微接触调整。"
                : "检测到一些咬合干扰，可能需要调整。",
        },
        {
          dimension: "结构美学",
          score: scores.structuralAesthetics,
          maxScore: 20,
          criteria: "解剖结构如牙尖、窝沟应自然清晰。色泽和质地应与邻牙匹配。",
          reason:
            scores.structuralAesthetics >= 18
              ? "解剖形态再现优异，表面细节自然。"
              : scores.structuralAesthetics >= 16
                ? "解剖形态良好，表面细节可进一步加强。"
                : "主要解剖结构适当，但次要沟纹可更清晰。",
        },
      ],
    }

    return mockResult
  }

  private static generateSummary(overallScore: number, scores: any): string {
    if (overallScore >= 90) {
      return "卓越的修复水平！各个方面都展现了优秀的技术技能和对细节的关注。"
    } else if (overallScore >= 80) {
      return "非常出色的修复体。大部分方面执行良好，少数区域有改进空间。"
    } else if (overallScore >= 70) {
      return "良好的修复体，基础扎实。专注于优化特定区域可提升质量。"
    } else {
      return "修复体基本合格，关注关键技术方面将有助于改进。"
    }
  }
}

// Local storage service for persisting analysis history
export class AnalysisStorageService {
  private static STORAGE_KEY = "dental-reviewer-analyses"

  static saveAnalysis(analysis: AnalysisResult): void {
    const existing = this.getAllAnalyses()
    existing.push(analysis)
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(existing))
  }

  static getAllAnalyses(): AnalysisResult[] {
    if (typeof window === "undefined") return []
    const stored = localStorage.getItem(this.STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  }

  static getAnalysisById(id: string): AnalysisResult | null {
    const analyses = this.getAllAnalyses()
    return analyses.find((a) => a.submissionId === id) || null
  }
}
