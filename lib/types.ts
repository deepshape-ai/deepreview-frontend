export interface AnalysisResult {
  submissionId: string
  analysisDate: string
  overallScore: number
  summary: string
  models: {
    upperJawUrl: string
    lowerJawUrl: string
    restorationUrl: string
  }
  toothPosition: string // FDI number
  detailedScores: DetailedScore[]
}

export interface DetailedScore {
  dimension: string
  score: number
  maxScore: number
  criteria: string
  reason: string
}

export interface UploadedFile {
  file: File
  url: string
}

export interface ToothPosition {
  fdiNumber: string
  quadrant: number
  position: number
  name: string
  type: "incisor" | "canine" | "premolar" | "molar"
}
