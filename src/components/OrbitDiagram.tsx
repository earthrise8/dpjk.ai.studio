import { useEffect, useId, useState } from "react";
import { Pause, Play, RotateCcw } from "lucide-react";
import { useReducedMotion } from "framer-motion";

type DiagramProps = {
  eccentricity?: number;
  meanAnomaly?: number;
  className?: string;
};

export function OrbitDiagram({
  eccentricity = 0.42,
  meanAnomaly = 4.95,
  className = "",
}: DiagramProps) {
  const id = useId().replace(/:/g, "");
  const a = 158;
  const b = a * Math.sqrt(1 - eccentricity ** 2);
  const focus = 240;
  const center = focus + a * eccentricity;
  let anomaly = meanAnomaly;

  // Solve Kepler's equation so the satellite moves faster near periapsis.
  for (let i = 0; i < 8; i++) {
    anomaly -=
      (anomaly - eccentricity * Math.sin(anomaly) - meanAnomaly) /
      (1 - eccentricity * Math.cos(anomaly));
  }
  const x = center - a * Math.cos(anomaly);
  const y = 174 + b * Math.sin(anomaly);

  return (
    <svg
      viewBox="0 0 600 350"
      className={`orbit-diagram ${className}`}
      role="img"
      aria-label={`An elliptical satellite orbit around Earth with eccentricity ${eccentricity.toFixed(2)}`}
    >
      <defs>
        <pattern
          id={`grid-${id}`}
          width="30"
          height="30"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 30 0 L 0 0 0 30"
            fill="none"
            stroke="#c7ab9f"
            strokeOpacity=".075"
            strokeWidth=".7"
          />
        </pattern>
        <radialGradient id={`earth-${id}`} cx="30%" cy="28%">
          <stop offset="0%" stopColor="#b3a199" />
          <stop offset="45%" stopColor="#6f564b" />
          <stop offset="100%" stopColor="#2e241f" />
        </radialGradient>
        <radialGradient id={`halo-${id}`}>
          <stop offset="0%" stopColor="#cdb3a8" stopOpacity=".16" />
          <stop offset="100%" stopColor="#cdb3a8" stopOpacity="0" />
        </radialGradient>
      </defs>
      <rect width="600" height="350" fill="#231c18" />
      <rect width="600" height="350" fill={`url(#grid-${id})`} />
      <circle cx={focus} cy="174" r="120" fill={`url(#halo-${id})`} />
      <path
        d="M 40 174 H 560 M 240 40 V 310"
        stroke="#c2a396"
        strokeOpacity=".17"
        strokeDasharray="3 6"
      />
      <circle
        cx={focus}
        cy="174"
        r="73"
        fill="none"
        stroke="#9b8175"
        strokeOpacity=".2"
      />
      <circle
        cx={focus}
        cy="174"
        r="114"
        fill="none"
        stroke="#9b8175"
        strokeOpacity=".13"
      />
      <ellipse
        cx={center}
        cy="174"
        rx={a}
        ry={b}
        fill="none"
        stroke="#ff6d29"
        strokeWidth="1.2"
      />
      <line
        x1={focus}
        y1="174"
        x2={x}
        y2={y}
        stroke="#ff8952"
        strokeOpacity=".35"
        strokeWidth=".7"
        strokeDasharray="4 5"
      />
      <circle
        cx={focus}
        cy="174"
        r="29"
        fill={`url(#earth-${id})`}
        stroke="#d4c3bb"
        strokeOpacity=".25"
      />
      <path
        d="M220 161 Q237 147 252 159 L248 170 263 178 254 193 238 187 232 172Z"
        fill="#b5a39b"
        opacity=".22"
      />
      <ellipse
        cx={focus}
        cy="174"
        rx="14"
        ry="29"
        stroke="#d0bab0"
        strokeOpacity=".2"
        fill="none"
        transform={`rotate(-25 ${focus} 174)`}
      />
      <g transform={`translate(${x} ${y})`}>
        <circle r="14" fill="#ff6b2b" opacity=".08" />
        <path d="M-12-3H-5V3H-12ZM5-3H12V3H5Z" fill="#b08d7f" />
        <rect x="-4" y="-5" width="8" height="10" rx="1" fill="#ff8952" />
        <path d="M0-9V-5M0 5V9" stroke="#ff8952" />
      </g>
      <g
        fill="#ac968c"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="8"
        letterSpacing="1.5"
      >
        <text x="27" y="30">
          ORBITAL STUDY / 001
        </text>
        <text x="573" y="30" textAnchor="end">
          TWO-BODY SYSTEM
        </text>
        <text x="27" y="325">
          e = {eccentricity.toFixed(2)}
        </text>
        <text x="573" y="325" textAnchor="end">
          NOT TO SCALE
        </text>
        <text x={focus} y="222" textAnchor="middle" fontSize="7">
          EARTH
        </text>
        <text x={center + a + 8} y="178" fontSize="7">
          A
        </text>
        <text x={center - a - 12} y="178" fontSize="7">
          P
        </text>
      </g>
      <g stroke="#c7afa5" strokeOpacity=".5" strokeWidth=".7">
        <path
          d="M17 46V17H46M554 17H583V46M17 304V333H46M554 333H583V304"
          fill="none"
        />
      </g>
    </svg>
  );
}

export function OrbitSimulation() {
  const reducedMotion = useReducedMotion();
  const [eccentricity, setEccentricity] = useState(0.42);
  const [running, setRunning] = useState(!reducedMotion);
  const [phase, setPhase] = useState(4.95);

  useEffect(() => {
    if (!running) return;
    let frame: number;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(now - previous, 100);
      previous = now;
      setPhase((value) => (value + delta * 0.00045) % (Math.PI * 2));
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [running]);

  return (
    <div className="orbit-simulation">
      <OrbitDiagram eccentricity={eccentricity} meanAnomaly={phase} />
      <div className="simulation-controls">
        <div className="simulation-buttons">
          <button
            className="icon-button"
            onClick={() => setRunning(!running)}
            aria-label={running ? "Pause orbit" : "Play orbit"}
          >
            {running ? <Pause size={17} /> : <Play size={17} />}
          </button>
          <button
            className="icon-button"
            onClick={() => {
              setPhase(4.95);
              setEccentricity(0.42);
            }}
            aria-label="Reset simulation"
          >
            <RotateCcw size={17} />
          </button>
        </div>
        <label htmlFor="eccentricity">
          ECCENTRICITY <span>{eccentricity.toFixed(2)}</span>
        </label>
        <input
          id="eccentricity"
          type="range"
          min="0"
          max="0.72"
          step="0.01"
          value={eccentricity}
          onChange={(event) => setEccentricity(Number(event.target.value))}
        />
      </div>
      <p className="simulation-hint">
        Try a circular orbit at 0.00, then stretch it out. Notice how the
        satellite speeds up as it gets closer to Earth.
      </p>
    </div>
  );
}
