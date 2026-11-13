import { useId } from "react";

export type FlagCode =
  | "US"
  | "US-CA"
  | "US-AZ"
  | "US-NY"
  | "US-MA"
  | "US-FL"
  | "US-HI"
  | "MX"
  | "JM"
  | "CA"
  | "ES"
  | "FR"
  | "GB"
  | "IT"
  | "CH"
  | "CN"
  | "JP"
  | "AE";

function starPoints(cx: number, cy: number, outerR: number, innerR: number) {
  const pts: string[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outerR : innerR;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    pts.push(
      `${(cx + Math.cos(angle) * r).toFixed(2)},${(cy + Math.sin(angle) * r).toFixed(2)}`,
    );
  }
  return pts.join(" ");
}

function UnionJackCanton({ width = 9.8, height = 7 }: { width?: number; height?: number }) {
  const sx = width / 21;
  const sy = height / 14;
  return (
    <g transform={`scale(${sx} ${sy})`}>
      <rect width="21" height="14" fill="#012169" />
      <path d="M0 0L21 14M21 0L0 14" stroke="#f8f5ef" strokeWidth="2.6" />
      <path d="M0 0L21 14M21 0L0 14" stroke="#c8102e" strokeWidth="1.2" />
      <path d="M10.5 0V14M0 7H21" stroke="#f8f5ef" strokeWidth="4.2" />
      <path d="M10.5 0V14M0 7H21" stroke="#c8102e" strokeWidth="2.4" />
    </g>
  );
}

/**
 * Pure 21x14 SVG vector contents for each national or U.S. state flag.
 * Can be rendered inside an HTML <svg> badge or directly inside the SVG globe.
 */
