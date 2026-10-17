// Ilustraciones esquemáticas de los nueve límites planetarios, vistos desde el Mar de Cortés.
// Misma paleta y formato (400 × 240) que las de los temas emergentes; son decorativas (aria-hidden).
import type { ReactElement } from 'react'

const SANS = 'Source Sans 3, sans-serif'

/** Secuencia pseudoaleatoria fija para que el dibujo sea siempre igual */
const rnd = (i: number, m: number) => ((i * 7919 + 104729) % 997) % m

function Climate() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="cc-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a3a66" />
          <stop offset="0.55" stopColor="#b06c93" />
          <stop offset="1" stopColor="#ec8343" />
        </linearGradient>
        <linearGradient id="cc-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#e0665e" />
          <stop offset="1" stopColor="#176f8a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#cc-sky)" />
      {/* Capa de gases que devuelve el calor */}
      <path d="M0 36 Q200 6 400 36" stroke="#f49ba2" strokeWidth="10" fill="none" opacity="0.35" />
      {/* Sol y rayos */}
      <circle cx="300" cy="78" r="30" fill="#ffd2a8" />
      <circle cx="300" cy="78" r="44" fill="#ffd2a8" opacity="0.25" />
      {/* Luz que entra y calor que la capa de gases devuelve */}
      <g stroke="#ffe7d1" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M276 96 L214 150" />
        <path d="M216 140 L212 152 L224 148" />
        <path d="M130 152 Q160 10 196 152" strokeDasharray="6 5" />
        <path d="M188 144 L196 154 L200 141" />
      </g>
      {/* Sierras */}
      <path d="M0 150 L50 112 L90 132 L140 100 L190 136 L240 118 L290 140 L340 120 L400 138 L400 170 L0 170 Z" fill="#7a3d63" opacity="0.75" />
      {/* Ciudad del desierto */}
      <g fill="#3b2a3a">
        {[10, 30, 44, 62, 80, 96, 112].map((x, i) => (
          <rect key={x} x={x} y={150 - 10 - rnd(i, 26)} width={i % 2 ? 12 : 16} height={20 + rnd(i, 26)} />
        ))}
      </g>
      <rect x="0" y="160" width="400" height="16" fill="#c98a5a" />
      {/* Ondas de calor sobre el suelo */}
      <g stroke="#ffe7d1" strokeWidth="1.6" fill="none" opacity="0.7">
        {[150, 200, 250, 300, 350].map((x) => (
          <path key={x} d={`M${x} 156 q5 -6 0 -12 q-5 -6 0 -12`} />
        ))}
      </g>
      {/* Golfo más cálido */}
      <rect x="0" y="176" width="400" height="64" fill="url(#cc-sea)" />
      <g stroke="#f49ba2" strokeWidth="2" fill="none" opacity="0.8">
        {[190, 206, 222].map((y, k) => (
          <path key={y} d={`M${k * 10} ${y} q25 -6 50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0 t50 0`} />
        ))}
      </g>
      {/* Termómetro */}
      <g transform="translate(360 104)">
        <rect x="-7" y="0" width="14" height="62" rx="7" fill="#ffffff" opacity="0.9" />
        <rect x="-3.5" y="12" width="7" height="50" rx="3.5" fill="#e0665e" />
        <circle cx="0" cy="66" r="11" fill="#e0665e" stroke="#ffffff" strokeWidth="3" />
      </g>
    </svg>
  )
}

