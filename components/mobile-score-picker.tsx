"use client"

import { Button } from "@/components/ui/button"

interface MobileScorePickerProps {
  value: number
  onChange: (value: number) => void
  disabled?: boolean
  label: string
  teamName: string
}

export function MobileScorePicker({ value, onChange, disabled = false, label, teamName }: MobileScorePickerProps) {
  const increment = () => {
    if (value < 20 && !disabled) {
      onChange(value + 1)
    }
  }

  const decrement = () => {
    if (value > 0 && !disabled) {
      onChange(value - 1)
    }
  }

  return (
    <div className="flex flex-col items-center space-y-3 p-2">
      <div className="text-xs font-medium text-center text-gray-600">{label}</div>
      <div className="text-xs text-center text-gray-500 max-w-20 truncate">{teamName}</div>

      {/* Botón + */}
      <Button
        type="button"
        variant="outline"
        className="w-12 h-12 rounded-full text-2xl font-bold border-2 border-blue-500 hover:bg-blue-50 active:bg-blue-100 disabled:opacity-50"
        onClick={increment}
        disabled={disabled || value >= 20}
      >
        +
      </Button>

      {/* Número actual */}
      <div className="w-16 h-16 flex items-center justify-center bg-yellow-100 border-4 border-yellow-500 rounded-xl">
        <span className="text-3xl font-bold text-yellow-800">{value}</span>
      </div>

      {/* Botón - */}
      <Button
        type="button"
        variant="outline"
        className="w-12 h-12 rounded-full text-2xl font-bold border-2 border-red-500 hover:bg-red-50 active:bg-red-100 disabled:opacity-50"
        onClick={decrement}
        disabled={disabled || value <= 0}
      >
        -
      </Button>
    </div>
  )
}
