import type { AnalysisResult, ToothPosition } from "./types"

export const FDI_TOOTH_POSITIONS: ToothPosition[] = [
  // Quadrant 1 (Upper Right)
  { fdiNumber: "18", quadrant: 1, position: 8, name: "3rd Molar", type: "molar" },
  { fdiNumber: "17", quadrant: 1, position: 7, name: "2nd Molar", type: "molar" },
  { fdiNumber: "16", quadrant: 1, position: 6, name: "1st Molar", type: "molar" },
  { fdiNumber: "15", quadrant: 1, position: 5, name: "2nd Premolar", type: "premolar" },
  { fdiNumber: "14", quadrant: 1, position: 4, name: "1st Premolar", type: "premolar" },
  { fdiNumber: "13", quadrant: 1, position: 3, name: "Canine", type: "canine" },
  { fdiNumber: "12", quadrant: 1, position: 2, name: "Lateral Incisor", type: "incisor" },
  { fdiNumber: "11", quadrant: 1, position: 1, name: "Central Incisor", type: "incisor" },

  // Quadrant 2 (Upper Left)
  { fdiNumber: "21", quadrant: 2, position: 1, name: "Central Incisor", type: "incisor" },
  { fdiNumber: "22", quadrant: 2, position: 2, name: "Lateral Incisor", type: "incisor" },
  { fdiNumber: "23", quadrant: 2, position: 3, name: "Canine", type: "canine" },
  { fdiNumber: "24", quadrant: 2, position: 4, name: "1st Premolar", type: "premolar" },
  { fdiNumber: "25", quadrant: 2, position: 5, name: "2nd Premolar", type: "premolar" },
  { fdiNumber: "26", quadrant: 2, position: 6, name: "1st Molar", type: "molar" },
  { fdiNumber: "27", quadrant: 2, position: 7, name: "2nd Molar", type: "molar" },
  { fdiNumber: "28", quadrant: 2, position: 8, name: "3rd Molar", type: "molar" },

  // Quadrant 3 (Lower Left)
  { fdiNumber: "38", quadrant: 3, position: 8, name: "3rd Molar", type: "molar" },
  { fdiNumber: "37", quadrant: 3, position: 7, name: "2nd Molar", type: "molar" },
  { fdiNumber: "36", quadrant: 3, position: 6, name: "1st Molar", type: "molar" },
  { fdiNumber: "35", quadrant: 3, position: 5, name: "2nd Premolar", type: "premolar" },
  { fdiNumber: "34", quadrant: 3, position: 4, name: "1st Premolar", type: "premolar" },
  { fdiNumber: "33", quadrant: 3, position: 3, name: "Canine", type: "canine" },
  { fdiNumber: "32", quadrant: 3, position: 2, name: "Lateral Incisor", type: "incisor" },
  { fdiNumber: "31", quadrant: 3, position: 1, name: "Central Incisor", type: "incisor" },

  // Quadrant 4 (Lower Right)
  { fdiNumber: "41", quadrant: 4, position: 1, name: "Central Incisor", type: "incisor" },
  { fdiNumber: "42", quadrant: 4, position: 2, name: "Lateral Incisor", type: "incisor" },
  { fdiNumber: "43", quadrant: 4, position: 3, name: "Canine", type: "canine" },
  { fdiNumber: "44", quadrant: 4, position: 4, name: "1st Premolar", type: "premolar" },
  { fdiNumber: "45", quadrant: 4, position: 5, name: "2nd Premolar", type: "premolar" },
  { fdiNumber: "46", quadrant: 4, position: 6, name: "1st Molar", type: "molar" },
  { fdiNumber: "47", quadrant: 4, position: 7, name: "2nd Molar", type: "molar" },
  { fdiNumber: "48", quadrant: 4, position: 8, name: "3rd Molar", type: "molar" },
]