function Biosphere() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bi-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa8c8" />
          <stop offset="0.6" stopColor="#176f8a" />
          <stop offset="1" stopColor="#0a3a66" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bi-sea)" />
      {[60, 170, 290].map((x) => (
        <path key={x} d={`M${x} 0 L${x - 40} 150 L${x + 14} 150 Z`} fill="#ffffff" opacity="0.06" />
      ))}
      {/* Cardumen */}
      {Array.from({ length: 26 }).map((_, i) => {
        const x = 40 + ((i * 37) % 170)
        const y = 34 + ((i * 23) % 70)
        return <path key={i} d={`M${x} ${y} q6 -4 12 0 q-6 4 -12 0 Z M${x + 12} ${y} l4 -3 l0 6 Z`} fill="#dbe6f1" opacity="0.85" />
      })}
      {/* Vaquita (marsopa) */}
      <g transform="translate(250 82)">
        <path d="M0 14 Q20 -4 64 4 Q86 8 96 16 Q86 24 64 26 Q24 30 0 14 Z" fill="#a9b8c6" />
        <path d="M44 4 L54 -10 L60 4 Z" fill="#8a9bab" />
        <path d="M96 16 L110 6 L106 16 L110 28 Z" fill="#8a9bab" />
        <ellipse cx="12" cy="12" rx="5" ry="4" fill="#26343f" />
        <path d="M2 16 Q6 20 12 18" stroke="#26343f" strokeWidth="2" fill="none" />
      </g>
      {/* Tortuga */}
      <g transform="translate(110 132)">
        <ellipse cx="0" cy="0" rx="22" ry="13" fill="#3f8a5c" />
        <path d="M-12 -2 h24 M-6 -10 v20 M6 -10 v20" stroke="#2d6a46" strokeWidth="1.6" />
        <circle cx="26" cy="-2" r="6" fill="#4f9a6a" />
        <path d="M-10 10 l-10 10 M10 10 l8 12 M-10 -10 l-10 -8 M10 -10 l8 -10" stroke="#4f9a6a" strokeWidth="5" strokeLinecap="round" />
      </g>
      {/* Arrecife */}
      <path d="M0 210 Q80 196 160 206 T320 200 T400 204 L400 240 L0 240 Z" fill="#c7a86a" />
      {Array.from({ length: 16 }).map((_, i) => {
        const x = 12 + i * 25
        const k = i % 4
        if (k === 0) return <path key={i} d={`M${x} 208 q-6 -20 0 -36 q6 18 0 36`} fill="#e0665e" />
        if (k === 1) return <ellipse key={i} cx={x} cy="200" rx="10" ry="12" fill="#f49ba2" />
        if (k === 2)
          return <path key={i} d={`M${x} 208 l-9 -22 M${x} 208 l0 -28 M${x} 208 l9 -22`} stroke="#b06c93" strokeWidth="4" strokeLinecap="round" />
        return <path key={i} d={`M${x} 208 q-3 -30 4 -56 M${x + 6} 208 q4 -24 -2 -44`} stroke="#4f9a6a" strokeWidth="3" fill="none" />
      })}
      {/* Pez grande (depredador tope) */}
      <g transform="translate(300 150)" opacity="0.9">
        <path d="M0 0 Q30 -18 66 0 Q30 18 0 0 Z" fill="#ec8343" />
        <path d="M66 0 L82 -12 L78 0 L82 12 Z" fill="#ec8343" />
        <circle cx="12" cy="-2" r="2.4" fill="#26343f" />
      </g>
    </svg>
  )
}

