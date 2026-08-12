'use client'

import { UtensilsCrossed, Clock, Flame, ChefHat } from 'lucide-react'
import type { SearchCriteria } from './recipe-finder'

interface ResultsSectionProps {
  criteria: SearchCriteria | null
}

const restrictionLabels: Record<string, string> = {
  sin_gluten: 'Sin gluten',
  sin_lactosa: 'Sin lactosa',
  vegetariano: 'Vegetariano',
  vegano: 'Vegano',
  sin_frutos_secos: 'Sin frutos secos',
}

const levelLabels: Record<string, string> = {
  principiante: 'Principiante',
  intermedio: 'Intermedio',
  avanzado: 'Avanzado',
}

export function ResultsSection({ criteria }: ResultsSectionProps) {
  return (
    <section aria-labelledby="results-title" className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <UtensilsCrossed className="size-5 text-primary" />
        <h2 id="results-title" className="font-heading text-xl font-bold text-foreground">
          Resultados
        </h2>
      </div>

      {!criteria ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-full bg-accent">
            <ChefHat className="size-7 text-accent-foreground" />
          </div>
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            Todavía no hay recetas
          </h3>
          <p className="mt-1 max-w-sm text-pretty text-sm text-muted-foreground">
            Cargá los ingredientes que tenés en tu heladera y ajustá los filtros. Cuando busques,
            tus recetas aparecerán acá.
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-border bg-card p-6">
          <p className="text-sm font-semibold text-foreground">
            Buscando recetas con tu criterio:
          </p>
          <div className="mt-4 flex flex-wrap gap-2 text-sm">
            {criteria.ingredients.length > 0 &&
              criteria.ingredients.map((i) => (
                <span
                  key={i}
                  className="rounded-lg bg-accent px-2.5 py-1 font-semibold text-accent-foreground"
                >
                  {i}
                </span>
              ))}
          </div>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5">
              <Clock className="size-4 text-primary" />
              <span className="text-sm text-foreground">
                Hasta <strong>{criteria.maxTime} min</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5">
              <Flame className="size-4 text-primary" />
              <span className="text-sm text-foreground">
                Hasta <strong>{criteria.maxCalories} kcal</strong>
              </span>
            </div>
            <div className="flex items-center gap-2 rounded-xl bg-muted px-3 py-2.5">
              <ChefHat className="size-4 text-primary" />
              <span className="text-sm text-foreground">{levelLabels[criteria.level]}</span>
            </div>
          </div>
          {criteria.restrictions.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {criteria.restrictions.map((r) => (
                <span
                  key={r}
                  className="rounded-full border border-secondary/40 bg-secondary/10 px-3 py-1 text-xs font-semibold text-secondary"
                >
                  {restrictionLabels[r]}
                </span>
              ))}
            </div>
          )}
          <p className="mt-6 text-pretty text-sm text-muted-foreground">
            Conectá un servicio de recetas o una IA para completar esta sección con resultados
            reales.
          </p>
        </div>
      )}
    </section>
  )
}