// Mock API service that simulates AI analysis
export class MockAnalysisService {
  // 生成基于文件内容的确定性哈希值
  private static generateFileHash(input: string): number {
    let hash = 0
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32bit integer
    }
    return Math.abs(hash)
  }
  static async analyzeModels(
    upperJawFile: File,
    lowerJawFile: File,
    restorationFile: File,
    toothPosition: string,
  ): Promise<AnalysisResult> {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 基于文件内容生成确定性的ID和日期，避免水合错误
    const fileHash = this.generateFileHash(upperJawFile.name + lowerJawFile.name + restorationFile.name + toothPosition)
    const submissionId = `sub_${fileHash.toString(36).substr(0, 9)}`
    const analysisDate = new Date().toISOString()

    // 基于文件内容生成确定性的评分，避免水合错误
    const scores = {
      marginalFit: Math.floor((fileHash % 5) + 15), // 15-20
      axialContour: Math.floor((fileHash % 6) + 14), // 14-19
      proximalContact: Math.floor((fileHash % 4) + 17), // 17-20
      occlusalRelationship: Math.floor(((fileHash * 3) % 5) + 16), // 16-20
      structuralAesthetics: Math.floor(((fileHash * 7) % 6) + 15), // 15-20
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
          dimension: "Marginal Fit",
          score: scores.marginalFit,
          maxScore: 20,
          criteria: "The margin should be a continuous, sealed interface with no gaps or ledges.",
          reason:
            scores.marginalFit >= 18
              ? "Excellent marginal seal achieved with consistent adaptation."
              : scores.marginalFit >= 16
                ? "Good marginal fit with minor areas requiring attention."
                : "Minor open margin detected. Consider refining the preparation margins.",
        },
        {
          dimension: "Axial Contour",
          score: scores.axialContour,
          maxScore: 20,
          criteria:
            "The axial surfaces should be flat or slightly convex, emerging from the margin at the correct angle.",
          reason:
            scores.axialContour >= 18
              ? "Ideal axial contours that support optimal gingival health."
              : scores.axialContour >= 16
                ? "Good axial contour with room for minor refinement."
                : "Some surfaces are over-contoured, which may impact gingival health.",
        },
        {
          dimension: "Proximal Contact",
          score: scores.proximalContact,
          maxScore: 20,
          criteria: "Contacts should be broad, correctly positioned, and have appropriate tightness.",
          reason:
            scores.proximalContact >= 19
              ? "Excellent contact points with ideal positioning and tightness."
              : scores.proximalContact >= 17
                ? "Good contact relationships with minor adjustments needed."
                : "Contact points require refinement for optimal function.",
        },
        {
          dimension: "Occlusal Relationship",
          score: scores.occlusalRelationship,
          maxScore: 20,
          criteria:
            "The restoration should have stable centric stops and allow for non-interfering excursive movements.",
          reason:
            scores.occlusalRelationship >= 18
              ? "Well-defined centric stops with no interferences detected."
              : scores.occlusalRelationship >= 16
                ? "Good occlusal relationship with minor contact adjustments needed."
                : "Some occlusal interferences detected that may require adjustment.",
        },
        {
          dimension: "Structural Aesthetics",
          score: scores.structuralAesthetics,
          maxScore: 20,
          criteria:
            "Anatomy, such as cusps, fossae, and grooves, should be natural and well-defined. The shade and texture should match adjacent teeth.",
          reason:
            scores.structuralAesthetics >= 18
              ? "Excellent anatomical reproduction with natural-looking surface details."
              : scores.structuralAesthetics >= 16
                ? "Good anatomical form with room for enhanced surface detailing."
                : "Primary anatomy is adequate, but secondary grooves could be more defined.",
        },
      ],
    }

    return mockResult
  }

  private static generateSummary(overallScore: number, scores: any): string {
    if (overallScore >= 90) {
      return "Outstanding restoration work! All aspects demonstrate excellent technical skill and attention to detail."
    } else if (overallScore >= 80) {
      return "Very competent restoration. Most aspects are well-executed with minor areas for improvement."
    } else if (overallScore >= 70) {
      return "Good restoration with solid fundamentals. Focus on refining specific areas for enhanced quality."
    } else {
      return "Adequate restoration that would benefit from attention to key technical aspects for improvement."
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