function Land() {
  // Vista aérea: vegetación natural a la izquierda, campos y estanques a la derecha
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#6f8c5a" />
      {/* Matorral y selva baja (textura natural) */}
      {Array.from({ length: 120 }).map((_, i) => (
        <circle key={i} cx={(i * 47) % 190} cy={(i * 31) % 180} r={3 + (i % 4)} fill={i % 3 ? '#4f7a46' : '#86a36a'} opacity="0.9" />
      ))}
      {/* Frente de conversión */}
      <path d="M150 0 Q175 60 160 120 T190 180 L400 180 L400 0 Z" fill="#d9c08a" />
      {/* Parcelas agrícolas */}
      {Array.from({ length: 4 }).map((_, r) =>
        Array.from({ length: 5 }).map((_, c) => {
          const x = 176 + c * 45 + (r % 2) * 6
          const y = 8 + r * 42
          const fills = ['#a7c26a', '#e5d39b', '#7fae5a', '#c9a96a', '#b8cf7a']
          return (
            <g key={`${r}-${c}`}>
              <rect x={x} y={y} width="40" height="36" fill={fills[(r * 5 + c) % 5]} />
              {(r + c) % 2 === 0 &&
                [8, 16, 24, 32].map((d) => <line key={d} x1={x + 2} y1={y + d} x2={x + 38} y2={y + d} stroke="#6b8a3e" strokeWidth="0.8" opacity="0.6" />)}
            </g>
          )
        }),
      )}
      {/* Camino */}
      <path d="M150 176 L400 150" stroke="#f3ead8" strokeWidth="4" />
      {/* Laguna, manglar y estanques camaronícolas */}
      <rect x="0" y="180" width="400" height="60" fill="#2fa8c8" />
      <path d="M0 180 Q60 196 120 186 T240 190 L240 180 Z" fill="#2d6a46" />
      {Array.from({ length: 22 }).map((_, i) => (
        <circle key={i} cx={6 + i * 11} cy={184 + (i % 3) * 3} r="6" fill="#3f8a5c" />
      ))}
      {[0, 1, 2, 3].map((c) =>
        [0, 1].map((r) => <rect key={`${c}-${r}`} x={244 + c * 39} y={184 + r * 25} width="34" height="20" fill="#7fc3cf" stroke="#e8dcc0" strokeWidth="3" />),
      )}
      <path d="M0 226 Q100 216 200 230 T400 224 L400 240 L0 240 Z" fill="#176f8a" />
    </svg>
  )
}

function Freshwater() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="fw-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a3a66" />
          <stop offset="1" stopColor="#3f7fa6" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#fw-sky)" />
      <circle cx="80" cy="44" r="18" fill="#ec8343" opacity="0.9" />
      {/* Sierra con nubes de monzón */}
      <ellipse cx="60" cy="70" rx="40" ry="11" fill="#dbe6f1" opacity="0.55" />
      <path d="M0 116 L40 70 L80 96 L120 66 L170 112 L170 130 L0 130 Z" fill="#7a3d63" opacity="0.8" />
      {/* Superficie: campos y río hacia el mar */}
      <path d="M0 126 L330 126 L330 136 L0 136 Z" fill="#c9a96a" />
      {[190, 222, 254, 286].map((x) => (
        <rect key={x} x={x} y="118" width="26" height="8" fill="#7fae5a" />
      ))}
      <path d="M100 128 Q160 134 210 128 T330 131" stroke="#8fd3e6" strokeWidth="4" fill="none" />
      {/* Presa */}
      <path d="M150 112 L162 112 L166 136 L146 136 Z" fill="#dbe6f1" />
      {/* Mar */}
      <rect x="330" y="118" width="70" height="122" fill="#176f8a" />
      {/* Subsuelo y acuífero */}
      <rect x="0" y="136" width="330" height="104" fill="#6b4a3a" />
      <rect x="0" y="176" width="330" height="40" fill="#3f7fa6" opacity="0.85" />
      {/* Nivel original (punteado) y nivel actual */}
      <path d="M0 150 L330 150" stroke="#8fd3e6" strokeWidth="1.5" strokeDasharray="4 4" />
      {/* Cuña de agua de mar que entra al acuífero */}
      <path d="M330 176 L230 216 L330 216 Z" fill="#0a3a66" />
      <path d="M326 196 L262 206" stroke="#e0665e" strokeWidth="2" strokeDasharray="4 3" />
      <path d="M268 202 L260 206 L268 210" stroke="#e0665e" strokeWidth="2" fill="none" />
      {/* Pozos */}
      {[210, 250, 290].map((x) => (
        <g key={x}>
          <rect x={x - 3} y="108" width="6" height="12" fill="#dbe6f1" />
          <line x1={x} y1="120" x2={x} y2="196" stroke="#dbe6f1" strokeWidth="2" />
        </g>
      ))}
      {Array.from({ length: 30 }).map((_, i) => (
        <circle key={i} cx={(i * 61) % 320} cy={222 + ((i * 13) % 16)} r="1.8" fill="#e9d8c4" opacity="0.4" />
      ))}
    </svg>
  )
}

