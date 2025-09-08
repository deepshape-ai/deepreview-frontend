"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FDI_TOOTH_POSITIONS, type ToothPosition } from "@/lib/mock-api"

interface ToothPositionSelectorProps {
  selectedPosition: string | null
  onPositionSelect: (position: string) => void
}

export function ToothPositionSelector({ selectedPosition, onPositionSelect }: ToothPositionSelectorProps) {
  const [pendingSelection, setPendingSelection] = useState<string | null>(null)

  const getToothTypeColor = (type: ToothPosition["type"]) => {
    switch (type) {
      case "incisor":
        return "bg-blue-100 text-blue-800 hover:bg-blue-200"
      case "canine":
        return "bg-green-100 text-green-800 hover:bg-green-200"
      case "premolar":
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
      case "molar":
        return "bg-purple-100 text-purple-800 hover:bg-purple-200"
    }
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

  const handleToothClick = (fdiNumber: string) => {
    setPendingSelection(fdiNumber)
  }

  const confirmSelection = () => {
    if (pendingSelection) {
      onPositionSelect(pendingSelection)
      setPendingSelection(null)
    }
  }

  const cancelSelection = () => {
    setPendingSelection(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>选择牙齿位置</CardTitle>
        <CardDescription>点击选择修复体的FDI位置，然后确认选择</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          {/* Upper Arch */}
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-center text-muted-foreground">上颌</h4>
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {/* Upper Right (reversed for visual layout) */}
                {upperRight.reverse().map((tooth) => (
                  <Button
                    key={tooth.fdiNumber}
                    variant={
                      selectedPosition === tooth.fdiNumber
                        ? "default"
                        : pendingSelection === tooth.fdiNumber
                          ? "secondary"
                          : "outline"
                    }
                    onClick={() => handleToothClick(tooth.fdiNumber)}
                    className={`h-12 w-12 p-1 flex flex-col items-center justify-center text-xs ${
                      selectedPosition !== tooth.fdiNumber && pendingSelection !== tooth.fdiNumber
                        ? getToothTypeColor(tooth.type)
                        : ""
                    }`}
                  >
                    <span className="font-bold">{tooth.fdiNumber}</span>
                  </Button>
                ))}
                <div className="w-2"></div> {/* Midline gap */}
                {/* Upper Left */}
                {upperLeft.map((tooth) => (
                  <Button
                    key={tooth.fdiNumber}
                    variant={
                      selectedPosition === tooth.fdiNumber
                        ? "default"
                        : pendingSelection === tooth.fdiNumber
                          ? "secondary"
                          : "outline"
                    }
                    onClick={() => handleToothClick(tooth.fdiNumber)}
                    className={`h-12 w-12 p-1 flex flex-col items-center justify-center text-xs ${
                      selectedPosition !== tooth.fdiNumber && pendingSelection !== tooth.fdiNumber
                        ? getToothTypeColor(tooth.type)
                        : ""
                    }`}
                  >
                    <span className="font-bold">{tooth.fdiNumber}</span>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Lower Arch */}
          <div className="space-y-2">
            <div className="flex justify-center">
              <div className="flex space-x-1">
                {/* Lower Right */}
                {lowerRight.map((tooth) => (
                  <Button
                    key={tooth.fdiNumber}
                    variant={
                      selectedPosition === tooth.fdiNumber
                        ? "default"
                        : pendingSelection === tooth.fdiNumber
                          ? "secondary"
                          : "outline"
                    }
                    onClick={() => handleToothClick(tooth.fdiNumber)}
                    className={`h-12 w-12 p-1 flex flex-col items-center justify-center text-xs ${
                      selectedPosition !== tooth.fdiNumber && pendingSelection !== tooth.fdiNumber
                        ? getToothTypeColor(tooth.type)
                        : ""
                    }`}
                  >
                    <span className="font-bold">{tooth.fdiNumber}</span>
                  </Button>
                ))}
                <div className="w-2"></div> {/* Midline gap */}
                {/* Lower Left (reversed for visual layout) */}
                {lowerLeft.reverse().map((tooth) => (
                  <Button
                    key={tooth.fdiNumber}
                    variant={
                      selectedPosition === tooth.fdiNumber
                        ? "default"
                        : pendingSelection === tooth.fdiNumber
                          ? "secondary"
                          : "outline"
                    }
                    onClick={() => handleToothClick(tooth.fdiNumber)}
                    className={`h-12 w-12 p-1 flex flex-col items-center justify-center text-xs ${
                      selectedPosition !== tooth.fdiNumber && pendingSelection !== tooth.fdiNumber
                        ? getToothTypeColor(tooth.type)
                        : ""
                    }`}
                  >
                    <span className="font-bold">{tooth.fdiNumber}</span>
                  </Button>
                ))}
              </div>
            </div>
            <h4 className="text-sm font-medium text-center text-muted-foreground">下颌</h4>
          </div>
        </div>

        {pendingSelection && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">确认选择：</span>
                <Badge variant="secondary" className="ml-2">
                  {pendingSelection} - {FDI_TOOTH_POSITIONS.find((t) => t.fdiNumber === pendingSelection)?.name}
                </Badge>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" onClick={confirmSelection}>
                  确认
                </Button>
                <Button variant="outline" size="sm" onClick={cancelSelection}>
                  取消
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Selected Position Display */}
        {selectedPosition && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-semibold">已选择：</span>
                <Badge variant="secondary" className="ml-2">
                  {selectedPosition} - {FDI_TOOTH_POSITIONS.find((t) => t.fdiNumber === selectedPosition)?.name}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  onPositionSelect("")
                  setPendingSelection(null)
                }}
              >
                清除
              </Button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap justify-center gap-2 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-100 rounded"></div>
            <span>切牙</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-100 rounded"></div>
            <span>尖牙</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-100 rounded"></div>
            <span>前磨牙</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-purple-100 rounded"></div>
            <span>磨牙</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
