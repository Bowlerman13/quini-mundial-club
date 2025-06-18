"use client"

interface PullToRefreshIndicatorProps {
  isVisible: boolean
  pullDistance: number
  isRefreshing: boolean
  progress: number
}

export function PullToRefreshIndicator({
  isVisible,
  pullDistance,
  isRefreshing,
  progress,
}: PullToRefreshIndicatorProps) {
  if (!isVisible && !isRefreshing) return null

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-center bg-gradient-to-b from-yellow-500 to-amber-500 text-white transition-all duration-200 ease-out"
      style={{
        height: isRefreshing ? "60px" : `${Math.min(pullDistance, 60)}px`,
        transform: isRefreshing ? "translateY(0)" : `translateY(${Math.min(pullDistance - 60, 0)}px)`,
      }}
    >
      <div className="flex items-center gap-3">
        {isRefreshing ? (
          <>
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
            <span className="font-semibold">🔄 Actualizando resultados...</span>
          </>
        ) : (
          <>
            <div
              className="w-6 h-6 border-2 border-white rounded-full flex items-center justify-center transition-transform duration-200"
              style={{
                transform: `rotate(${progress * 180}deg)`,
              }}
            >
              <div className="w-2 h-2 bg-white rounded-full" />
            </div>
            <span className="font-semibold">
              {progress >= 1 ? "🚀 Suelta para actualizar" : "⬇️ Desliza para actualizar"}
            </span>
          </>
        )}
      </div>
    </div>
  )
}
