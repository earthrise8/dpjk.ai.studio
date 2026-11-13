/* =====================================================================
 * PROJECT ILLUSTRATIONS
 * =====================================================================
 * Hand-built SVG drawings used on project cards and in dialogs.
 * They are illustrative concept art, not photos of real hardware.
 *
 * To replace a drawing with a real photo:
 *   1. Put the image in /public/images/.
 *   2. In src/App.tsx, swap the matching <XVisual /> for an <img>.
 *
 * To add a new drawing:
 *   1. Copy ProjectVisualShell below and add your own children.
 *   2. Export a component, then add a case in renderProjectVisual (src/App.tsx).
 * ===================================================================== */

import type { ReactNode } from "react";

type VisualProps = { expanded?: boolean };

function ProjectVisualShell({
  id,
  title,
  corner,
  subtitle,
  ariaLabel,
  expanded = false,
  className = "",
  children,
}: {
  id: string;
  title: string;
  corner: string;
  subtitle: string;
  ariaLabel: string;
  expanded?: boolean;
  className?: string;
  children: ReactNode;
}) {
  return (
    <svg
      viewBox="0 0 720 440"
      className={`project-visual ${className} ${expanded ? "expanded" : ""}`.trim()}
      role="img"
      aria-label={ariaLabel}
    >
      <defs>
        <pattern
          id={`grid-${id}`}
          width="38"
          height="38"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M38 0H0V38"
            fill="none"
            stroke="#c5afa5"
            strokeOpacity=".1"
          />
        </pattern>
      </defs>
      <rect width="720" height="440" fill="#211a16" />
      <rect width="720" height="440" fill={`url(#grid-${id})`} />
      <g fontFamily="IBM Plex Mono, monospace" fill="#b69f94">
        <text x="28" y="37" fontSize="9" letterSpacing="1.2">
          {title}
        </text>
        <text x="692" y="37" textAnchor="end" fontSize="7" letterSpacing=".7">
          {corner}
        </text>
        <text x="28" y="68" fontSize="7" letterSpacing=".8">
          {subtitle}
        </text>
      </g>
      {children}
      <g
        fontFamily="IBM Plex Mono, monospace"
        fill="#92796d"
        fontSize="7"
        letterSpacing=".7"
      >
        <text x="28" y="420">
          ILLUSTRATIVE CONCEPT
        </text>
        <text x="692" y="420" textAnchor="end">
          D. KWOK
        </text>
      </g>
    </svg>
  );
}

/* ------------------------------------------------------------------
   MODULAR ROCKET SYSTEM — personal engineering project
   ------------------------------------------------------------------ */
