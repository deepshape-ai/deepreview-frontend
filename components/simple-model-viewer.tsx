"use client"
import { Card, CardContent } from "@/components/ui/card"

interface SimpleModelViewerProps {
  modelUrl?: string
  className?: string
  title?: string
}

// Simplified 3D viewer for cases where full Three.js isn't needed
export function SimpleModelViewer({ modelUrl, className, title }: SimpleModelViewerProps) {
  return (
    <Card className={className}>
      <CardContent className="p-4">
        <div className="w-full h-48 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-black/30">
          <div className="text-center">
            <div className="w-16 h-16 bg-white border border-black/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <svg
                className="w-8 h-8 text-black"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                />
              </svg>
            </div>
            <p className="text-sm font-medium text-black">{title || "3D Model"}</p>
            <p className="text-xs text-gray-600">Interactive viewer</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