function Biogeochemical() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="bg-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a3a66" />
          <stop offset="1" stopColor="#3f7fa6" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#bg-sky)" />
      {/* Gas que escapa (óxido nitroso) */}
      {[40, 70, 100, 130].map((x, i) => (
        <circle key={x} cx={x + (i % 2) * 8} cy={60 - i * 6} r={5 + (i % 2) * 2} fill="none" stroke="#f49ba2" strokeWidth="2" opacity="0.8" />
      ))}
      {/* Campos de trigo */}
      <path d="M0 120 L190 120 L210 150 L0 150 Z" fill="#c9a96a" />
      {Array.from({ length: 18 }).map((_, i) => (
        <path key={i} d={`M${8 + i * 10} 120 l0 -14 M${4 + i * 10} 110 l4 -4 l4 4`} stroke="#e5d39b" strokeWidth="2" fill="none" />
      ))}
      {/* Tractor que fertiliza */}
      <g transform="translate(120 92)">
        <rect x="0" y="6" width="34" height="14" rx="3" fill="#ec8343" />
        <rect x="18" y="-6" width="14" height="14" fill="#ec8343" />
        <circle cx="8" cy="22" r="7" fill="#26343f" />
        <circle cx="28" cy="22" r="5" fill="#26343f" />
        {[0, 1, 2, 3, 4].map((k) => (
          <circle key={k} cx={-6 - k * 6} cy={18 + (k % 2) * 4} r="2" fill="#f3ead8" />
        ))}
      </g>
      {/* Dren que llega a la laguna */}
      <path d="M150 150 Q200 156 230 170" stroke="#9cc65a" strokeWidth="6" fill="none" />
      {/* Mar con florecimiento */}
      <path d="M190 150 L400 150 L400 240 L0 240 L0 170 Q120 164 190 150 Z" fill="#176f8a" />
      {Array.from({ length: 60 }).map((_, i) => {
        const x = 200 + ((i * 41) % 200)
        const y = 162 + ((i * 17) % 70)
        return <circle key={i} cx={x} cy={y} r={2 + (i % 3)} fill={i % 3 === 0 ? '#e0665e' : '#9cc65a'} opacity="0.75" />
      })}
      <path d="M240 180 q30 -14 60 0 t60 0" stroke="#9cc65a" strokeWidth="3" fill="none" opacity="0.7" />
      <path d="M230 210 q30 -14 60 0 t60 0" stroke="#e0665e" strokeWidth="3" fill="none" opacity="0.6" />
      {/* N y P */}
      <g fontFamily={SANS} fontWeight="700" fontSize="15" fill="#ffffff">
        <circle cx="300" cy="62" r="16" fill="#9cc65a" />
        <text x="295" y="67">N</text>
        <circle cx="342" cy="88" r="14" fill="#e0665e" />
        <text x="337" y="93">P</text>
      </g>
    </svg>
  )
}

