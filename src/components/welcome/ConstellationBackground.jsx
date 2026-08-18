// Glowing gold line-art constellations + heart motifs over a deep black field.
// Purely decorative; pointer-events disabled so it never blocks taps.
const STARS = [
  [40, 90], [90, 60], [150, 110], [210, 70], [300, 120], [340, 60],
  [60, 220], [120, 260], [200, 230], [280, 280], [330, 240],
  [50, 380], [110, 420], [180, 390], [250, 430], [320, 380],
  [40, 540], [100, 580], [170, 550], [240, 600], [310, 560],
  [60, 700], [130, 730], [210, 690], [290, 740], [340, 690],
];

// Pairs of star indices to connect with thin gold lines
const LINKS = [
  [0, 1], [1, 2], [2, 3], [3, 4], [4, 5],
  [6, 7], [7, 8], [8, 9], [9, 10],
  [11, 12], [12, 13], [13, 14], [14, 15],
  [16, 17], [17, 18], [18, 19], [19, 20],
  [21, 22], [22, 23], [23, 24], [24, 25],
  [2, 8], [9, 13], [14, 18], [19, 23],
];

// Small gold heart outlines scattered across the field
const HEARTS = [
  { x: 70, y: 160, s: 7 }, { x: 250, y: 170, s: 5 },
  { x: 150, y: 320, s: 6 }, { x: 320, y: 330, s: 5 },
  { x: 90, y: 470, s: 6 }, { x: 270, y: 490, s: 7 },
  { x: 180, y: 640, s: 5 }, { x: 330, y: 650, s: 6 },
];

function heartPath(cx, cy, s) {
  // A small heart outline centered at (cx, cy), scaled by s
  return `M ${cx} ${cy + s * 0.7}
    C ${cx - s * 1.1} ${cy - s * 0.2}, ${cx - s * 1.1} ${cy - s * 0.9}, ${cx} ${cy - s * 0.4}
    C ${cx + s * 1.1} ${cy - s * 0.9}, ${cx + s * 1.1} ${cy - s * 0.2}, ${cx} ${cy + s * 0.7} Z`;
}

export default function ConstellationBackground() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 375 812"
      preserveAspectRatio="xMidYMid slice"
      style={{ opacity: 0.55 }}
    >
      <defs>
        <radialGradient id="starGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#F3E5AB" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* Constellation lines */}
      <g stroke="#D4AF37" strokeWidth="0.5" strokeOpacity="0.45" fill="none">
        {LINKS.map(([a, b], i) => (
          <line
            key={i}
            x1={STARS[a][0]} y1={STARS[a][1]}
            x2={STARS[b][0]} y2={STARS[b][1]}
          />
        ))}
      </g>

      {/* Star nodes */}
      {STARS.map(([x, y], i) => (
        <g key={i}>
          <circle cx={x} cy={y} r="4" fill="url(#starGlow)" />
          <circle cx={x} cy={y} r="0.9" fill="#F3E5AB" />
        </g>
      ))}

      {/* Heart motifs */}
      <g stroke="#D4AF37" strokeWidth="0.6" strokeOpacity="0.5" fill="none">
        {HEARTS.map((h, i) => (
          <path key={i} d={heartPath(h.x, h.y, h.s)} />
        ))}
      </g>
    </svg>
  );
}