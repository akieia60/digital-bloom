/**
 * BloomLogoMark — Animated SVG brand mark for Digital Bloom™
 * The crystalline 8-petal bloom with rose gold petals, gold star center,
 * and living CSS animations. Built to work at any size.
 *
 * Props:
 *   size        — overall diameter in px (default 40)
 *   showText    — whether to show "DIGITAL BLOOM / GIFTING EXPERIENCES" beside mark
 *   animate     — turn animations on/off (default true)
 *   className   — extra class names on the wrapper
 */
export default function BloomLogoMark({ size = 40, showText = true, animate = true, className = '' }) {
  const r  = size / 2;          // radius
  const L  = r * 0.82;          // outer petal length
  const Li = L * 0.56;          // inner petal length
  const pw = L * 0.235;         // outer petal half-width
  const piw = Li * 0.27;        // inner petal half-width
  const sr = L * 0.105;         // star ray length

  // Build a single cubic-bezier petal path originating from (0,0), tip at (L,0)
  const petalPath = (len, hw) =>
    `M0,0 C${len*0.27},-${hw} ${len*0.66},-${hw*0.48} ${len},0 C${len*0.66},${hw*0.48} ${len*0.27},${hw} 0,0Z`;

  const outerPetal  = petalPath(L,  pw);
  const innerPetal  = petalPath(Li, piw);
  const starRay     = petalPath(sr, sr * 0.30);

  const angles8  = [0, 45, 90, 135, 180, 225, 270, 315];

  return (
    <div
      className={`bloom-logo-mark ${animate ? 'bloom-logo-mark--animated' : ''} ${className}`}
      style={{ display: 'flex', alignItems: 'center', gap: '12px', textDecoration: 'none' }}
    >
      {/* ── SVG Icon Mark ── */}
      <svg
        width={size}
        height={size}
        viewBox={`${-r} ${-r} ${size} ${size}`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
        className="bloom-logo-mark__svg"
      >
        <defs>
          <radialGradient id="blm-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#C9857A" stopOpacity="0.18"/>
            <stop offset="100%" stopColor="#C9857A" stopOpacity="0"/>
          </radialGradient>
          <radialGradient id="blm-gold" cx="40%" cy="40%" r="60%">
            <stop offset="0%"   stopColor="#F0DC96"/>
            <stop offset="100%" stopColor="#A87828"/>
          </radialGradient>
          <linearGradient id="blm-petal" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#D9968C" stopOpacity="0.85"/>
            <stop offset="55%"  stopColor="#C9857A"/>
            <stop offset="100%" stopColor="#905048" stopOpacity="0.90"/>
          </linearGradient>
          <linearGradient id="blm-inner" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#F0C8C0" stopOpacity="0.60"/>
            <stop offset="100%" stopColor="#C9857A" stopOpacity="0.55"/>
          </linearGradient>
        </defs>

        {/* Ambient glow */}
        <circle r={r * 1.0} fill="url(#blm-glow)" className="bloom-logo-mark__glow" />

        {/* Background disc */}
        <circle r={r * 0.88} fill="#0c1d3a" />

        {/* Outer ring — rotates slowly */}
        <circle
          r={r * 0.88}
          fill="none"
          stroke="#C9857A"
          strokeWidth={Math.max(0.5, size * 0.012)}
          strokeOpacity="0.40"
          className="bloom-logo-mark__ring"
        />

        {/* 8 main petals */}
        <g className="bloom-logo-mark__petals-outer">
          {angles8.map(a => (
            <path key={a} d={outerPetal} fill="url(#blm-petal)" transform={`rotate(${a})`} />
          ))}
        </g>

        {/* 8 inner petals, offset 22.5° */}
        <g className="bloom-logo-mark__petals-inner" transform="rotate(22.5)">
          {angles8.map(a => (
            <path key={a} d={innerPetal} fill="url(#blm-inner)" transform={`rotate(${a})`} />
          ))}
        </g>

        {/* 4-point gold star */}
        <g className="bloom-logo-mark__star">
          {[0, 90, 180, 270].map(a => (
            <path key={a} d={starRay} fill="url(#blm-gold)" transform={`rotate(${a})`} />
          ))}
          <circle r={r * 0.042} fill="url(#blm-gold)" />
        </g>

        {/* Tick marks at 8 positions */}
        <g stroke="#C9A84C" strokeWidth={Math.max(0.4, size * 0.010)} strokeOpacity="0.45">
          {angles8.map(a => (
            <line
              key={a}
              x1={r * 0.90} y1="0"
              x2={r * 0.98} y2="0"
              transform={`rotate(${a})`}
            />
          ))}
        </g>
      </svg>

      {/* ── Wordmark ── */}
      {showText && (
        <div className="bloom-logo-mark__text">
          <span className="bloom-logo-mark__name">DIGITAL BLOOM</span>
          <span className="bloom-logo-mark__tagline">✦ GIFTING EXPERIENCES ✦</span>
        </div>
      )}
    </div>
  );
}
