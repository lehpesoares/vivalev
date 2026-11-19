import { Heart } from 'lucide-react'

export function Logo({
  size = 'md',
  theme = 'barbie',
}: {
  size?: 'sm' | 'md' | 'lg'
  theme?: 'barbie' | 'emerald'
}) {
  const iconSizes = {
    sm: 'w-5 h-5',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  }

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl',
  }

  if (theme === 'emerald') {
    return (
      <div className="flex items-center gap-2.5 select-none">
        <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-emerald-700 to-emerald-900 p-2 shadow-md text-white">
          <Heart className={iconSizes[size]} />
        </div>
        <div className="flex flex-col">
          <span className={`font-bold tracking-tight text-emerald-950 font-serif ${textSizes[size]}`}>
            Viva<span className="text-emerald-700">Lev</span>
          </span>
          <span className="text-[10px] uppercase tracking-widest font-semibold text-amber-800/80 -mt-1">
            Nutrição & Saúde
          </span>
        </div>
      </div>
    )
  }

  // Tema Barbie / Cor-de-rosa VivaLev
  return (
    <div className="flex items-center gap-2.5 select-none">
      <div className="flex items-center justify-center rounded-2xl bg-gradient-to-tr from-pink-600 via-pink-500 to-rose-400 p-2.5 shadow-md shadow-pink-200 text-white transform hover:rotate-6 transition-transform">
        <Heart className={`${iconSizes[size]} fill-white/30`} />
      </div>
      <div className="flex flex-col">
        <span className={`font-extrabold tracking-tight text-pink-950 font-serif ${textSizes[size]}`}>
          Viva<span className="text-pink-600">Lev</span>
        </span>
        <span className="text-[10px] uppercase tracking-widest font-bold text-pink-500/90 -mt-1">
          Nutrição & Bem-Estar
        </span>
      </div>
    </div>
  )
}
