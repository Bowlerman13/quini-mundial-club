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
      const newValue = value + 1
      console.log(`${label}: Incrementando de ${value} a ${newValue}`)
      onChange(newValue)
    }
  }

  const decrement = () => {
    if (value > 0 && !disabled) {
      const newValue = value - 1
      console.log(`${label}: Decrementando de ${value} a ${newValue}`)
      onChange(newValue)
    }
  }

  // Asegurar que value sea un número válido
  const displayValue = typeof value === "number" ? value : 0

  return (
    <div className={`flex flex-col items-center space-y-3 p-2 ${disabled ? "opacity-50" : ""}`}>
      <div className="text-xs font-medium text-center text-gray-600">{label}</div>
      <div className="text-xs text-center text-gray-500 max-w-20 truncate">{teamName}</div>

      {/* Botón + */}
      <Button
        type="button"
        variant="outline"
        className={`w-12 h-12 rounded-full text-2xl font-bold border-2 ${
          disabled
            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-blue-500 hover:bg-blue-50 active:bg-blue-100"
        }`}
        onClick={increment}
        disabled={disabled || displayValue >= 20}
      >
        +
      </Button>

      {/* Número actual */}
      <div
        className={`w-16 h-16 flex items-center justify-center border-4 rounded-xl ${
          disabled ? "bg-gray-100 border-gray-300" : "bg-yellow-100 border-yellow-500"
        }`}
      >
        <span className={`text-3xl font-bold ${disabled ? "text-gray-400" : "text-yellow-800"}`}>{displayValue}</span>
      </div>

      {/* Botón - */}
      <Button
        type="button"
        variant="outline"
        className={`w-12 h-12 rounded-full text-2xl font-bold border-2 ${
          disabled
            ? "border-gray-300 bg-gray-100 text-gray-400 cursor-not-allowed"
            : "border-red-500 hover:bg-red-50 active:bg-red-100"
        }`}
        onClick={decrement}
        disabled={disabled || displayValue <= 0}
      >
        -
      </Button>
    </div>
  )
}
