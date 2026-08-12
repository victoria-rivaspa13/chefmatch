'use client'

import { useState } from 'react'
import { X, Plus } from 'lucide-react'

interface IngredientInputProps {
  ingredients: string[]
  onChange: (ingredients: string[]) => void
}

export function IngredientInput({ ingredients, onChange }: IngredientInputProps) {
  const [value, setValue] = useState('')

  function addIngredient() {
    const trimmed = value.trim().toLowerCase()
    if (!trimmed) return
    if (!ingredients.includes(trimmed)) {
      onChange([...ingredients, trimmed])
    }
    setValue('')
  }

  function removeIngredient(item: string) {
    onChange(ingredients.filter((i) => i !== item))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.nativeEvent.isComposing || e.keyCode === 229) return
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addIngredient()
    } else if (e.key === 'Backspace' && !value && ingredients.length > 0) {
      removeIngredient(ingredients[ingredients.length - 1])
    }
  }

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2 rounded-xl border border-input bg-card p-2 focus-within:ring-2 focus-within:ring-ring/60">
        {ingredients.map((item) => (
          <span
            key={item}
            className="inline-flex items-center gap-1.5 rounded-lg bg-accent px-2.5 py-1 text-sm font-semibold text-accent-foreground"
          >
            {item}
            <button
              type="button"
              onClick={() => removeIngredient(item)}
              className="rounded-full p-0.5 text-accent-foreground/70 transition-colors hover:bg-accent-foreground/10 hover:text-accent-foreground"
              aria-label={`Quitar ${item}`}
            >
              <X className="size-3.5" />
            </button>
          </span>
        ))}
        <div className="flex min-w-[8rem] flex-1 items-center gap-1">
          <input
            type="text"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={addIngredient}
            placeholder={ingredients.length ? 'Agregar otro…' : 'Ej: tomate, huevo, arroz…'}
            className="w-full bg-transparent px-1.5 py-1 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            aria-label="Agregar ingrediente"
          />
          {value.trim() && (
            <button
              type="button"
              onClick={addIngredient}
              className="rounded-md p-1 text-primary transition-colors hover:bg-primary/10"
              aria-label="Agregar ingrediente"
            >
              <Plus className="size-4" />
            </button>
          )}
        </div>
      </div>
      <p className="mt-1.5 text-xs text-muted-foreground">
        Escribí un ingrediente y presioná Enter para agregarlo.
      </p>
    </div>
  )
}
