// Ilustraciones esquemáticas (corte transversal) para los temas emergentes.
// Paleta del logo del Corredor; son decorativas (aria-hidden).

type Motif = 'land' | 'seafloor' | 'chemicals'

function Land() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="la-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a3a66" />
          <stop offset="1" stopColor="#2a6f9e" />
        </linearGradient>
        <linearGradient id="la-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa8c8" />
          <stop offset="1" stopColor="#176f8a" />
        </linearGradient>
        <linearGradient id="la-soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#6b4a3a" />
          <stop offset="1" stopColor="#3b2a22" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#la-sky)" />
      <circle cx="320" cy="58" r="26" fill="#ec8343" opacity="0.95" />
      {/* Sierra y desierto */}
      <path d="M0 120 L60 92 L105 110 L150 84 L210 112 L260 98 L300 116 L400 104 L400 150 L0 150 Z" fill="#b06c93" opacity="0.55" />
      {/* Selva baja / matorral */}
      <path d="M0 140 Q40 124 80 138 T160 136 T240 140 L240 160 L0 160 Z" fill="#3f7a5a" />
      {[18, 46, 74, 102, 130, 158, 186, 214].map((x, i) => (
        <g key={x} transform={`translate(${x} ${136 + (i % 2) * 3})`}>
          <rect x="-1.2" y="0" width="2.4" height="12" fill="#2d4a36" />
          <circle cx="0" cy="-2" r={7 + (i % 3)} fill="#4f9a6a" />
        </g>
      ))}
      {/* Laguna costera y manglar */}
      <rect x="240" y="150" width="160" height="30" fill="url(#la-sea)" />
      {[256, 284, 312, 340].map((x) => (
        <g key={x}>
          <path d={`M${x} 150 q-8 10 -10 22 M${x} 150 q0 12 0 22 M${x} 150 q8 10 10 22`} stroke="#2d4a36" strokeWidth="2" fill="none" />
          <ellipse cx={x} cy="140" rx="13" ry="9" fill="#3f8a5c" />
        </g>
      ))}
      {/* Suelo con carbono almacenado */}
      <rect x="0" y="158" width="400" height="82" fill="url(#la-soil)" />
      <rect x="240" y="178" width="160" height="62" fill="#2a1d18" opacity="0.6" />
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i * 53) % 400} cy={176 + ((i * 29) % 58)} r={1.6 + (i % 3) * 0.6} fill="#e9d8c4" opacity="0.35" />
      ))}
      {/* Flujos: captura (abajo) y emisión (arriba) */}
      <g stroke="#8fd3e6" strokeWidth="2.5" fill="none" strokeLinecap="round">
        <path d="M120 40 L120 112" />
        <path d="M113 104 L120 114 L127 104" />
      </g>
      <g stroke="#f49ba2" strokeWidth="2.5" fill="none" strokeLinecap="round" strokeDasharray="5 5">
        <path d="M190 120 L190 48" />
        <path d="M183 56 L190 46 L197 56" />
      </g>
      <text x="128" y="36" fill="#dbe6f1" fontSize="11" fontFamily="Source Sans 3, sans-serif" fontWeight="600">CO₂ capturado</text>
      <text x="198" y="44" fill="#f8d3d6" fontSize="11" fontFamily="Source Sans 3, sans-serif" fontWeight="600">CO₂ liberado</text>
    </svg>
  )
}

