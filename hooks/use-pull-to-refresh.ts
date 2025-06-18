"use client"

import { useState, useEffect, useCallback } from "react"

interface UsePullToRefreshOptions {
  onRefresh: () => Promise<void>
  threshold?: number
  resistance?: number
}

export function usePullToRefresh({ onRefresh, threshold = 80, resistance = 2.5 }: UsePullToRefreshOptions) {
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const [startY, setStartY] = useState(0)
  const [isPulling, setIsPulling] = useState(false)

  const handleTouchStart = useCallback((e: TouchEvent) => {
    // Solo activar si estamos en la parte superior de la página
    if (window.scrollY === 0) {
      setStartY(e.touches[0].clientY)
      setIsPulling(true)
    }
  }, [])

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!isPulling || isRefreshing) return

      const currentY = e.touches[0].clientY
      const distance = Math.max(0, (currentY - startY) / resistance)

      if (distance > 0 && window.scrollY === 0) {
        e.preventDefault()
        setPullDistance(Math.min(distance, threshold * 1.5))
      }
    },
    [isPulling, isRefreshing, startY, threshold, resistance],
  )

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return

    setIsPulling(false)

    if (pullDistance >= threshold && !isRefreshing) {
      setIsRefreshing(true)
      try {
        await onRefresh()
      } catch (error) {
        console.error("Error during refresh:", error)
      } finally {
        setIsRefreshing(false)
      }
    }

    setPullDistance(0)
  }, [isPulling, pullDistance, threshold, isRefreshing, onRefresh])

  useEffect(() => {
    const handleTouchStartPassive = (e: TouchEvent) => handleTouchStart(e)
    const handleTouchMovePassive = (e: TouchEvent) => handleTouchMove(e)
    const handleTouchEndPassive = () => handleTouchEnd()

    document.addEventListener("touchstart", handleTouchStartPassive, { passive: true })
    document.addEventListener("touchmove", handleTouchMovePassive, { passive: false })
    document.addEventListener("touchend", handleTouchEndPassive, { passive: true })

    return () => {
      document.removeEventListener("touchstart", handleTouchStartPassive)
      document.removeEventListener("touchmove", handleTouchMovePassive)
      document.removeEventListener("touchend", handleTouchEndPassive)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return {
    isRefreshing,
    pullDistance,
    isPulling: isPulling && pullDistance > 0,
    refreshProgress: Math.min(pullDistance / threshold, 1),
  }
}