function OceanAcid() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="oa-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa8c8" />
          <stop offset="0.5" stopColor="#176f8a" />
          <stop offset="1" stopColor="#3a2f5e" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#oa-sea)" />
      <rect width="400" height="22" fill="#0a3a66" />
      {/* CO₂ que entra al mar */}
      {[60, 120, 180, 240].map((x, i) => (
        <g key={x}>
          <circle cx={x} cy={34 + (i % 2) * 14} r="6" fill="none" stroke="#dbe6f1" strokeWidth="2" />
          <circle cx={x + 10} cy={48 + (i % 2) * 14} r="3.5" fill="none" stroke="#dbe6f1" strokeWidth="1.6" />
        </g>
      ))}
      {/* Agua corrosiva profunda que sube por la plataforma */}
      <path d="M0 240 L0 160 Q120 150 200 176 Q260 196 400 120 L400 240 Z" fill="#5a3f78" opacity="0.6" />
      <g stroke="#f49ba2" strokeWidth="2.4" fill="none" strokeLinecap="round">
        <path d="M150 220 Q240 200 300 150" />
        <path d="M292 150 L302 148 L300 158" />
      </g>
      {/* Plataforma costera con moluscos */}
      <path d="M260 240 L260 200 Q320 170 400 160 L400 240 Z" fill="#c7a86a" />
      {/* Abulón sano */}
      <g transform="translate(350 168)">
        <ellipse cx="0" cy="0" rx="16" ry="10" fill="#e0a07a" />
        <path d="M-10 -2 q10 -8 20 0 M-6 2 q6 -4 12 0" stroke="#b06c93" strokeWidth="1.8" fill="none" />
      </g>
      {/* Concha que se disuelve */}
      <g transform="translate(300 192)">
        <path d="M-14 0 Q0 -18 14 0 Z" fill="none" stroke="#f3ead8" strokeWidth="2" strokeDasharray="3 3" />
        <path d="M-8 -2 L0 -12 L8 -2" stroke="#f3ead8" strokeWidth="1.4" fill="none" strokeDasharray="2 3" />
      </g>
      {/* Pterópodos (caracoles nadadores) */}
      {[
        [80, 96],
        [130, 120],
        [190, 92],
      ].map(([x, y]) => (
        <g key={x} transform={`translate(${x} ${y})`}>
          <path d="M0 0 q8 -10 0 -16 q-10 4 -4 12 Z" fill="#f3ead8" opacity="0.9" />
          <path d="M2 -2 q8 2 12 -4 M-2 -2 q-8 2 -12 -4" stroke="#f3ead8" strokeWidth="1.4" fill="none" />
        </g>
      ))}
      {/* Escala de pH */}
      <g transform="translate(372 30)">
        <rect x="0" y="0" width="12" height="100" rx="6" fill="#ffffff" opacity="0.18" />
        <rect x="2" y="4" width="8" height="30" rx="4" fill="#2fa8c8" />
        <rect x="2" y="36" width="8" height="30" rx="4" fill="#b06c93" />
        <rect x="2" y="68" width="8" height="28" rx="4" fill="#e0665e" />
      </g>
    </svg>
  )
}

