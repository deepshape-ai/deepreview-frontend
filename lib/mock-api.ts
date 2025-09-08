import type { AnalysisResult, ToothPosition } from "./types"

export const FDI_TOOTH_POSITIONS: ToothPosition[] = [
  // Quadrant 1 (Upper Right)
  { fdiNumber: "18", quadrant: 1, position: 8, name: "第三磨牙（智齿）", type: "molar" },
  { fdiNumber: "17", quadrant: 1, position: 7, name: "第二磨牙", type: "molar" },
  { fdiNumber: "16", quadrant: 1, position: 6, name: "第一磨牙", type: "molar" },
  { fdiNumber: "15", quadrant: 1, position: 5, name: "第二前磨牙", type: "premolar" },
  { fdiNumber: "14", quadrant: 1, position: 4, name: "第一前磨牙", type: "premolar" },
  { fdiNumber: "13", quadrant: 1, position: 3, name: "尖牙（犬齿）", type: "canine" },
  { fdiNumber: "12", quadrant: 1, position: 2, name: "侧切牙", type: "incisor" },
  { fdiNumber: "11", quadrant: 1, position: 1, name: "中切牙", type: "incisor" },

  // Quadrant 2 (Upper Left)
  { fdiNumber: "21", quadrant: 2, position: 1, name: "中切牙", type: "incisor" },
  { fdiNumber: "22", quadrant: 2, position: 2, name: "侧切牙", type: "incisor" },
  { fdiNumber: "23", quadrant: 2, position: 3, name: "尖牙（犬齿）", type: "canine" },
  { fdiNumber: "24", quadrant: 2, position: 4, name: "第一前磨牙", type: "premolar" },
  { fdiNumber: "25", quadrant: 2, position: 5, name: "第二前磨牙", type: "premolar" },
  { fdiNumber: "26", quadrant: 2, position: 6, name: "第一磨牙", type: "molar" },
  { fdiNumber: "27", quadrant: 2, position: 7, name: "第二磨牙", type: "molar" },
  { fdiNumber: "28", quadrant: 2, position: 8, name: "第三磨牙（智齿）", type: "molar" },

  // Quadrant 3 (Lower Left)
  { fdiNumber: "38", quadrant: 3, position: 8, name: "第三磨牙（智齿）", type: "molar" },
  { fdiNumber: "37", quadrant: 3, position: 7, name: "第二磨牙", type: "molar" },
  { fdiNumber: "36", quadrant: 3, position: 6, name: "第一磨牙", type: "molar" },
  { fdiNumber: "35", quadrant: 3, position: 5, name: "第二前磨牙", type: "premolar" },
  { fdiNumber: "34", quadrant: 3, position: 4, name: "第一前磨牙", type: "premolar" },
  { fdiNumber: "33", quadrant: 3, position: 3, name: "尖牙（犬齿）", type: "canine" },
  { fdiNumber: "32", quadrant: 3, position: 2, name: "侧切牙", type: "incisor" },
  { fdiNumber: "31", quadrant: 3, position: 1, name: "中切牙", type: "incisor" },

  // Quadrant 4 (Lower Right)
  { fdiNumber: "41", quadrant: 4, position: 1, name: "中切牙", type: "incisor" },
  { fdiNumber: "42", quadrant: 4, position: 2, name: "侧切牙", type: "incisor" },
  { fdiNumber: "43", quadrant: 4, position: 3, name: "尖牙（犬齿）", type: "canine" },
  { fdiNumber: "44", quadrant: 4, position: 4, name: "第一前磨牙", type: "premolar" },
  { fdiNumber: "45", quadrant: 4, position: 5, name: "第二前磨牙", type: "premolar" },
  { fdiNumber: "46", quadrant: 4, position: 6, name: "第一磨牙", type: "molar" },
  { fdiNumber: "47", quadrant: 4, position: 7, name: "第二磨牙", type: "molar" },
  { fdiNumber: "48", quadrant: 4, position: 8, name: "第三磨牙（智齿）", type: "molar" },
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
          criteria: "修复体边缘应与牙体预备边缘形成连续、密闭的接触界面，无间隙或台阶。边缘密合的好坏直接影响修复体的长期成功率，是口腔修复中的关键指标。",
          reason:
            scores.marginalFit >= 18
              ? "边缘密合性优秀，在各个部位均实现了理想的贴合和密封，能有效防止继发龋病和牙齿脱矿。"
              : scores.marginalFit >= 16
                ? "边缘密合性良好，大部分区域密合良好，仅在小部分区域需要调整和优化。"
                : "检测到轻微的边缘间隙，建议进一步精修预备边缘或调整修复体的边缘密合度。",
        },
        {
          dimension: "轴面外形",
          score: scores.axialContour,
          maxScore: 20,
          criteria:
            "修复体的轴面应呈平坦或微凸的形态，从边缘以正确的角度继续向外。轴面外形的正确性直接影响牙龈组织的健康和美观效果。",
          reason:
            scores.axialContour >= 18
              ? "轴面外形设计理想，完美复制了天然牙的形态，有利于维护牙龈的长期健康和美观。"
              : scores.axialContour >= 16
                ? "轴面外形整体良好，在某些细节部位仍有进一步精修的空间。"
                : "部分轴面存在过度突出的情况，可能会对牙龈组织健康产生不利影响，建议进行适当调整。",
        },
        {
          dimension: "邻接触关系",
          score: scores.proximalContact,
          maxScore: 20,
          criteria: "邻接触点应当宽大、位置正确，具有适当的紧密度。良好的邻接触关系能够维持牙列的稳定性，防止食物嵌塞，保护龈乳头的健康。",
          reason:
            scores.proximalContact >= 19
              ? "邻接触点设计完美，位置精准且紧密度适中，能够有效防止食物嵌塞并维持牙列稳定。"
              : scores.proximalContact >= 17
                ? "邻接触关系整体良好，仅需在紧密度或位置方面进行小幅调整。"
                : "邻接触点需要进一步精修以获得最佳的功能效果，建议调整接触面积和紧密度。",
        },
        {
          dimension: "咬合关系",
          score: scores.occlusalRelationship,
          maxScore: 20,
          criteria:
            "修复体应具有稳定的中心咬合接触点，并允许颈下颈在各个方向的自由运动而不产生干扰。正确的咬合关系对于颐面关节的健康和咬合系统的稳定至关重要。",
          reason:
            scores.occlusalRelationship >= 18
              ? "中心咬合接触点明确且稳定，无任何咬合干扰，能够保证颐下颈在各个功能运动中的平衡和协调。"
              : scores.occlusalRelationship >= 16
                ? "咬合关系整体良好，仅需在某些接触点上进行微调以优化功能效果。"
                : "检测到一些咬合干扰，可能影响颐下颈的正常功能，建议进行精细的咬合调整。",
        },
        {
          dimension: "结构美学",
          score: scores.structuralAesthetics,
          maxScore: 20,
          criteria:
            "修复体的解剖结构（如牙尖、窩沟、牙沩等）应当自然且清晰可辨，色泽和表面纹理应与邻牙协调一致。良好的结构美学不仅影响外观，还直接关系到哀噂功能的正常发挥。",
          reason:
            scores.structuralAesthetics >= 18
              ? "解剖结构复制完美，表面细节自然逐真，与天然牙齿的外观和功能高度一致。"
              : scores.structuralAesthetics >= 16
                ? "解剖形态整体良好，在表面细节刻画方面仍有提升空间，可进一步优化。"
                : "主要解剖结构尚可，但继发沟裂和表面纹理需要更加精细地刻画以提升美学效果。",
        },
      ],
    }

    return mockResult
  }

  private static generateSummary(overallScore: number, scores: any): string {
    if (overallScore >= 90) {
      return "卓越的修复水平，各项指标均展现出优秀的技术水准和精细的制作工艺。修复体的边缘密合性、轴面外形、邻接触关系、咬合关系以及结构美学等方面都达到了临床最高标准，能够为患者提供长期稳定的修复效果和优良的使用体验。"
    } else if (overallScore >= 80) {
      return "技术水平优良的修复体。大部分技术指标执行良好，仅在少数细节方面需要进一步完善。整体制作工艺达到临床要求，能够满足患者的功能需求和美学期望，建议在个别薄弱环节进行针对性改进以达到更高标准。"
    } else if (overallScore >= 70) {
      return "基础扎实的良好修复体。整体技术框架合理，主要功能指标基本符合临床标准。建议重点关注并改进特定技术环节，通过精细化调整来提升修复质量，以获得更佳的临床效果和患者满意度。"
    } else {
      return "基本合格的修复体，在关键技术指标方面仍有较大提升空间。建议系统性地重新评估和改进边缘密合、外形设计、咬合调整等核心技术环节，以确保修复体能够达到临床应用的基本要求和长期稳定性。"
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