export function ModularRocketVisual({ expanded = false }: VisualProps) {
  return (
    <ProjectVisualShell
      id="mrs"
      title="MODULAR ROCKET SYSTEM"
      corner="ILLUSTRATIVE CONCEPT"
      subtitle="PERSONAL ENGINEERING PROJECT / 2025"
      ariaLabel="Illustrative modular rocket concept showing interchangeable 3D-printed modules."
      expanded={expanded}
      className="modular-rocket-visual"
    >
      <defs>
        <linearGradient id="mrs-metal" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#66493b" />
          <stop offset=".38" stopColor="#c4aea5" />
          <stop offset=".6" stopColor="#9d8378" />
          <stop offset="1" stopColor="#533a2e" />
        </linearGradient>
      </defs>

      <path
        d="M210 80V362"
        stroke="#ff8952"
        strokeOpacity=".22"
        strokeDasharray="4 5"
      />

      {/* Nose module */}
      <path
        d="M210 86L184 124H236Z"
        fill="#8b6e60"
        stroke="#d1b6a7"
        strokeWidth="1.1"
      />
      <rect
        x="184"
        y="124"
        width="52"
        height="18"
        fill="url(#mrs-metal)"
        stroke="#c6ab9c"
      />

      {/* Module bodies */}
      <rect
        x="184"
        y="160"
        width="52"
        height="48"
        fill="url(#mrs-metal)"
        stroke="#c6ab9c"
      />
      <rect
        x="184"
        y="226"
        width="52"
        height="48"
        fill="url(#mrs-metal)"
        stroke="#c6ab9c"
      />
      <rect
        x="184"
        y="292"
        width="52"
        height="58"
        fill="url(#mrs-metal)"
        stroke="#c6ab9c"
      />

      {/* Module internals */}
      <g>
        <rect
          x="194"
          y="172"
          width="32"
          height="24"
          fill="#2c211c"
          stroke="#7c5746"
          strokeWidth=".8"
        />
        <circle
          cx="204"
          cy="184"
          r="3"
          fill="none"
          stroke="#ff8952"
          strokeWidth=".9"
        />
        <circle
          cx="216"
          cy="184"
          r="3"
          fill="none"
          stroke="#ff8952"
          strokeWidth=".9"
        />
      </g>
      <g>
        <path
          d="M190 246Q210 232 230 246"
          fill="none"
          stroke="#d4bdae"
          strokeWidth="1.1"
        />
        <path
          d="M190 246V262M200 244V266M220 244V266M230 246V262"
          stroke="#d4bdae"
          strokeOpacity=".55"
          strokeWidth=".8"
        />
      </g>
      <path
        d="M190 302H230M190 340H230"
        stroke="#725040"
        strokeWidth=".9"
      />

      {/* Fins + nozzle */}
      <path
        d="M184 330L156 372H184Z"
        fill="#412c22"
        stroke="#97796b"
        strokeWidth=".9"
      />
      <path
        d="M236 330L264 372H236Z"
        fill="#412c22"
        stroke="#97796b"
        strokeWidth=".9"
      />
      <path
        d="M192 350H228L222 368H198Z"
        fill="#332822"
        stroke="#97796b"
        strokeWidth=".9"
      />

      {/* Interchangeable couplings */}
      {[142, 208, 274].map((y) => (
        <g key={y}>
          <rect
            x="179"
            y={y}
            width="62"
            height="5"
            fill="#5c4236"
            stroke="#a8948c"
            strokeWidth=".8"
          />
          <rect
            x="179"
            y={y + 13}
            width="62"
            height="5"
            fill="#5c4236"
            stroke="#a8948c"
            strokeWidth=".8"
          />
          {[188, 202, 216, 230].map((x) => (
            <circle key={x} cx={x} cy={y + 9} r="1.6" fill="#ff8952" />
          ))}
        </g>
      ))}

      {/* Module labels */}
      {[
        { y: 105, label: "01 / NOSE + PAYLOAD" },
        { y: 184, label: "02 / AVIONICS BAY" },
        { y: 250, label: "03 / RECOVERY" },
        { y: 321, label: "04 / PROPULSION" },
      ].map((item) => (
        <g key={item.label}>
          <path
            d={`M242 ${item.y}H288`}
            stroke="#a8897a"
            strokeOpacity=".6"
            strokeDasharray="3 3"
          />
          <text
            x="294"
            y={item.y + 3}
            fontFamily="IBM Plex Mono, monospace"
            fontSize="7.5"
            letterSpacing=".6"
            fill="#d7c0b4"
          >
            {item.label}
          </text>
        </g>
      ))}

      {/* Module library */}
      <rect
        x="470"
        y="96"
        width="222"
        height="220"
        fill="#2c211c"
        stroke="#97796b"
      />
      <text
        x="484"
        y="118"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".8"
        fill="#b69f94"
      >
        MODULE LIBRARY
      </text>
      <text
        x="484"
        y="131"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        letterSpacing=".5"
        fill="#92796d"
      >
        SWAP TO RECONFIGURE
      </text>

      <rect
        x="492"
        y="146"
        width="54"
        height="36"
        fill="url(#mrs-metal)"
        stroke="#c6ab9c"
      />
      <path
        d="M519 140L502 152H536Z"
        fill="#8b6e60"
        stroke="#d1b6a7"
        strokeWidth=".8"
      />
      <text
        x="558"
        y="160"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        letterSpacing=".5"
        fill="#d7c0b4"
      >
        ALT. NOSE CONE
      </text>

      <rect
        x="492"
        y="200"
        width="54"
        height="36"
        fill="url(#mrs-metal)"
        stroke="#c6ab9c"
      />
      <path
        d="M492 220L476 232H492Z"
        fill="#412c22"
        stroke="#97796b"
        strokeWidth=".7"
      />
      <text
        x="558"
        y="214"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        letterSpacing=".5"
        fill="#d7c0b4"
      >
        ALT. FIN SET
      </text>

      <rect
        x="492"
        y="254"
        width="54"
        height="36"
        fill="url(#mrs-metal)"
        stroke="#c6ab9c"
      />
      <text
        x="558"
        y="268"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        letterSpacing=".5"
        fill="#d7c0b4"
      >
        ALT. MOTOR
      </text>

      <path d="M486 304h40" stroke="#ff6b2b" strokeWidth="1.2" />
      <path d="M526 300l6 4-6 4Z" fill="#ff6b2b" />
      <text
        x="540"
        y="309"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        letterSpacing=".6"
        fill="#92796d"
      >
        INTERCHANGEABLE
      </text>

      <text
        x="28"
        y="392"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        letterSpacing=".7"
        fill="#ff8952"
      >
        3D-PRINTED CONSTRUCTION
      </text>
    </ProjectVisualShell>
  );
}