function Aerosols() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ae-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#3f5a78" />
          <stop offset="0.7" stopColor="#b08a72" />
          <stop offset="1" stopColor="#c9a07a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#ae-sky)" />
      {/* Sol apagado por la bruma */}
      <circle cx="290" cy="70" r="26" fill="#ffd2a8" opacity="0.55" />
      <ellipse cx="240" cy="96" rx="200" ry="34" fill="#d9b896" opacity="0.45" />
      {/* Partículas */}
      {Array.from({ length: 90 }).map((_, i) => (
        <circle key={i} cx={(i * 43) % 400} cy={20 + ((i * 29) % 150)} r={0.8 + (i % 3) * 0.7} fill="#5a4a42" opacity="0.5" />
      ))}
      {/* Humo de quema agrícola y de chimenea */}
      <g fill="#7a6a62" opacity="0.6">
        <circle cx="70" cy="150" r="14" />
        <circle cx="82" cy="128" r="18" />
        <circle cx="100" cy="104" r="22" />
        <circle cx="128" cy="84" r="26" />
      </g>
      <g fill="#8a7d76" opacity="0.55">
        <circle cx="330" cy="120" r="10" />
        <circle cx="344" cy="102" r="14" />
        <circle cx="364" cy="84" r="18" />
      </g>
      <rect x="322" y="124" width="10" height="44" fill="#4a3f3a" />
      {/* Fuego en el campo */}
      <path d="M56 168 q6 -14 12 -6 q4 -12 10 0 q6 -8 8 6 Z" fill="#ec8343" />
      {/* Ciudad */}
      <g fill="#3b3540">
        {[150, 170, 186, 206, 222, 240, 258, 280, 296].map((x, i) => (
          <rect key={x} x={x} y={168 - 14 - rnd(i, 34)} width={i % 2 ? 14 : 18} height={14 + rnd(i, 34)} />
        ))}
      </g>
      {/* Calle sin pavimentar y polvo */}
      <rect x="0" y="168" width="400" height="72" fill="#a8825a" />
      <path d="M0 200 Q200 186 400 204" stroke="#c9a07a" strokeWidth="10" fill="none" />
      <g fill="#d9b896" opacity="0.7">
        <ellipse cx="200" cy="186" rx="40" ry="10" />
        <ellipse cx="240" cy="178" rx="30" ry="8" />
      </g>
      {/* Automóvil */}
      <g transform="translate(176 188)">
        <rect x="0" y="0" width="34" height="10" rx="3" fill="#2fa8c8" />
        <rect x="8" y="-7" width="18" height="8" rx="2" fill="#2fa8c8" />
        <circle cx="8" cy="11" r="3.5" fill="#26343f" />
        <circle cx="27" cy="11" r="3.5" fill="#26343f" />
      </g>
    </svg>
  )
}

function Ozone() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <rect width="400" height="240" fill="#072a4a" />
      {Array.from({ length: 40 }).map((_, i) => (
        <circle key={i} cx={(i * 59) % 400} cy={(i * 23) % 90} r={0.6 + (i % 3) * 0.4} fill="#ffffff" opacity="0.7" />
      ))}
      <circle cx="360" cy="30" r="20" fill="#ffd2a8" />
      {/* Tierra y capas de la atmósfera */}
      <circle cx="200" cy="640" r="520" fill="#2fa8c8" opacity="0.12" />
      <circle cx="200" cy="640" r="490" fill="#2fa8c8" opacity="0.35" />
      {/* Capa de ozono, más delgada en un tramo */}
      <circle cx="200" cy="640" r="470" fill="none" stroke="#8fd3e6" strokeWidth="12" opacity="0.7" />
      <circle cx="200" cy="640" r="470" fill="none" stroke="#072a4a" strokeWidth="9" strokeDasharray="70 2000" strokeDashoffset="-690" opacity="0.6" />
      <circle cx="200" cy="640" r="440" fill="#3f7fa6" />
      <circle cx="200" cy="640" r="430" fill="#176f8a" />
      {/* Continente: península y Golfo */}
      <path d="M120 220 Q150 206 190 210 Q230 214 250 230 L250 240 L120 240 Z" fill="#4f9a6a" />
      <path d="M210 214 Q226 220 236 236 L222 240 Q212 226 200 216 Z" fill="#176f8a" />
      {/* Rayos UV: casi todos los frena la capa */}
      <g stroke="#f49ba2" strokeWidth="2.2" strokeLinecap="round" fill="none">
        <path d="M344 44 L290 152" />
        <path d="M336 40 L250 156" />
        <path d="M352 50 L330 158" />
      </g>
      <g fill="#f49ba2">
        <circle cx="290" cy="152" r="4" />
        <circle cx="250" cy="156" r="4" />
        <circle cx="330" cy="158" r="4" />
      </g>
      <path d="M326 36 L190 206" stroke="#b06c93" strokeWidth="2.6" strokeDasharray="6 5" strokeLinecap="round" />
    </svg>
  )
}

