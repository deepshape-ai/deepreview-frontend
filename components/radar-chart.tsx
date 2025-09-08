"use client"

interface RadarChartProps {
  data: Array<{
    dimension: string
    score: number
    maxScore: number
  }>
  size?: number
}

export function RadarChart({ data, size = 200 }: RadarChartProps) {
  const center = size / 2
  const radius = size * 0.35
  const angleStep = (2 * Math.PI) / data.length

  // Calculate points for the score polygon
  const scorePoints = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2 // Start from top
    const percentage = item.score / item.maxScore
    const distance = radius * percentage
    return {
      x: center + distance * Math.cos(angle),
      y: center + distance * Math.sin(angle),
    }
  })

  // Calculate points for the max score polygon (outer boundary)
  const maxPoints = data.map((_, index) => {
    const angle = index * angleStep - Math.PI / 2
    return {
      x: center + radius * Math.cos(angle),
      y: center + radius * Math.sin(angle),
    }
  })

  // Calculate label positions
  const labelPoints = data.map((item, index) => {
    const angle = index * angleStep - Math.PI / 2
    const labelDistance = radius * 1.2
    return {
      x: center + labelDistance * Math.cos(angle),
      y: center + labelDistance * Math.sin(angle),
      text: item.dimension,
      score: `${item.score}/${item.maxScore}`,
    }
  })

  return (
    <div className="flex items-center justify-center">
      <svg width={size} height={size} className="overflow-visible">
        {/* Grid circles */}
        {[0.2, 0.4, 0.6, 0.8, 1.0].map((scale) => (
          <circle key={scale} cx={center} cy={center} r={radius * scale} fill="none" stroke="#e5e7eb" strokeWidth="1" />
        ))}

        {/* Grid lines */}
        {maxPoints.map((point, index) => (
          <line key={index} x1={center} y1={center} x2={point.x} y2={point.y} stroke="#e5e7eb" strokeWidth="1" />
        ))}

        {/* Score polygon */}
        <polygon
          points={scorePoints.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="rgba(59, 130, 246, 0.3)"
          stroke="#3b82f6"
          strokeWidth="2"
        />

        {/* Score points */}
        {scorePoints.map((point, index) => (
          <circle key={index} cx={point.x} cy={point.y} r="3" fill="#3b82f6" />
        ))}

        {/* Labels */}
        {labelPoints.map((label, index) => (
          <g key={index}>
            <text
              x={label.x}
              y={label.y - 5}
              textAnchor="middle"
              className="text-xs font-medium fill-current"
              dominantBaseline="middle"
            >
              {label.text}
            </text>
            <text
              x={label.x}
              y={label.y + 8}
              textAnchor="middle"
              className="text-xs fill-muted-foreground"
              dominantBaseline="middle"
            >
              {label.score}
            </text>
          </g>
        ))}
      </svg>
    </div>
  )
}