/* ------------------------------------------------------------------
   TELEMETRY LOST — branching text RPG
   ------------------------------------------------------------------ */
export function TelemetryLostVisual({ expanded = false }: VisualProps) {
  return (
    <ProjectVisualShell
      id="tl"
      title="TELEMETRY LOST"
      corner="ILLUSTRATIVE UI"
      subtitle="PERSONAL PROJECT / 2026 / BRANCHING TEXT RPG"
      ariaLabel="Illustrative terminal interface for the Telemetry Lost branching text RPG with a branch map."
      expanded={expanded}
      className="telemetry-lost-visual"
    >
      {/* Terminal window */}
      <rect x="28" y="84" width="372" height="252" fill="#2c211c" stroke="#97796b" />
      <rect x="28" y="84" width="372" height="24" fill="#39271e" />
      <circle cx="44" cy="96" r="3" fill="#a58c81" />
      <circle cx="56" cy="96" r="3" fill="#a58c81" />
      <circle cx="68" cy="96" r="3" fill="#ff6b2b" />
      <text
        x="84"
        y="99"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".8"
        fill="#d7c0b4"
      >
        TELEMETRY LOST // TERMINAL
      </text>

      <g fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#d7c0b4">
        <text x="42" y="132">&gt; T+00:04:12 — LINK LOST</text>
        <text x="42" y="150">&gt; ALTITUDE: UNKNOWN</text>
        <text x="42" y="168">&gt; POWER: 34%</text>
        <text x="42" y="192" fill="#eee2da">
          DESCENT UNSTABLE. DECIDE.
        </text>
      </g>

      <rect
        x="42"
        y="212"
        width="344"
        height="112"
        fill="#211a16"
        stroke="#7c5746"
        strokeDasharray="3 3"
      />
      <g fontFamily="IBM Plex Mono, monospace" fontSize="8" fill="#ff8952">
        <text x="56" y="238">&gt; 1. DEPLOY SECONDARY CHUTE</text>
        <text x="56" y="264">&gt; 2. BURN REMAINING FUEL</text>
        <text x="56" y="290">&gt; 3. BROADCAST DISTRESS</text>
      </g>
      <path d="M42 304H386" stroke="#5c4236" strokeWidth=".8" />
      <text
        x="42"
        y="318"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        letterSpacing=".6"
        fill="#92796d"
      >
        SELECT AN OPTION TO CONTINUE
      </text>

      {/* Branch map */}
      <rect x="428" y="84" width="264" height="252" fill="#2c211c" stroke="#97796b" />
      <text
        x="442"
        y="106"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".8"
        fill="#b69f94"
      >
        BRANCH MAP
      </text>

      <circle cx="560" cy="130" r="9" fill="#ff6b2b" />
      <g stroke="#a8897a" strokeWidth="1">
        <path d="M560 139L494 170" />
        <path d="M560 139V170" />
        <path d="M560 139L626 170" />
      </g>
      <g fill="#8b6e60" stroke="#d1b6a7">
        <circle cx="494" cy="178" r="8" />
        <circle cx="560" cy="178" r="8" />
        <circle cx="626" cy="178" r="8" />
      </g>
      <g stroke="#a8897a" strokeOpacity=".7" strokeWidth=".9">
        <path d="M494 186L470 218" />
        <path d="M494 186L518 218" />
        <path d="M560 186V218" />
        <path d="M626 186L602 218" />
        <path d="M626 186L650 218" />
      </g>
      <g fill="#39271e" stroke="#a8948c" strokeWidth=".8">
        <rect x="456" y="218" width="28" height="14" />
        <rect x="504" y="218" width="28" height="14" />
        <rect x="546" y="218" width="28" height="14" />
        <rect x="588" y="218" width="28" height="14" />
        <rect x="636" y="218" width="28" height="14" />
      </g>
      <text
        x="442"
        y="254"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        fill="#92796d"
      >
        MULTIPLE ENDINGS
      </text>
      <text
        x="442"
        y="270"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        fill="#92796d"
      >
        CHOICES SHAPE THE STORY
      </text>
      <text
        x="442"
        y="298"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        letterSpacing=".6"
        fill="#ff8952"
      >
        STRATEGIC DECISIONS
      </text>
      <text
        x="442"
        y="314"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        fill="#92796d"
      >
        NO SINGLE RIGHT PATH
      </text>
    </ProjectVisualShell>
  );
}

