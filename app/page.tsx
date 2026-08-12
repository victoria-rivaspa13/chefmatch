import { SiteHeader } from '@/components/site-header'
import { RecipeFinder } from '@/components/recipe-finder'

export default function Page() {
  return (
    <main className="min-h-dvh bg-background">
      <SiteHeader />
      <div className="mx-auto max-w-2xl px-4 pt-8">
        <p className="text-pretty text-center text-sm leading-relaxed text-muted-foreground sm:text-base">
          Cargá los ingredientes que ya tenés y encontrá recetas ideales según tu tiempo, tus
          calorías, tus restricciones y tu nivel en la cocina.
        </p>
      </div>
      <div className="pt-6">
        <RecipeFinder />
      </div>
    </main>
  )
}