function NovelEntities() {
  return (
    <svg viewBox="0 0 400 240" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="ne-sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#0a3a66" />
          <stop offset="1" stopColor="#2a6f9e" />
        </linearGradient>
        <linearGradient id="ne-sea" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#2fa8c8" />
          <stop offset="1" stopColor="#0a3a66" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#ne-sky)" />
      {/* Avioneta que fumiga */}
      <g transform="translate(70 40)">
        <path d="M0 10 L44 6 L52 10 L44 14 Z" fill="#ec8343" />
        <rect x="16" y="2" width="8" height="16" fill="#ec8343" />
        <path d="M2 10 L-4 2 L4 8 Z" fill="#ec8343" />
        {Array.from({ length: 12 }).map((_, k) => (
          <circle key={k} cx={10 + (k % 4) * 8} cy={22 + Math.floor(k / 4) * 9} r="1.6" fill="#f3ead8" opacity={0.8 - Math.floor(k / 4) * 0.2} />
        ))}
      </g>
      {/* Mina y jales */}
      <path d="M200 120 L240 84 L290 84 L330 120 Z" fill="#b06c93" opacity="0.85" />
      <path d="M240 84 L262 70 L290 84" fill="#8a4d72" />
      <path d="M300 120 Q320 132 330 150" stroke="#ec8343" strokeWidth="5" fill="none" />
      {/* Valle y cultivos */}
      <rect x="0" y="118" width="400" height="20" fill="#7fae5a" />
      {Array.from({ length: 20 }).map((_, i) => (
        <path key={i} d={`M${6 + i * 10} 118 l0 -8`} stroke="#4f9a6a" strokeWidth="2" />
      ))}
      {/* Playa con residuos */}
      <path d="M0 138 L400 138 L400 160 Q200 168 0 156 Z" fill="#e5d39b" />
      <g>
        <rect x="60" y="142" width="7" height="16" rx="2" fill="#8fd3e6" transform="rotate(-70 63 150)" />
        <rect x="120" y="144" width="12" height="8" rx="2" fill="#f49ba2" />
        <rect x="186" y="142" width="6" height="14" rx="2" fill="#ffffff" transform="rotate(60 189 149)" />
        <path d="M240 150 q8 -8 16 0 q-8 4 -16 0" fill="#e0665e" />
        <rect x="350" y="143" width="10" height="10" rx="2" fill="#ec8343" transform="rotate(20 355 148)" />
      </g>
      {/* Mar con microplásticos y peces */}
      <path d="M0 156 Q200 168 400 160 L400 240 L0 240 Z" fill="url(#ne-sea)" />
      {Array.from({ length: 50 }).map((_, i) => (
        <rect
          key={i}
          x={(i * 37) % 400}
          y={172 + ((i * 19) % 62)}
          width={2 + (i % 3)}
          height={2 + ((i + 1) % 2)}
          rx="0.6"
          fill={['#f49ba2', '#ec8343', '#ffffff', '#e0665e'][i % 4]}
          opacity="0.7"
          transform={`rotate(${(i * 41) % 90} ${(i * 37) % 400} ${172 + ((i * 19) % 62)})`}
        />
      ))}
      {[
        [90, 196],
        [250, 212],
        [320, 186],
      ].map(([x, y]) => (
        <path key={x} d={`M${x} ${y} q12 -8 24 0 q-12 8 -24 0 Z M${x + 24} ${y} l8 -6 l0 12 Z`} fill="#dbe6f1" opacity="0.85" />
      ))}
    </svg>
  )
}

const ART: Record<string, () => ReactElement> = {
  'climate-change': Climate,
  'biosphere-integrity': Biosphere,
  'land-system-change': Land,
  'freshwater-change': Freshwater,
  'biogeochemical-flows': Biogeochemical,
  'ocean-acidification': OceanAcid,
  aerosols: Aerosols,
  ozone: Ozone,
  'novel-entities': NovelEntities,
}

export default function BoundaryArt({ id, className }: { id: string; className?: string }) {
  const Art = ART[id] ?? Climate
  return (
    <div className={`spot-art ${className ?? ''}`} aria-hidden="true">
      <Art />
    </div>
  )
}