/* ------------------------------------------------------------------
   ASTROFORGE — AI-assisted rocket construction game
   ------------------------------------------------------------------ */
export function AstroForgeVisual({ expanded = false }: VisualProps) {
  const parts = [
    { y: 126, label: "NOSE CONE" },
    { y: 158, label: "FUEL TANK" },
    { y: 190, label: "FIN SET" },
    { y: 222, label: "ENGINE" },
    { y: 254, label: "PARACHUTE" },
    { y: 286, label: "PAYLOAD" },
  ];
  const stats = [
    { label: "MASS", value: 0.62 },
    { label: "THRUST", value: 0.78 },
    { label: "STABILITY", value: 0.48 },
    { label: "DRAG", value: 0.35 },
  ];

  return (
    <ProjectVisualShell
      id="af"
      title="ASTROFORGE"
      corner="ILLUSTRATIVE UI"
      subtitle="PERSONAL GAME DEVELOPMENT PROJECT / 2026"
      ariaLabel="Illustrative game interface for AstroForge showing a parts palette, rocket assembly, and vehicle stats."
      expanded={expanded}
      className="astroforge-visual"
    >
      <defs>
        <linearGradient id="af-metal" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#66493b" />
          <stop offset=".38" stopColor="#c4aea5" />
          <stop offset=".6" stopColor="#9d8378" />
          <stop offset="1" stopColor="#533a2e" />
        </linearGradient>
      </defs>

      {/* Parts palette */}
      <rect x="28" y="84" width="150" height="252" fill="#2c211c" stroke="#97796b" />
      <text
        x="42"
        y="106"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".8"
        fill="#b69f94"
      >
        PARTS
      </text>
      {parts.map((part) => (
        <g key={part.label}>
          <rect
            x="40"
            y={part.y}
            width="18"
            height="18"
            fill="#39271e"
            stroke="#7c5746"
            strokeWidth=".8"
          />
          <text
            x="68"
            y={part.y + 12}
            fontFamily="IBM Plex Mono, monospace"
            fontSize="7"
            letterSpacing=".5"
            fill="#d7c0b4"
          >
            {part.label}
          </text>
        </g>
      ))}

      {/* Assembly */}
      <path
        d="M300 112L278 146H322Z"
        fill="#8b6e60"
        stroke="#d1b6a7"
        strokeWidth="1.1"
      />
      <rect
        x="278"
        y="146"
        width="44"
        height="74"
        fill="url(#af-metal)"
        stroke="#c6ab9c"
      />
      <path d="M286 160h28M286 204h28" stroke="#725040" strokeWidth=".9" />
      <g stroke="#ff8952" strokeWidth="1.1" strokeDasharray="3 3" fill="none">
        <circle cx="300" cy="228" r="11" />
        <circle cx="278" cy="190" r="8" />
        <circle cx="322" cy="190" r="8" />
      </g>
      <path
        d="M384 244l-28 36h28Z"
        fill="#412c22"
        stroke="#ff8952"
        strokeWidth="1.1"
      />
      <path
        d="M356 262L324 240"
        stroke="#ff8952"
        strokeWidth="1.2"
        strokeDasharray="4 3"
      />
      <path d="M328 244l-5-8 9 4Z" fill="#ff6b2b" />
      <text
        x="252"
        y="300"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        letterSpacing=".6"
        fill="#92796d"
      >
        ATTACH POINTS
      </text>

      {/* Stats */}
      <rect x="430" y="84" width="262" height="252" fill="#2c211c" stroke="#97796b" />
      <text
        x="444"
        y="106"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".8"
        fill="#b69f94"
      >
        VEHICLE STATS
      </text>
      {stats.map((metric, index) => {
        const y = 128 + index * 40;
        return (
          <g key={metric.label}>
            <text
              x="444"
              y={y}
              fontFamily="IBM Plex Mono, monospace"
              fontSize="7"
              letterSpacing=".5"
              fill="#d7c0b4"
            >
              {metric.label}
            </text>
            <rect
              x="444"
              y={y + 6}
              width="200"
              height="8"
              fill="#211a16"
              stroke="#7c5746"
              strokeWidth=".7"
            />
            <rect
              x="444"
              y={y + 6}
              width={200 * metric.value}
              height="8"
              fill="#ff6b2b"
            />
            <text
              x="652"
              y={y}
              textAnchor="end"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="7"
              fill="#92796d"
            >
              {Math.round(metric.value * 100)}%
            </text>
          </g>
        );
      })}
      <rect x="444" y="294" width="100" height="26" fill="#ff6b2b" />
      <text
        x="494"
        y="311"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".6"
        fill="#251208"
      >
        RUN TEST
      </text>
      <text
        x="556"
        y="311"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        letterSpacing=".6"
        fill="#92796d"
      >
        AI-ASSISTED
      </text>

      {/* Design loop */}
      <g fontFamily="IBM Plex Mono, monospace" fontSize="7.5" letterSpacing=".6">
        <text x="28" y="368" fill="#ff8952">
          DESIGN
        </text>
        <path d="M92 365h18" stroke="#92796d" />
        <path d="M110 361l6 4-6 4Z" fill="#92796d" />
        <text x="126" y="368" fill="#ff8952">
          BUILD
        </text>
        <path d="M188 365h18" stroke="#92796d" />
        <path d="M206 361l6 4-6 4Z" fill="#92796d" />
        <text x="222" y="368" fill="#ff8952">
          TEST
        </text>
        <path d="M276 365h18" stroke="#92796d" />
        <path d="M294 361l6 4-6 4Z" fill="#92796d" />
        <text x="310" y="368" fill="#ff8952">
          RELAUNCH
        </text>
      </g>
      <path d="M28 384H632" stroke="#5c4236" strokeWidth=".9" />
      <path d="M632 380l8 4-8 4Z" fill="#ff6b2b" />
    </ProjectVisualShell>
  );
}