export function FlagSvgContents({ code }: { code: FlagCode }) {
  const clipId = useId().replace(/:/g, "");

  return (
    <g>
      <defs>
        <clipPath id={`flag-clip-${clipId}`}>
          <rect width="21" height="14" rx="1.2" />
        </clipPath>
      </defs>
      <g clipPath={`url(#flag-clip-${clipId})`}>
        {code === "US" && (
          <g>
            <rect width="21" height="14" fill="#f8f5ef" />
            {[0, 2, 4, 6, 8, 10, 12].map((y) => (
              <rect key={y} y={y} width="21" height="1.08" fill="#bf0a30" />
            ))}
            <rect width="9.5" height="7.56" fill="#002868" />
            {[1.6, 3.8, 6.0, 8.0].map((cx) =>
              [1.6, 3.8, 5.9].map((cy) => (
                <circle
                  key={`${cx}-${cy}`}
                  cx={cx}
                  cy={cy}
                  r="0.48"
                  fill="#f8f5ef"
                />
              )),
            )}
          </g>
        )}

        {code === "US-CA" && (
          <g>
            {/* California Bear Flag */}
            <rect width="21" height="14" fill="#f8f5ef" />
            <rect y="11.5" width="21" height="2.5" fill="#b71234" />
            <polygon
              points={starPoints(3.6, 3.3, 1.55, 0.62)}
              fill="#b71234"
            />
            <ellipse cx="11.2" cy="8.7" rx="4.6" ry="0.9" fill="#4f7c33" />
            <path
              d="M7.6 8.2C7.6 6.8 8.7 5.7 10.2 5.6L12.6 5.5C13.8 5.5 14.7 6.3 14.9 7.4L14.7 8.5H13.4L13.2 7.8H11.8L11.6 8.5H10.1L9.9 7.8H8.9L8.6 8.5H7.6Z"
              fill="#6e4324"
            />
            <circle cx="8.1" cy="6.6" r="0.85" fill="#6e4324" />
            <rect x="6.6" y="9.8" width="9.2" height="0.7" fill="#8b7d70" opacity=".65" />
          </g>
        )}

        {code === "US-AZ" && (
          <g>
            {/* Arizona Copper Star & 13 Sunburst Rays */}
            <rect width="21" height="7" fill="#bf0a30" />
            <path
              d="M10.5 7L0 3.8V1.2ZM10.5 7L1.8 0H5.2ZM10.5 7L7.6 0H10.2ZM10.5 7L12.6 0H15.4ZM10.5 7L18.4 0H21V1.4ZM10.5 7L21 4.1V6.3Z"
              fill="#fed700"
            />
            <rect y="7" width="21" height="7" fill="#002868" />
            <polygon
              points={starPoints(10.5, 7.1, 3.6, 1.45)}
              fill="#d96b27"
              stroke="#8c3b0e"
              strokeWidth="0.3"
            />
          </g>
        )}

        {code === "US-NY" && (
          <g>
            {/* New York State Flag */}
            <rect width="21" height="14" fill="#002d72" />
            <circle cx="10.5" cy="3.1" r="1.15" fill="#e5b84b" />
            <path
              d="M6.2 4.6L5.1 9.6H6.9L7.4 5.4ZM14.8 4.6L15.9 9.6H14.1L13.6 5.4Z"
              fill="#e5b84b"
            />
            <path
              d="M8.1 4.4H12.9V8.1C12.9 9.5 10.5 10.5 10.5 10.5C10.5 10.5 8.1 9.5 8.1 8.1Z"
              fill="#5b9bd5"
              stroke="#e5b84b"
              strokeWidth="0.7"
            />
            <circle cx="10.5" cy="6.2" r="1.1" fill="#ffd15c" />
            <path d="M8.4 7.7L9.8 6.7L11.1 7.5L12.6 6.6V8.6H8.4Z" fill="#3a6b4c" />
            <path
              d="M6.2 11.2Q10.5 12.2 14.8 11.2"
              stroke="#f8f5ef"
              strokeWidth="1.05"
              fill="none"
            />
          </g>
        )}

        {code === "US-MA" && (
          <g>
            {/* Massachusetts State Flag */}
            <rect width="21" height="14" fill="#f8f5ef" />
            <rect x="9.3" y="2.1" width="2.4" height="0.9" fill="#e0ab26" />
            <path
              d="M7.8 3.4H13.2V7.7C13.2 9.5 10.5 10.8 10.5 10.8C10.5 10.8 7.8 9.5 7.8 7.7Z"
              fill="#00338d"
            />
            <circle cx="9.0" cy="4.8" r="0.55" fill="#f8f5ef" />
            <path
              d="M10.5 4.6C11.1 4.6 11.4 5.2 11.4 6.1L11.7 8.5H9.3L9.6 6.1C9.6 5.2 9.9 4.6 10.5 4.6Z"
              fill="#e0ab26"
            />
            <path
              d="M6.8 11.1Q10.5 12.5 14.2 11.1"
              stroke="#00338d"
              strokeWidth="0.95"
              fill="none"
            />
          </g>
        )}

        {code === "US-FL" && (
          <g>
            {/* Florida State Flag */}
            <rect width="21" height="14" fill="#f8f5ef" />
            <path
              d="M0 0L21 14M21 0L0 14"
              stroke="#c8102e"
              strokeWidth="2.5"
            />
            <circle
              cx="10.5"
              cy="7"
              r="3.1"
              fill="#f7e3a1"
              stroke="#d97706"
              strokeWidth="0.75"
            />
            <path d="M8.1 7.6Q10.5 6.3 12.9 7.6" stroke="#2f7d32" strokeWidth="1.2" fill="none" />
            <circle cx="10.5" cy="6.2" r="0.95" fill="#ea580c" />
          </g>
        )}

        {code === "US-HI" && (
          <g>
            {/* Hawaii State Flag (Ka Hae Hawai'i) */}
            {[
              "#f8f5ef",
              "#c8102e",
              "#012169",
              "#f8f5ef",
              "#c8102e",
              "#012169",
              "#f8f5ef",
              "#c8102e",
            ].map((fill, idx) => (
              <rect
                key={idx}
                y={idx * 1.75}
                width="21"
                height="1.75"
                fill={fill}
              />
            ))}
            <UnionJackCanton width={9.8} height={7} />
          </g>
        )}

        {code === "MX" && (
          <g>
            <rect width="7" height="14" fill="#006847" />
            <rect x="7" width="7" height="14" fill="#f8f5ef" />
            <rect x="14" width="7" height="14" fill="#ce1126" />
            <circle cx="10.5" cy="7" r="1.45" fill="#8b5a2b" />
          </g>
        )}

        {code === "JM" && (
          <g>
            <rect width="21" height="14" fill="#009b3a" />
            <polygon points="0,0 9.2,7 0,14" fill="#141414" />
            <polygon points="21,0 11.8,7 21,14" fill="#141414" />
            <path
              d="M0 0L21 14M21 0L0 14"
              stroke="#fed100"
              strokeWidth="2.3"
            />
          </g>
        )}

        {code === "CA" && (
          <g>
            <rect width="5.25" height="14" fill="#d80621" />
            <rect x="5.25" width="10.5" height="14" fill="#f8f5ef" />
            <rect x="15.75" width="5.25" height="14" fill="#d80621" />
            <path
              d="M10.5 2.7L11.4 4.8L13.2 4.3L12.4 6.3L13.9 7.2L11.8 8.3L12.1 9.8H10.8V11.6H10.2V9.8H8.9L9.2 8.3L7.1 7.2L8.6 6.3L7.8 4.3L9.6 4.8Z"
              fill="#d80621"
            />
          </g>
        )}

        {code === "ES" && (
          <g>
            <rect width="21" height="3.5" fill="#aa151b" />
            <rect y="3.5" width="21" height="7" fill="#f1bf00" />
            <rect y="10.5" width="21" height="3.5" fill="#aa151b" />
            <rect
              x="5.1"
              y="5.1"
              width="2.3"
              height="3.6"
              rx="0.6"
              fill="#aa151b"
              stroke="#784421"
              strokeWidth="0.4"
            />
          </g>
        )}

        {code === "FR" && (
          <g>
            <rect width="7" height="14" fill="#002654" />
            <rect x="7" width="7" height="14" fill="#f8f5ef" />
            <rect x="14" width="7" height="14" fill="#ed2939" />
          </g>
        )}

        {code === "GB" && <UnionJackCanton width={21} height={14} />}

        {code === "IT" && (
          <g>
            <rect width="7" height="14" fill="#009246" />
            <rect x="7" width="7" height="14" fill="#f8f5ef" />
            <rect x="14" width="7" height="14" fill="#ce2b37" />
          </g>
        )}

        {code === "CH" && (
          <g>
            <rect width="21" height="14" fill="#d52b1e" />
            <rect x="9.1" y="3.1" width="2.8" height="7.8" fill="#ffffff" />
            <rect x="6.6" y="5.6" width="7.8" height="2.8" fill="#ffffff" />
          </g>
        )}

        {code === "CN" && (
          <g>
            <rect width="21" height="14" fill="#de2910" />
            <polygon
              points={starPoints(4.4, 4.3, 2.25, 0.88)}
              fill="#ffde00"
            />
            {[
              [7.9, 1.8],
              [9.3, 3.3],
              [9.3, 5.4],
              [7.9, 6.9],
            ].map(([cx, cy], idx) => (
              <circle key={idx} cx={cx} cy={cy} r="0.68" fill="#ffde00" />
            ))}
          </g>
        )}

        {code === "JP" && (
          <g>
            <rect width="21" height="14" fill="#f9f6f0" />
            <circle cx="10.5" cy="7" r="3.85" fill="#bc002d" />
          </g>
        )}

        {code === "AE" && (
          <g>
            <rect x="5.5" width="15.5" height="4.67" fill="#009739" />
            <rect x="5.5" y="4.67" width="15.5" height="4.67" fill="#f8f5ef" />
            <rect x="5.5" y="9.33" width="15.5" height="4.67" fill="#161616" />
            <rect width="5.5" height="14" fill="#ef3340" />
          </g>
        )}
      </g>
      <rect
        x="0.35"
        y="0.35"
        width="20.3"
        height="13.3"
        rx="1"
        fill="none"
        stroke="#ffffff"
        strokeOpacity=".24"
        strokeWidth="0.7"
      />
    </g>
  );
}

export default function FlagBadge({
  code,
  label,
  size = "sm",
  className = "",
}: {
  code: FlagCode;
  label?: string;
  size?: "xs" | "sm" | "md" | "lg";
  className?: string;
}) {
  const dimensions = {
    xs: { width: 15, height: 10 },
    sm: { width: 18, height: 12 },
    md: { width: 22, height: 15 },
    lg: { width: 30, height: 20 },
  }[size];

  return (
    <svg
      viewBox="0 0 21 14"
      width={dimensions.width}
      height={dimensions.height}
      className={`flag-badge flag-badge-${size} ${className}`}
      role={label ? "img" : undefined}
      aria-label={label}
      aria-hidden={label ? undefined : true}
    >
      <FlagSvgContents code={code} />
    </svg>
  );
}
