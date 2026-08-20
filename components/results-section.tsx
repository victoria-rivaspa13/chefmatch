'use client'

import { useEffect, useState } from 'react'
import { UtensilsCrossed, Clock, Flame, ChefHat, Loader2, AlertCircle, SearchX } from 'lucide-react'
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

// --- Forma de la respuesta del motor (contrato n8n) ---
interface Factores {
  coberturaIngredientes: number
  ajusteTiempo: number
  ajusteCalorico: number
  dificultad: number
  variedadNutricional: number
}

interface Desglose {
  factores: Factores
  fortalezas: string[]
  consideraciones: string[]
  faltantes: string[]
  reasoning: string
}

interface Resultado {
  recetaId: string
  titulo: string
  imagenUrl: string
  fuenteUrl: string
  tiempoMin: number
  caloriasEstimadas: number
  score: number
  desglose: Desglose
}

interface ChefMatchResponse {
  requestId: string
  resultados: Resultado[]
  errores?: { codigo: string; mensaje: string; detalle?: unknown }[]
}

type Status = 'idle' | 'loading' | 'success' | 'empty' | 'error'

export function ResultsSection({ criteria }: ResultsSectionProps) {
  const [status, setStatus] = useState<Status>('idle')
  const [resultados, setResultados] = useState<Resultado[]>([])
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    if (!criteria) return

    const controller = new AbortController()

    async function buscarRecetas() {
      setStatus('loading')
      setErrorMsg(null)

      // --- Traducción: nombres internos (inglés) -> contrato del backend (español) ---
      const body = {
        ingredientes: criteria.ingredients,
        tiempoMaxMin: criteria.maxTime,
        caloriasMax: criteria.maxCalories,
        restricciones: criteria.restrictions,
        preferencias: { nivel: criteria.level },
      }

      try {
        const response = await fetch(process.env.NEXT_PUBLIC_CHEFMATCH_API_URL!, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-ChefMatch-Key': process.env.NEXT_PUBLIC_CHEFMATCH_API_KEY!,
          },
          body: JSON.stringify(body),
          signal: controller.signal,
        })

        const data: ChefMatchResponse = await response.json()

        if (!response.ok) {
          const mensaje = data.errores?.[0]?.mensaje || 'Ocurrió un error al buscar recetas.'
          setErrorMsg(mensaje)
          setStatus('error')
          return
        }

        if (!data.resultados || data.resultados.length === 0) {
          setStatus('empty')
          return
        }

        setResultados(data.resultados)
        setStatus('success')
      } catch (err) {
        if (controller.signal.aborted) return
        setErrorMsg('No pudimos conectar con el servidor. Probá de nuevo.')
        setStatus('error')
      }
    }

    buscarRecetas()

    return () => controller.abort()
  }, [criteria])

  return (
    <section aria-labelledby="results-title" className="mt-10">
      <div className="mb-4 flex items-center gap-2">
        <UtensilsCrossed className="size-5 text-primary" />
        <h2 id="results-title" className="font-heading text-xl font-bold text-foreground">
          Resultados
        </h2>
      </div>

      {/* Estado inicial: todavía no se buscó nada */}
      {status === 'idle' && (
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
      )}

      {/* Estado: cargando */}
      {status === 'loading' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-card px-6 py-16 text-center">
          <Loader2 className="size-8 animate-spin text-primary" />
          <p className="mt-4 text-sm font-semibold text-foreground">Buscando tus recetas...</p>
        </div>
      )}

      {/* Estado: error */}
      {status === 'error' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-destructive/30 bg-destructive/5 px-6 py-16 text-center">
          <AlertCircle className="size-8 text-destructive" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No pudimos buscar recetas
          </h3>
          <p className="mt-1 max-w-sm text-pretty text-sm text-muted-foreground">{errorMsg}</p>
        </div>
      )}

      {/* Estado: sin resultados (SIN_RESULTADOS del backend, no es un error) */}
      {status === 'empty' && (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card/60 px-6 py-16 text-center">
          <SearchX className="size-8 text-muted-foreground" />
          <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
            No encontramos recetas
          </h3>
          <p className="mt-1 max-w-sm text-pretty text-sm text-muted-foreground">
            Ninguna receta cumplió con tus filtros. Probá ampliando el tiempo o las calorías.
          </p>
        </div>
      )}

      {/* Estado: resultados */}
      {status === 'success' && (
        <div className="grid gap-4">
          {resultados.map((r) => (
            <div key={r.recetaId} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-heading text-lg font-bold text-foreground">{r.titulo}</h3>
                <span className="shrink-0 rounded-lg bg-primary/10 px-2.5 py-1 text-sm font-bold text-primary">
                  {r.score} pts
                </span>
              </div>
              <div className="mt-2 flex gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="size-4" /> {r.tiempoMin} min
                </span>
                <span className="flex items-center gap-1">
                  <Flame className="size-4" /> {r.caloriasEstimadas} kcal
                </span>
              </div>
              {r.desglose.fortalezas.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-foreground">
                  {r.desglose.fortalezas.map((f, i) => (
                    <li key={i}>✓ {f}</li>
                  ))}
                </ul>
              )}
              {r.desglose.consideraciones.length > 0 && (
                <p className="mt-2 text-sm text-muted-foreground">
                  {r.desglose.consideraciones[0]}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </section>
  )
}