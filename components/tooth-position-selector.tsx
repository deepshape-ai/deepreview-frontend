"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FDI_TOOTH_POSITIONS, type ToothPosition } from "@/lib/mock-api"

interface ToothPositionSelectorProps {
  selectedPosition: string | null
  onPositionSelect: (position: string) => void
  availableJaws: {
    upper: boolean
    lower: boolean
  }
}

export function ToothPositionSelector({
  selectedPosition,
  onPositionSelect,
  availableJaws,
}: ToothPositionSelectorProps) {
  const getToothTypeColor = (type: ToothPosition["type"]) => {
    return "bg-white text-slate-800 hover:bg-slate-50 border-slate-300"
  }

  const handleToothClick = (fdiNumber: string, quadrant: number) => {
    const isUpperTooth = quadrant === 1 || quadrant === 2
    const isLowerTooth = quadrant === 3 || quadrant === 4

    if ((isUpperTooth && !availableJaws.upper) || (isLowerTooth && !availableJaws.lower)) {
      return
    }

    // Toggle selection logic: if already selected, deselect; otherwise select
    if (selectedPosition === fdiNumber) {
      onPositionSelect("")
    } else {
      onPositionSelect(fdiNumber)
    }
  }

  const isToothDisabled = (quadrant: number) => {
    const isUpperTooth = quadrant === 1 || quadrant === 2
    const isLowerTooth = quadrant === 3 || quadrant === 4
    return (isUpperTooth && !availableJaws.upper) || (isLowerTooth && !availableJaws.lower)
  }

  const upperRight = FDI_TOOTH_POSITIONS.filter((t) => t.quadrant === 1).sort(
    (a, b) => Number.parseInt(a.fdiNumber) - Number.parseInt(b.fdiNumber),
  )
  const upperLeft = FDI_TOOTH_POSITIONS.filter((t) => t.quadrant === 2).sort(
    (a, b) => Number.parseInt(a.fdiNumber) - Number.parseInt(b.fdiNumber),
  )
  const lowerLeft = FDI_TOOTH_POSITIONS.filter((t) => t.quadrant === 3).sort(
    (a, b) => Number.parseInt(b.fdiNumber) - Number.parseInt(a.fdiNumber),
  )
  const lowerRight = FDI_TOOTH_POSITIONS.filter((t) => t.quadrant === 4).sort(
    (a, b) => Number.parseInt(b.fdiNumber) - Number.parseInt(a.fdiNumber),
  )

  return (
    <Card className="border-2 border-slate-200 shadow-md bg-gradient-to-br from-slate-50 to-white">
      <CardHeader className="bg-gradient-to-r from-slate-100 to-slate-50 border-b border-slate-200">
        <CardTitle className="text-xl font-bold text-slate-800">牙齿位置选择</CardTitle>
        <CardDescription className="text-slate-600">点击选择需要修复的牙齿位置（FDI编号系统）</CardDescription>
      </CardHeader>
      <CardContent className="p-6 space-y-8">
        <div className="space-y-6">
          {/* Upper Arch */}
          <div className="space-y-3">
            <div className={`text-center transition-all duration-300 ${!availableJaws.upper ? "opacity-50" : ""}`}>
              <h4 className="text-lg font-semibold text-black mb-2">上颌</h4>
              {!availableJaws.upper && <p className="text-sm text-gray-600 mb-3">请先上传上颌模型</p>}
            </div>
            <div className="flex justify-center">
              <div className="flex items-center space-x-1">
                {/* Upper Right (reversed for visual layout) */}
                {upperRight.reverse().map((tooth) => (
                  <Button
                    key={tooth.fdiNumber}
                    variant={selectedPosition === tooth.fdiNumber ? "default" : "outline"}
                    onClick={() => handleToothClick(tooth.fdiNumber, tooth.quadrant)}
                    disabled={isToothDisabled(tooth.quadrant)}
                    className={`h-14 w-14 p-1 flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 ${
                      selectedPosition === tooth.fdiNumber
                        ? "bg-black text-white shadow-lg scale-110"
                        : isToothDisabled(tooth.quadrant)
                          ? "opacity-30 cursor-not-allowed"
                          : `${getToothTypeColor(tooth.type)} hover:scale-105 shadow-sm`
                    }`}
                  >
                    <span className="text-xs font-bold">{tooth.fdiNumber}</span>
                    <span className="text-[10px] opacity-75">{tooth.position}</span>
                  </Button>
                ))}
                <div className="w-4 border-l-2 border-dashed border-black/30 h-8 mx-2"></div>
                {/* Upper Left */}
                {upperLeft.map((tooth) => (
                  <Button
                    key={tooth.fdiNumber}
                    variant={selectedPosition === tooth.fdiNumber ? "default" : "outline"}
                    onClick={() => handleToothClick(tooth.fdiNumber, tooth.quadrant)}
                    disabled={isToothDisabled(tooth.quadrant)}
                    className={`h-14 w-14 p-1 flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 ${
                      selectedPosition === tooth.fdiNumber
                        ? "bg-black text-white shadow-lg scale-110"
                        : isToothDisabled(tooth.quadrant)
                          ? "opacity-30 cursor-not-allowed"
                          : `${getToothTypeColor(tooth.type)} hover:scale-105 shadow-sm`
                    }`}
                  >
                    <span className="text-xs font-bold">{tooth.fdiNumber}</span>
                    <span className="text-[10px] opacity-75">{tooth.position}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Arch */}
          <div className="space-y-3">
            <div className="flex justify-center">
              <div className="flex items-center space-x-1">
                {/* Lower Right */}
                {lowerRight.map((tooth) => (
                  <Button
                    key={tooth.fdiNumber}
                    variant={selectedPosition === tooth.fdiNumber ? "default" : "outline"}
                    onClick={() => handleToothClick(tooth.fdiNumber, tooth.quadrant)}
                    disabled={isToothDisabled(tooth.quadrant)}
                    className={`h-14 w-14 p-1 flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 ${
                      selectedPosition === tooth.fdiNumber
                        ? "bg-black text-white shadow-lg scale-110"
                        : isToothDisabled(tooth.quadrant)
                          ? "opacity-30 cursor-not-allowed"
                          : `${getToothTypeColor(tooth.type)} hover:scale-105 shadow-sm`
                    }`}
                  >
                    <span className="text-xs font-bold">{tooth.fdiNumber}</span>
                    <span className="text-[10px] opacity-75">{tooth.position}</span>
                  </Button>
                ))}
                <div className="w-4 border-l-2 border-dashed border-black/30 h-8 mx-2"></div>
                {/* Lower Left (reversed for visual layout) */}
                {lowerLeft.reverse().map((tooth) => (
                  <Button
                    key={tooth.fdiNumber}
                    variant={selectedPosition === tooth.fdiNumber ? "default" : "outline"}
                    onClick={() => handleToothClick(tooth.fdiNumber, tooth.quadrant)}
                    disabled={isToothDisabled(tooth.quadrant)}
                    className={`h-14 w-14 p-1 flex flex-col items-center justify-center text-xs font-bold transition-all duration-200 ${
                      selectedPosition === tooth.fdiNumber
                        ? "bg-black text-white shadow-lg scale-110"
                        : isToothDisabled(tooth.quadrant)
                          ? "opacity-30 cursor-not-allowed"
                          : `${getToothTypeColor(tooth.type)} hover:scale-105 shadow-sm`
                    }`}
                  >
                    <span className="text-xs font-bold">{tooth.fdiNumber}</span>
                    <span className="text-[10px] opacity-75">{tooth.position}</span>
                  </Button>
                ))}
              </div>
            </div>
            <div className={`text-center transition-all duration-300 ${!availableJaws.lower ? "opacity-50" : ""}`}>
              <h4 className="text-lg font-semibold text-black mb-2">下颌</h4>
              {!availableJaws.lower && <p className="text-sm text-gray-600">请先上传下颌模型</p>}
            </div>
          </div>
        </div>

        {/* Selected Position Display */}
        {selectedPosition && (
          <div className="p-4 bg-gradient-to-r from-white to-slate-50 border border-slate-200 rounded-lg shadow-sm">
            <div className="flex items-center space-x-3">
              <span className="font-semibold text-slate-800">已选择牙齿：</span>
              <Badge variant="outline" className="border-slate-300 text-slate-800 px-3 py-1">
                {selectedPosition} - {FDI_TOOTH_POSITIONS.find((t) => t.fdiNumber === selectedPosition)?.name}
              </Badge>
              <span className="text-sm text-slate-600">（再次点击可取消选择）</span>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