/* ------------------------------------------------------------------
   VENA — AI-assisted health app concept
   ------------------------------------------------------------------ */
export function VENAVisual({ expanded = false }: VisualProps) {
  return (
    <ProjectVisualShell
      id="vena"
      title="VENA"
      corner="ILLUSTRATIVE UI"
      subtitle="ENTREPRENEURSHIP PROJECT / 2026 / CONCEPT"
      ariaLabel="Illustrative app concept screens for VENA, an AI-assisted injury triage and guidance tool."
      expanded={expanded}
      className="vena-visual"
    >
      {/* Screen one: intake */}
      <rect
        x="60"
        y="86"
        width="170"
        height="278"
        rx="10"
        fill="#2c211c"
        stroke="#97796b"
        strokeWidth="1.2"
      />
      <rect x="60" y="86" width="170" height="26" rx="10" fill="#39271e" />
      <text
        x="145"
        y="103"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="8"
        letterSpacing="1.6"
        fill="#ff8952"
      >
        VENA
      </text>
      <text
        x="74"
        y="134"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        letterSpacing=".5"
        fill="#b69f94"
      >
        DESCRIBE WHAT HAPPENED
      </text>
      <g fill="#211a16">
        <rect x="74" y="144" width="142" height="10" />
        <rect x="74" y="160" width="118" height="10" />
        <rect x="74" y="176" width="130" height="10" />
      </g>
      {["SWELLING", "PAIN", "MOTION"].map((chip, index) => (
        <g key={chip}>
          <rect
            x={74 + index * 49}
            y="200"
            width="45"
            height="16"
            fill="#39271e"
            stroke="#7c5746"
            strokeWidth=".8"
          />
          <text
            x={96.5 + index * 49}
            y="211"
            textAnchor="middle"
            fontFamily="IBM Plex Mono, monospace"
            fontSize="5.5"
            fill="#d7c0b4"
          >
            {chip}
          </text>
        </g>
      ))}
      <rect x="74" y="234" width="142" height="22" fill="#ff6b2b" />
      <text
        x="145"
        y="249"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        letterSpacing=".6"
        fill="#251208"
      >
        CONTINUE
      </text>
      <text
        x="74"
        y="284"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6"
        fill="#92796d"
      >
        AI-ASSISTED INTAKE
      </text>
      <text
        x="74"
        y="300"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6"
        fill="#92796d"
      >
        USER GUIDANCE
      </text>

      {/* Screen two: guidance */}
      <rect
        x="258"
        y="86"
        width="170"
        height="278"
        rx="10"
        fill="#2c211c"
        stroke="#97796b"
        strokeWidth="1.2"
      />
      <rect x="258" y="86" width="170" height="26" rx="10" fill="#39271e" />
      <text
        x="343"
        y="103"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="8"
        letterSpacing="1.2"
        fill="#d7c0b4"
      >
        GUIDANCE
      </text>
      {["REST AND ELEVATE", "ICE 15 MIN / HOUR", "MONITOR 48 HOURS"].map(
        (step, index) => (
          <g key={step}>
            <circle
              cx="276"
              cy={134 + index * 34}
              r="8"
              fill="#39271e"
              stroke="#ff8952"
              strokeWidth="1"
            />
            <text
              x="276"
              y={137 + index * 34}
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="7"
              fill="#ff8952"
            >
              {index + 1}
            </text>
            <text
              x="292"
              y={137 + index * 34}
              fontFamily="IBM Plex Mono, monospace"
              fontSize="6.5"
              fill="#d7c0b4"
            >
              {step}
            </text>
          </g>
        ),
      )}
      <rect
        x="272"
        y="240"
        width="142"
        height="42"
        fill="#39271e"
        stroke="#a8948c"
        strokeWidth=".8"
      />
      <text
        x="343"
        y="258"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        letterSpacing=".4"
        fill="#ff8952"
      >
        SEEK URGENT CARE IF
      </text>
      <text
        x="343"
        y="272"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        fill="#d7c0b4"
      >
        SYMPTOMS WORSEN
      </text>
      <text
        x="272"
        y="304"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6"
        fill="#92796d"
      >
        INJURY TRIAGE CONCEPT
      </text>

      {/* Triage flow panel */}
      <rect x="456" y="86" width="236" height="278" fill="#2c211c" stroke="#97796b" />
      <text
        x="470"
        y="110"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".8"
        fill="#b69f94"
      >
        TRIAGE FLOW
      </text>
      <rect
        x="470"
        y="126"
        width="88"
        height="22"
        fill="#39271e"
        stroke="#7c5746"
        strokeWidth=".8"
      />
      <text
        x="514"
        y="140"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        fill="#d7c0b4"
      >
        SYMPTOMS
      </text>
      <path d="M560 137h22" stroke="#a8897a" />
      <path d="M582 133l6 4-6 4Z" fill="#a8897a" />
      <rect
        x="590"
        y="126"
        width="88"
        height="22"
        fill="#39271e"
        stroke="#7c5746"
        strokeWidth=".8"
      />
      <text
        x="634"
        y="140"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        fill="#d7c0b4"
      >
        AI TRIAGE
      </text>
      <path d="M634 148v18" stroke="#a8897a" />
      <path d="M630 166l4 6 4-6Z" fill="#a8897a" />
      <rect
        x="590"
        y="174"
        width="88"
        height="22"
        fill="#39271e"
        stroke="#7c5746"
        strokeWidth=".8"
      />
      <text
        x="634"
        y="188"
        textAnchor="middle"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6.5"
        fill="#d7c0b4"
      >
        GUIDANCE
      </text>
      {[
        { y: 220, label: "SELF CARE", bg: "#39271e", fg: "#d7c0b4" },
        { y: 248, label: "CLINIC", bg: "#5c4236", fg: "#f5ece1" },
        { y: 276, label: "URGENT", bg: "#ff6b2b", fg: "#251208" },
      ].map((level) => (
        <g key={level.label}>
          <rect
            x="470"
            y={level.y}
            width="80"
            height="20"
            fill={level.bg}
            stroke="#a8948c"
            strokeWidth=".7"
          />
          <text
            x="510"
            y={level.y + 13}
            textAnchor="middle"
            fontFamily="IBM Plex Mono, monospace"
            fontSize="6.5"
            fill={level.fg}
          >
            {level.label}
          </text>
        </g>
      ))}
      <text
        x="470"
        y="318"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6"
        fill="#92796d"
      >
        CONCEPT ONLY — NOT MEDICAL ADVICE
      </text>
    </ProjectVisualShell>
  );
}

