import Image from 'next/image'

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-card/70 backdrop-blur">
      <div className="mx-auto flex max-w-2xl items-center gap-3 px-4 py-4">
        <div className="flex size-11 items-center justify-center rounded-2xl bg-accent p-1.5">
          <Image
            src="/chefmatch-logo.png"
            alt="Logo de ChefMatch AI"
            width={44}
            height={44}
            className="size-full object-contain"
            priority
          />
        </div>
        <div>
          <p className="font-heading text-sm font-bold leading-none text-primary">ChefMatch AI</p>
          <h1 className="mt-0.5 font-heading text-lg font-extrabold leading-tight text-foreground sm:text-xl">
            ¿Qué hay en tu heladera?
          </h1>
        </div>
      </div>
    </header>
  )
}
