'use client'

import { useState } from 'react'
import { Clock, Flame, Search, Salad, GraduationCap, Sprout } from 'lucide-react'
import { IngredientInput } from './ingredient-input'
import { ResultsSection } from './results-section'

export interface SearchCriteria {
  ingredients: string[]
  maxTime: number
  maxCalories: number
  restrictions: string[]
  level: string
}

const RESTRICTIONS = [
  { id: 'sin_gluten', label: 'Sin gluten' },
  { id: 'sin_lactosa', label: 'Sin lactosa' },
  { id: 'vegetariano', label: 'Vegetariano' },
  { id: 'vegano', label: 'Vegano' },
  { id: 'sin_frutos_secos', label: 'Sin frutos secos' },
]

const LEVELS = [
  { id: 'principiante', label: 'Principiante' },
  { id: 'intermedio', label: 'Intermedio' },
  { id: 'avanzado', label: 'Avanzado' },
]

export function RecipeFinder() {
  const [ingredients, setIngredients] = useState<string[]>([])
  const [maxTime, setMaxTime] = useState(45)
  const [maxCalories, setMaxCalories] = useState(600)
  const [restrictions, setRestrictions] = useState<string[]>([])
  const [level, setLevel] = useState('principiante')
  const [criteria, setCriteria] = useState<SearchCriteria | null>(null)

  function toggleRestriction(id: string) {
    setRestrictions((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id],
    )
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setCriteria({ ingredients, maxTime, maxCalories, restrictions, level })
  }

  return (
    <div className="mx-auto max-w-2xl px-4 pb-16">
      <form
        onSubmit={handleSubmit}
        className="rounded-3xl border border-border bg-card p-5 shadow-sm sm:p-7"
      >
        {/* Ingredientes */}
        <div className="mb-6">
          <label className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-foreground">
            <Salad className="size-4 text-primary" />
            Ingredientes
          </label>
          <IngredientInput ingredients={ingredients} onChange={setIngredients} />
        </div>

        {/* Tiempo máximo */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="max-time"
              className="flex items-center gap-2 font-heading text-sm font-bold text-foreground"
            >
              <Clock className="size-4 text-primary" />
              Tiempo máximo
            </label>
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
              {maxTime} min
            </span>
          </div>
          <input
            id="max-time"
            type="range"
            min={5}
            max={240}
            step={5}
            value={maxTime}
            onChange={(e) => setMaxTime(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>5 min</span>
            <span>240 min</span>
          </div>
        </div>

        {/* Calorías máximas */}
        <div className="mb-6">
          <div className="mb-2 flex items-center justify-between">
            <label
              htmlFor="max-calories"
              className="flex items-center gap-2 font-heading text-sm font-bold text-foreground"
            >
              <Flame className="size-4 text-primary" />
              Calorías máximas
            </label>
            <span className="rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
              {maxCalories} kcal
            </span>
          </div>
          <input
            id="max-calories"
            type="range"
            min={100}
            max={2000}
            step={50}
            value={maxCalories}
            onChange={(e) => setMaxCalories(Number(e.target.value))}
            className="w-full accent-primary"
          />
          <div className="mt-1 flex justify-between text-xs text-muted-foreground">
            <span>100 kcal</span>
            <span>2000 kcal</span>
          </div>
        </div>

        {/* Restricciones */}
        <fieldset className="mb-6">
          <legend className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-foreground">
            <Sprout className="size-4 text-primary" />
            Restricciones alimentarias
          </legend>
          <div className="flex flex-wrap gap-2">
            {RESTRICTIONS.map((r) => {
              const active = restrictions.includes(r.id)
              return (
                <button
                  key={r.id}
                  type="button"
                  onClick={() => toggleRestriction(r.id)}
                  aria-pressed={active}
                  className={
                    'rounded-full border px-3.5 py-1.5 text-sm font-semibold transition-colors ' +
                    (active
                      ? 'border-secondary bg-secondary text-secondary-foreground'
                      : 'border-border bg-card text-foreground hover:border-secondary/60 hover:bg-secondary/10')
                  }
                >
                  {r.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        {/* Nivel */}
        <fieldset className="mb-7">
          <legend className="mb-2 flex items-center gap-2 font-heading text-sm font-bold text-foreground">
            <GraduationCap className="size-4 text-primary" />
            Nivel de cocina
          </legend>
          <div className="grid grid-cols-3 gap-2">
            {LEVELS.map((l) => {
              const active = level === l.id
              return (
                <button
                  key={l.id}
                  type="button"
                  onClick={() => setLevel(l.id)}
                  aria-pressed={active}
                  className={
                    'rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ' +
                    (active
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-card text-foreground hover:border-primary/60 hover:bg-primary/10')
                  }
                >
                  {l.label}
                </button>
              )
            })}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={ingredients.length === 0}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3.5 font-heading text-base font-bold text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <Search className="size-5" />
          Buscar recetas
        </button>
      </form>

      <ResultsSection criteria={criteria} />
    </div>
  )
}