function Seafloor() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="sf-water" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa8c8" />
          <stop offset="0.45" stopColor="#176f8a" />
          <stop offset="1" stopColor="#072a4a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sf-water)" />
      {/* Luz en la superficie */}
      <path d="M0 10 Q50 0 100 10 T200 10 T300 10 T400 10 L400 0 L0 0 Z" fill="#8fd3e6" opacity="0.6" />
      {[40, 120, 230, 330].map((x) => (
        <path key={x} d={`M${x} 0 L${x - 30} 120 L${x + 10} 120 Z`} fill="#ffffff" opacity="0.05" />
      ))}
      {/* Barco arrastrero y red */}
      <path d="M262 14 L330 14 L322 26 L270 26 Z" fill="#ec8343" />
      <rect x="290" y="4" width="4" height="10" fill="#ec8343" />
      <path d="M270 24 L232 186 M322 24 L300 188" stroke="#dbe6f1" strokeWidth="1.2" opacity="0.7" />
      <path d="M226 184 Q265 172 306 186 L298 200 Q262 208 232 198 Z" fill="none" stroke="#dbe6f1" strokeWidth="1.5" opacity="0.85" />
      {/* Peces */}
      {[
        [70, 70],
        [96, 84],
        [150, 60],
      ].map(([x, y]) => (
        <path key={`${x}-${y}`} d={`M${x} ${y} q10 -7 20 0 q-10 7 -20 0 Z M${x + 20} ${y} l7 -5 l0 10 Z`} fill="#dbe6f1" opacity="0.8" />
      ))}
      {/* Fondo intacto (izquierda) con vida bentónica */}
      <path d="M0 196 Q60 186 120 194 T220 198 L220 240 L0 240 Z" fill="#c7a86a" />
      {[14, 40, 64, 92, 118, 146, 176, 202].map((x, i) => (
        <g key={x}>
          {i % 3 === 0 && <path d={`M${x} 194 q-4 -14 0 -26 q4 12 0 26`} fill="#e0665e" />}
          {i % 3 === 1 && <ellipse cx={x} cy="188" rx="7" ry="9" fill="#f49ba2" />}
          {i % 3 === 2 && <path d={`M${x} 194 l-6 -16 M${x} 194 l0 -20 M${x} 194 l6 -16`} stroke="#b06c93" strokeWidth="3" strokeLinecap="round" />}
        </g>
      ))}
      {/* Fondo arrastrado (derecha): plano y con sedimento suspendido */}
      <path d="M220 198 L400 200 L400 240 L220 240 Z" fill="#a8916a" />
      {Array.from({ length: 34 }).map((_, i) => (
        <circle key={i} cx={230 + ((i * 37) % 170)} cy={160 + ((i * 17) % 38)} r={1.5 + (i % 3)} fill="#c7a86a" opacity="0.45" />
      ))}
      {/* Carbono en el sedimento */}
      <rect x="0" y="214" width="400" height="26" fill="#3b2a22" opacity="0.55" />
      <text x="10" y="232" fill="#e9d8c4" fontSize="10.5" fontFamily="Source Sans 3, sans-serif" fontWeight="600">carbono en sedimentos</text>
    </svg>
  )
}

function Chemicals() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ch-bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#0a3a66" />
          <stop offset="1" stopColor="#072a4a" />
        </linearGradient>
        <linearGradient id="ch-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#176f8a" />
          <stop offset="1" stopColor="#0a3a66" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#ch-bg)" />
      {/* Moléculas (anillos hexagonales enlazados) */}
      {[
        [70, 60, 18, '#2fa8c8'],
        [101, 78, 18, '#2fa8c8'],
        [250, 50, 14, '#ec8343'],
        [274, 64, 14, '#ec8343'],
        [330, 96, 12, '#f49ba2'],
      ].map(([x, y, r, c], i) => {
        const pts = Array.from({ length: 6 })
          .map((_, k) => {
            const a = (Math.PI / 3) * k + Math.PI / 6
            return `${(x as number) + (r as number) * Math.cos(a)},${(y as number) + (r as number) * Math.sin(a)}`
          })
          .join(' ')
        return <polygon key={i} points={pts} fill="none" stroke={c as string} strokeWidth="2.5" />
      })}
      <path d="M118 88 L150 104 M150 104 L150 128 M286 72 L306 92" stroke="#dbe6f1" strokeWidth="2" opacity="0.7" />
      <circle cx="150" cy="104" r="5" fill="#e0665e" />
      <circle cx="150" cy="132" r="4" fill="#dbe6f1" />
      <circle cx="306" cy="94" r="4" fill="#b06c93" />
      {/* Valle agrícola y mina */}
      <path d="M0 150 L70 150 L90 132 L130 132 L150 150 L400 150 L400 168 L0 168 Z" fill="#6b4a3a" />
      {[180, 200, 220, 240, 260, 280].map((x) => (
        <path key={x} d={`M${x} 150 l0 -10 M${x - 4} 144 l4 -4 l4 4`} stroke="#4f9a6a" strokeWidth="2" fill="none" />
      ))}
      <path d="M90 132 L100 120 L120 120 L130 132 Z" fill="#b06c93" opacity="0.8" />
      {/* Mar con partículas */}
      <rect x="0" y="168" width="400" height="72" fill="url(#ch-sea)" />
      {Array.from({ length: 46 }).map((_, i) => (
        <rect
          key={i}
          x={(i * 41) % 400}
          y={176 + ((i * 23) % 60)}
          width={2 + (i % 3)}
          height={2 + ((i + 1) % 3)}
          rx="0.8"
          fill={['#f49ba2', '#ec8343', '#8fd3e6', '#e0665e'][i % 4]}
          opacity="0.75"
          transform={`rotate(${(i * 37) % 90} ${(i * 41) % 400} ${176 + ((i * 23) % 60)})`}
        />
      ))}
      {/* Signo de interrogación: lo desconocido */}
      <text x="352" y="62" fill="#8fd3e6" fontSize="44" fontFamily="Source Serif 4, Georgia, serif" fontWeight="700" opacity="0.9">?</text>
    </svg>
  )
}

export default function SpotlightArt({ motif, className }: { motif: Motif; className?: string }) {
  return (
    <div className={`spot-art ${className ?? ''}`} aria-hidden="true">
      {motif === 'land' ? <Land /> : motif === 'seafloor' ? <Seafloor /> : <Chemicals />}
    </div>
  )
}