/* ------------------------------------------------------------------
   PROTOQUEUE — makerspace 3D print job tracking
   ------------------------------------------------------------------ */
export function ProtoQueueVisual({ expanded = false }: VisualProps) {
  const rows = [
    { job: "ROCKET_FIN_V3", user: "D.KWOK", status: "PRINTING", pct: 0.64 },
    { job: "CUBESAT_FRAME", user: "M.CHEN", status: "QUEUED", pct: 0 },
    { job: "GEAR_PLATE", user: "A.RAO", status: "COMPLETE", pct: 1 },
    { job: "MOTOR_MOUNT", user: "D.KWOK", status: "PRINTING", pct: 0.31 },
    { job: "TEST_COUPLER", user: "S.PATEL", status: "HOLD", pct: 0.12 },
  ];
  const printers = [
    { label: "NOZZLE", value: "210°C" },
    { label: "BED", value: "60°C" },
    { label: "FILAMENT", value: "PLA" },
    { label: "REMAINING", value: "78%" },
  ];

  return (
    <ProjectVisualShell
      id="pq"
      title="PROTOQUEUE"
      corner="ILLUSTRATIVE UI"
      subtitle="SCHOOL MAKERSPACE PROJECT / 2026"
      ariaLabel="Illustrative dashboard for ProtoQueue, a tool that organizes and tracks student 3D print jobs."
      expanded={expanded}
      className="protoqueue-visual"
    >
      <rect x="28" y="84" width="440" height="252" fill="#2c211c" stroke="#97796b" />
      <rect x="28" y="84" width="440" height="24" fill="#39271e" />
      <text
        x="42"
        y="100"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".8"
        fill="#d7c0b4"
      >
        PRINT QUEUE
      </text>

      <g fontFamily="IBM Plex Mono, monospace" fontSize="6.5" fill="#92796d">
        <text x="42" y="126">
          JOB
        </text>
        <text x="180" y="126">
          USER
        </text>
        <text x="266" y="126">
          STATUS
        </text>
        <text x="360" y="126">
          PROGRESS
        </text>
      </g>
      <path d="M28 134H468" stroke="#5c4236" strokeWidth=".9" />

      {rows.map((row, index) => {
        const y = 152 + index * 36;
        const isPrinting = row.status === "PRINTING";
        return (
          <g key={row.job}>
            {index % 2 === 0 && (
              <rect
                x="28"
                y={y - 14}
                width="440"
                height="32"
                fill="#39271e"
                opacity=".35"
              />
            )}
            <text
              x="42"
              y={y + 4}
              fontFamily="IBM Plex Mono, monospace"
              fontSize="7"
              fill="#d7c0b4"
            >
              {row.job}
            </text>
            <text
              x="180"
              y={y + 4}
              fontFamily="IBM Plex Mono, monospace"
              fontSize="7"
              fill="#b69f94"
            >
              {row.user}
            </text>
            <rect
              x="266"
              y={y - 5}
              width="56"
              height="15"
              fill={
                isPrinting
                  ? "#ff6b2b"
                  : row.status === "COMPLETE"
                    ? "#5c4236"
                    : "#39271e"
              }
              stroke="#a8948c"
              strokeWidth=".7"
              strokeDasharray={row.status === "HOLD" ? "2 2" : undefined}
            />
            <text
              x="294"
              y={y + 5.5}
              textAnchor="middle"
              fontFamily="IBM Plex Mono, monospace"
              fontSize="5.8"
              letterSpacing=".4"
              fill={isPrinting ? "#251208" : "#d7c0b4"}
            >
              {row.status}
            </text>
            <rect
              x="360"
              y={y - 1}
              width="94"
              height="7"
              fill="#211a16"
              stroke="#7c5746"
              strokeWidth=".6"
            />
            <rect
              x="360"
              y={y - 1}
              width={94 * row.pct}
              height="7"
              fill="#ff6b2b"
            />
          </g>
        );
      })}

      <rect x="492" y="84" width="200" height="252" fill="#2c211c" stroke="#97796b" />
      <text
        x="506"
        y="106"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7.5"
        letterSpacing=".8"
        fill="#b69f94"
      >
        PRINTER STATUS
      </text>
      {printers.map((item, index) => (
        <g key={item.label}>
          <text
            x="506"
            y={134 + index * 32}
            fontFamily="IBM Plex Mono, monospace"
            fontSize="7"
            fill="#92796d"
          >
            {item.label}
          </text>
          <text
            x="678"
            y={134 + index * 32}
            textAnchor="end"
            fontFamily="IBM Plex Mono, monospace"
            fontSize="7"
            fill="#ff8952"
          >
            {item.value}
          </text>
        </g>
      ))}
      <path d="M506 250H678" stroke="#5c4236" strokeWidth=".9" />
      <text
        x="506"
        y="274"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="7"
        fill="#92796d"
      >
        QUEUE DEPTH
      </text>
      <text
        x="678"
        y="278"
        textAnchor="end"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="16"
        fill="#d7c0b4"
      >
        05
      </text>
      <text
        x="506"
        y="304"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6"
        fill="#92796d"
      >
        STUDENT 3D PRINT JOBS
      </text>
      <text
        x="506"
        y="320"
        fontFamily="IBM Plex Mono, monospace"
        fontSize="6"
        fill="#92796d"
      >
        ORGANIZED + TRACKED
      </text>
    </ProjectVisualShell>
  );
}
