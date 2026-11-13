/* =====================================================================
 * APP SHELL — layout, navigation, pages, and dialogs
 * =====================================================================
 *
 * Most content lives in src/data.ts. This file controls structure:
 *
 *   • navItems ............ the six pages and their menu labels (add a page here)
 *   • routes (in Shell) .... one <Route> per page. Each page is a block of JSX.
 *   • modals ............... the dialog content for projects, résumé, contact, etc.
 *   • renderProjectVisual .. maps a project card to its illustration component
 *
 * Illustrations (SVG drawings) live in src/components/ProjectVisuals.tsx
 * and the Atlas/Photos/Experience components in src/components/.
 * ===================================================================== */

import {
  useCallback,
  useEffect,
  useState,
  type FormEvent,
  type ReactNode,
} from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  HashRouter,
  Link,
  NavLink,
  Navigate,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import {
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Briefcase,
  Camera,
  Globe2,
  Layers,
  NotebookPen,
  Check,
  Copy,
  FileText,
  Mail,
  Menu,
  Minus,
  Radio,
  Send,
  Settings2,
  X,
} from "lucide-react";
import Modal from "./components/Modal";
import GlobeSection from "./components/GlobeSection";
import PhotoArchive from "./components/Gallery";
import ExperienceSection from "./components/ExperienceSection";
import ResumeView from "./components/Resume";
import { OrbitSimulation } from "./components/OrbitDiagram";
import {
  AstroForgeVisual,
  ModularRocketVisual,
  ProtoQueueVisual,
  TelemetryLostVisual,
  VENAVisual,
} from "./components/ProjectVisuals";
import {
  defaultSpotifyUrl,
  notes,
  profile,
  projectCards,
  projectCategories,
  projectDetails,
  type ProjectVisualKind,
} from "./data";

type ModalName =
  | "about"
  | "contact"
  | "music"
  | "resume"
  | "rocketry"
  | "h2gp"
  | "cubesat"
  | "makers"
  | "modular-rocket"
  | "telemetry-lost"
  | "astroforge"
  | "vena"
  | "protoqueue"
  | "orbit"
  | `note-${string}`
  | null;
type SpotifySource = { type: string; id: string; url: string };

function parseSpotifyUrl(input: string): SpotifySource | null {
  const uri = input
    .trim()
    .match(/^spotify:(track|playlist|album):([a-zA-Z0-9]{22})$/);
  if (uri)
    return {
      type: uri[1],
      id: uri[2],
      url: `https://open.spotify.com/${uri[1]}/${uri[2]}`,
    };
  try {
    const url = new URL(input.trim());
    if (url.hostname !== "open.spotify.com" || url.protocol !== "https:")
      return null;
    const match = url.pathname.match(
      /^\/(?:intl-[a-z]{2}\/)?(track|playlist|album)\/([a-zA-Z0-9]{22})\/?$/,
    );
    if (!match) return null;
    return {
      type: match[1],
      id: match[2],
      url: `https://open.spotify.com/${match[1]}/${match[2]}`,
    };
  } catch {
    return null;
  }
}

function loadSpotifySource(): SpotifySource {
  try {
    const saved = localStorage.getItem("flight-log-spotify");
    if (saved) {
      const parsed = parseSpotifyUrl(saved);
      if (parsed) return parsed;
    }
  } catch {
    /* The player still works when browser storage is unavailable. */
  }
  return parseSpotifyUrl(defaultSpotifyUrl)!;
}

/* ---------------------------------------------------------------------
 * WORDMARK / ICON — optional small logo mark used in footer
 * --------------------------------------------------------------------- */
function BrandMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 44 44"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <circle cx="22" cy="22" r="12" stroke="currentColor" strokeWidth="1.2" />
      <ellipse
        cx="22"
        cy="22"
        rx="21"
        ry="8"
        stroke="currentColor"
        strokeWidth="1.2"
        transform="rotate(-38 22 22)"
      />
      <path
        d="M22 4V10M22 34V40M4 22H10M34 22H40"
        stroke="currentColor"
        strokeWidth="1.2"
      />
      <circle cx="36" cy="11" r="2.8" fill="currentColor" />
    </svg>
  );
}

/* ---------------------------------------------------------------------
 * SPOTIFY ICON — used in the Spotify player window
 * --------------------------------------------------------------------- */
function SpotifyMark({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      aria-label="Spotify"
      role="img"
    >
      <circle cx="12" cy="12" r="12" fill="currentColor" />
      <g fill="none" stroke="#271e1a" strokeLinecap="round">
        <path d="M5.3 9c4.6-1.35 9.25-.94 13.3 1.25" strokeWidth="1.7" />
        <path d="M6.2 12.25c3.75-1.05 7.65-.65 11.2 1.2" strokeWidth="1.5" />
        <path d="M7 15.4c3.1-.8 6.15-.5 9.05.95" strokeWidth="1.3" />
      </g>
    </svg>
  );
}

/* ---------------------------------------------------------------------
 * ANIMATION HELPER — fades sections in on scroll. Safe to ignore.
 * --------------------------------------------------------------------- */
function Reveal({
  children,
  className = "",
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0, y: 22 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ---------------------------------------------------------------------
 * SPOTIFY PLAYER — the embedded listening window on the home page
 * --------------------------------------------------------------------- */
function SpotifyWindow({
  source,
  onConfigure,
}: {
  source: SpotifySource;
  onConfigure: () => void;
}) {
  return (
    <div className="spotify-window">
      <div className="window-titlebar">
        <div className="window-title">
          <Radio size={13} />
          <span>ON MY FREQUENCY</span>
        </div>
        <div className="window-title-right">
          <SpotifyMark />
          <span>spotify</span>
          <span className="window-divider" />
          <Minus size={12} />
          <span className="window-square" />
        </div>
      </div>
      <div className="spotify-embed-wrap">
        <iframe
          key={source.url}
          title="Spotify listening station"
          src={`https://open.spotify.com/embed/${source.type}/${source.id}?utm_source=generator&theme=0`}
          width="100%"
          height="152"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
      </div>
      <div className="window-footer">
        <span>A LITTLE FUEL FOR THE LATE NIGHTS.</span>
        <button
          onClick={onConfigure}
          aria-label="Change Spotify track or playlist"
        >
          <Settings2 size={12} /> TUNE IN
        </button>
      </div>
    </div>
  );
}

/* ---------------------------------------------------------------------
 * SPOTIFY SETTINGS DIALOG — lets visitors paste a new song or playlist link
 * --------------------------------------------------------------------- */
function MusicSettings({
  current,
  onSave,
}: {
  current: SpotifySource;
  onSave: (source: SpotifySource) => void;
}) {
  const [url, setUrl] = useState(current.url);
  const [error, setError] = useState("");
  const submit = (event: FormEvent) => {
    event.preventDefault();
    const source = parseSpotifyUrl(url);
    if (!source)
      return setError(
        "Use a full Spotify track, album, or public playlist link (open.spotify.com).",
      );
    onSave(source);
  };
  return (
    <>
      <div className="dialog-eyebrow">
        <SpotifyMark /> YOUR PERSONAL FREQUENCY
      </div>
      <h2 id="dialog-title">Make it your soundtrack.</h2>
      <p className="dialog-intro">
        A favorite song, an album on repeat, or a playlist for late-night
        problem sets. Paste a Spotify link below.
      </p>
      <form onSubmit={submit} className="dialog-form">
        <label htmlFor="spotify-link">SPOTIFY LINK</label>
        <input
          id="spotify-link"
          type="text"
          value={url}
          onChange={(event) => {
            setUrl(event.target.value);
            setError("");
          }}
          placeholder="https://open.spotify.com/playlist/..."
          aria-describedby={error ? "spotify-error" : "spotify-help"}
          required
        />
        {error ? (
          <p className="form-error" id="spotify-error" role="alert">
            {error}
          </p>
        ) : (
          <p className="input-help" id="spotify-help">
            In Spotify: choose a song or playlist, then Share &gt; Copy link.
            Your choice is saved in this browser.
          </p>
        )}
        <button type="submit" className="primary-button">
          Save my frequency <ArrowUpRight size={18} />
        </button>
        <button
          type="button"
          className="text-button restore-button"
          onClick={() => onSave(parseSpotifyUrl(defaultSpotifyUrl)!)}
        >
          Restore Space Song <ArrowRight size={14} />
        </button>
      </form>
      <div className="dialog-fineprint">
        Spotify handles playback. Full tracks may require a Spotify account;
        previews depend on availability.
      </div>
    </>
  );
}

/* ---------------------------------------------------------------------
 * CONTACT DIALOG — opens the visitor's email app with a prefilled draft
 * --------------------------------------------------------------------- */
function ContactForm() {
  const [copied, setCopied] = useState(false);
  const [prepared, setPrepared] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const copyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      setCopyError(false);
      window.setTimeout(() => setCopied(false), 2500);
    } catch {
      setCopyError(true);
    }
  };
  const send = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const subject = encodeURIComponent(`Hello from ${data.get("name")}`);
    const body = encodeURIComponent(
      `${data.get("message")}\n\nFrom: ${data.get("name")}\nReply to: ${data.get("email")}`,
    );
    window.location.href = `mailto:${profile.email}?subject=${subject}&body=${body}`;
    setPrepared(true);
  };
  return (
    <>
      <div className="dialog-eyebrow">OPEN A CHANNEL / SAY HELLO</div>
      <h2 id="dialog-title">Let's make contact.</h2>
      <p className="dialog-intro">
        A project idea, a question, or a particularly good space fact. I'd love
        to hear it.
      </p>
      <div className="email-line">
        <a href={`mailto:${profile.email}`}>{profile.email}</a>
        <button
          className="icon-button"
          aria-label={copied ? "Email copied" : "Copy email address"}
          onClick={copyEmail}
        >
          {copied ? <Check size={17} /> : <Copy size={17} />}
        </button>
      </div>
      {copyError && (
        <p className="input-help" role="status">
          You can select and copy the email address above.
        </p>
      )}
      <form className="dialog-form contact-form" onSubmit={send}>
        <div className="form-row">
          <div>
            <label htmlFor="contact-name">YOUR NAME</label>
            <input
              id="contact-name"
              name="name"
              placeholder="Mission control"
              autoComplete="name"
              required
            />
          </div>
          <div>
            <label htmlFor="contact-email">YOUR EMAIL</label>
            <input
              id="contact-email"
              name="email"
              type="email"
              placeholder="you@planet.earth"
              autoComplete="email"
              required
            />
          </div>
        </div>
        <label htmlFor="contact-message">YOUR TRANSMISSION</label>
        <textarea
          id="contact-message"
          name="message"
          placeholder={`Hello ${profile.name.split(" ")[0]}...`}
          rows={4}
          required
        />
        <button className="primary-button" type="submit">
          Open in my email app <Send size={16} />
        </button>
        <p className="input-help" role="status">
          {prepared
            ? "Your draft is ready in your email app. Review it there and press send. If no app opened, use the email link above."
            : "This opens your email app with a draft. Nothing is sent automatically."}
        </p>
      </form>
    </>
  );
}

/* ---------------------------------------------------------------------
 * PROJECT ILLUSTRATIONS — technical drawings shown on project cards and dialogs
 * --------------------------------------------------------------------- */
function H2GPVisual({ expanded = false }: { expanded?: boolean }) {
  return (
    <svg viewBox="0 0 720 440" className={`project-visual h2gp-visual ${expanded ? "expanded" : ""}`} role="img" aria-label="Illustrative competition vehicle rendering. This is not an Irvington Driving Force team car.">
      <defs>
        <pattern id="h2gp-grid" width="36" height="36" patternUnits="userSpaceOnUse"><path d="M36 0H0V36" fill="none" stroke="#c5afa5" strokeOpacity=".1" /></pattern>
        <linearGradient id="h2gp-body" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e1d2ca" /><stop offset=".45" stopColor="#a78e82" /><stop offset="1" stopColor="#624638" /></linearGradient>
      </defs>
      <rect width="720" height="440" fill="#211a16" /><rect width="720" height="440" fill="url(#h2gp-grid)" />
      <g fill="#b69f94" fontFamily="IBM Plex Mono, monospace">
        <text x="28" y="37" fontSize="9" letterSpacing="1.2">IRVINGTON DRIVING FORCE / H2GP</text>
        <text x="692" y="37" textAnchor="end" fontSize="7" letterSpacing=".7">ILLUSTRATIVE / NOT TEAM HARDWARE</text>
        <text x="28" y="68" fontSize="7" letterSpacing=".8">LEAD ENGINEER / COMPETITION TEAM</text>
      </g>
      <path d="M32 325H688" stroke="#7a5947" strokeOpacity=".6" /><path d="M32 334H688" stroke="#a68c7e" strokeOpacity=".22" strokeDasharray="5 6" />
      <path d="M113 287L150 254 230 243 281 196 421 196 475 233 553 250 601 281 601 294H112Z" fill="url(#h2gp-body)" stroke="#e1b69d" strokeWidth="1.1" />
      <path d="M244 240L294 205H400L442 239Z" fill="#30231d" stroke="#c6a798" strokeWidth="1" /><path d="M275 235L307 211H355V235ZM364 211H396L426 235H364Z" fill="#795e51" stroke="#b69a8d" strokeWidth=".8" />
      <path d="M127 279H211M487 260H563" stroke="#ff6b2b" strokeWidth="3" /><path d="M169 252H223M445 243H476" stroke="#f2e5dc" strokeOpacity=".6" />
      <path d="M110 287H95V298H143M570 281H617V298H572" fill="none" stroke="#c7b0a4" strokeWidth="2" />
      <circle cx="206" cy="294" r="38" fill="#1b1512" stroke="#ad8b78" strokeWidth="3" /><circle cx="206" cy="294" r="24" fill="#463328" stroke="#d5b5a2" strokeWidth="2" /><circle cx="206" cy="294" r="7" fill="#ff6b2b" />
      <circle cx="522" cy="294" r="38" fill="#1b1512" stroke="#ad8b78" strokeWidth="3" /><circle cx="522" cy="294" r="24" fill="#463328" stroke="#d5b5a2" strokeWidth="2" /><circle cx="522" cy="294" r="7" fill="#ff6b2b" />
      <path d="M331 242V266M327 253H335" stroke="#f5e9e2" strokeWidth="1.4" /><path d="M279 272H453" stroke="#8a6b5b" strokeDasharray="3 5" />
      <text x="365" y="263" textAnchor="middle" fill="#f3e9e3" fontFamily="IBM Plex Mono, monospace" fontSize="8" letterSpacing="1">H2GP</text>
      <g fontFamily="IBM Plex Mono, monospace" fill="#b69f94" fontSize="7" letterSpacing=".7"><text x="28" y="385">IRVINGTON DRIVING FORCE</text><text x="692" y="385" textAnchor="end">H2GP COMPETITION</text><text x="28" y="414" fill="#92796d">COMPETITION VEHICLE / CONCEPTUAL ILLUSTRATION</text><text x="692" y="414" textAnchor="end" fill="#92796d">NO TEAM SPECS IMPLIED</text></g>
    </svg>
  );
}

function CubeSatVisual({ expanded = false }: { expanded?: boolean }) {
  return (
    <svg viewBox="0 0 720 440" className={`project-visual cubesat-visual ${expanded ? "expanded" : ""}`} role="img" aria-label="Illustrative CubeSat structure diagram, not MakerCubed flight hardware.">
      <defs>
        <pattern id="cubesat-grid" width="38" height="38" patternUnits="userSpaceOnUse"><path d="M38 0H0V38" fill="none" stroke="#c5afa5" strokeOpacity=".1" /></pattern>
        <linearGradient id="cubesat-frame" x1="0" y1="0" x2="1" y2="1"><stop stopColor="#d1b9ac" /><stop offset=".48" stopColor="#9b7968" /><stop offset="1" stopColor="#4d3428" /></linearGradient>
      </defs>
      <rect width="720" height="440" fill="#211a16" /><rect width="720" height="440" fill="url(#cubesat-grid)" />
      <g fontFamily="IBM Plex Mono, monospace" fill="#b69f94"><text x="28" y="37" fontSize="9" letterSpacing="1.2">MAKERCUBED / CUBESAT PROJECT</text><text x="692" y="37" textAnchor="end" fontSize="7" letterSpacing=".7">STRUCTURES / ILLUSTRATIVE</text><text x="28" y="68" fontSize="7" letterSpacing=".8">STRUCTURAL WORKSTREAM</text></g>
      <path d="M273 125L360 91 447 125 360 161Z" fill="#b69b8d" stroke="#f0dbce" /><path d="M273 125V277L360 315V161Z" fill="#6d4c3b" stroke="#c6ab9c" /><path d="M360 161V315L447 277V125Z" fill="#422e24" stroke="#a58778" />
      <path d="M294 134L360 108 425 134 360 159Z" fill="#2c211b" stroke="#f1e1d8" strokeWidth="1.2" /><path d="M294 134V266L360 295V159Z" fill="#8b6e60" stroke="#f1e1d8" strokeWidth="1.2" /><path d="M360 159V295L425 266V134Z" fill="#573b2c" stroke="#c4a99b" strokeWidth="1.2" />
      <path d="M273 125L294 134M447 125L425 134M273 277L294 266M447 277L425 266" stroke="#ff8952" strokeWidth="2.2" /><path d="M360 91V108M360 315V295" stroke="#ff8952" strokeWidth="2.2" />
      <path d="M273 185H215V163H86V203H215M273 219H215V243H86V203" fill="#413027" stroke="#a98a7b" />
      {[0,1,2,3,4].map((n) => <g key={n}><path d={`M${92+n*25} 168V198M${92+n*25} 208V238`} stroke="#d4bdae" strokeOpacity=".45" /></g>)}
      <path d="M447 185H505V163H634V203H505M447 219H505V243H634V203H505" fill="#413027" stroke="#a98a7b" />
      {[0,1,2,3,4].map((n) => <g key={`r-${n}`}><path d={`M${513+n*25} 168V198M${513+n*25} 208V238`} stroke="#d4bdae" strokeOpacity=".45" /></g>)}
      <circle cx="360" cy="224" r="24" fill="#261c17" stroke="#d1b6a7" /><circle cx="360" cy="224" r="14" fill="#553a2b" stroke="#ff8952" /><circle cx="360" cy="224" r="4" fill="#ff8952" />
      <g stroke="#a8897a" strokeOpacity=".7" fill="none" strokeDasharray="3 4"><path d="M158 147H226L274 166" /><path d="M559 134H498L446 146" /><path d="M550 294H469L426 271" /></g>
      <g fontFamily="IBM Plex Mono, monospace" fill="#d7c0b4" fontSize="7" letterSpacing=".65"><text x="28" y="139">PANEL / FRAME</text><text x="551" y="126">STRUCTURAL RAILS</text><text x="560" y="305">BUS INTERFACE</text></g>
      <g fontFamily="IBM Plex Mono, monospace" fill="#b69f94" fontSize="7" letterSpacing=".7"><text x="28" y="386">MAKERCUBED CUBESAT PROJECT</text><text x="692" y="386" textAnchor="end">STRUCTURES</text><text x="28" y="414" fill="#92796d">ILLUSTRATIVE STRUCTURE STUDY</text><text x="692" y="414" textAnchor="end" fill="#92796d">NO DIMENSIONS IMPLIED</text></g>
    </svg>
  );
}

function MakerCommunityVisual({ expanded = false }: { expanded?: boolean }) {
  return (
    <svg viewBox="0 0 720 440" className={`project-visual maker-visual ${expanded ? "expanded" : ""}`} role="img" aria-label="Illustrative community network graphic for Fremont Student Makers, a 501(c)(3) nonprofit.">
      <defs>
        <pattern id="maker-grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="#c5afa5" strokeOpacity=".1" /></pattern>
        <radialGradient id="maker-hub"><stop stopColor="#754b36" /><stop offset="1" stopColor="#2a1e18" /></radialGradient>
      </defs>
      <rect width="720" height="440" fill="#211a16" /><rect width="720" height="440" fill="url(#maker-grid)" />
      <g fontFamily="IBM Plex Mono, monospace" fill="#b69f94"><text x="28" y="37" fontSize="9" letterSpacing="1.2">FREMONT STUDENT MAKERS</text><text x="692" y="37" textAnchor="end" fontSize="8">501(c)(3) NONPROFIT</text><text x="28" y="68" fontSize="7" letterSpacing=".8">COMMUNITY / CO-FOUNDER</text></g>
      <g stroke="#a88675" strokeWidth="1.2" strokeDasharray="4 5" strokeOpacity=".65"><path d="M360 220L180 132M360 220L540 132M360 220L180 308M360 220L540 308M360 220V105M360 220V337" /></g>
      <g fill="#ff8952"><circle cx="180" cy="132" r="4" /><circle cx="540" cy="132" r="4" /><circle cx="180" cy="308" r="4" /><circle cx="540" cy="308" r="4" /><circle cx="360" cy="105" r="4" /><circle cx="360" cy="337" r="4" /></g>
      <circle cx="360" cy="220" r="76" fill="url(#maker-hub)" stroke="#d8b8a5" strokeWidth="1.3" /><circle cx="360" cy="220" r="64" fill="none" stroke="#ff6b2b" strokeOpacity=".6" />
      <path d="M329 231L348 208 362 220 382 193 399 210" fill="none" stroke="#f5ded0" strokeWidth="2" /><circle cx="329" cy="231" r="3" fill="#ff8952" /><circle cx="348" cy="208" r="3" fill="#ff8952" /><circle cx="362" cy="220" r="3" fill="#ff8952" /><circle cx="382" cy="193" r="3" fill="#ff8952" /><circle cx="399" cy="210" r="3" fill="#ff8952" />
      <g fill="#39271e" stroke="#916e5c"><rect x="111" y="96" width="138" height="72" /><rect x="471" y="96" width="138" height="72" /><rect x="111" y="272" width="138" height="72" /><rect x="471" y="272" width="138" height="72" /><rect x="291" y="75" width="138" height="57" /><rect x="291" y="309" width="138" height="57" /></g>
      <g fontFamily="IBM Plex Mono, monospace" textAnchor="middle"><g fill="#eee2da" fontSize="8" letterSpacing=".7"><text x="180" y="125">IDEAS</text><text x="540" y="125">TOOLS</text><text x="180" y="301">LEARNING</text><text x="540" y="301">COMMUNITY</text><text x="360" y="99">DESIGN</text><text x="360" y="333">BUILD</text></g><g fill="#bda79c" fontSize="6.5"><text x="180" y="143">SHARE A START</text><text x="540" y="143">MAKE TOGETHER</text><text x="180" y="319">LEARN BY MAKING</text><text x="540" y="319">OPEN THE DOOR</text><text x="360" y="116">FROM A SKETCH</text><text x="360" y="349">INTO SOMETHING REAL</text></g><text x="360" y="217" fill="#fff0e6" fontSize="8" letterSpacing=".7">FREMONT</text><text x="360" y="231" fill="#d9b9a8" fontSize="6.5" letterSpacing=".7">STUDENT MAKERS</text></g>
      <g fontFamily="IBM Plex Mono, monospace" fill="#b69f94" fontSize="7" letterSpacing=".7"><text x="28" y="395">CO-FOUNDED BY D. KWOK</text><text x="692" y="395" textAnchor="end">501(c)(3) ORGANIZATION</text><text x="360" y="420" textAnchor="middle" fill="#92796d">COMMUNITY NETWORK / ILLUSTRATIVE</text></g>
    </svg>
  );
}

/* ---------------------------------------------------------------------
 * PROJECT → ILLUSTRATION MAP — connects a card's `visual` value to its drawing
 * --------------------------------------------------------------------- */
function renderProjectVisual(kind: ProjectVisualKind) {
  switch (kind) {
    case "h2gp":
      return <H2GPVisual />;
    case "cubesat":
      return <CubeSatVisual />;
    case "makers":
      return <MakerCommunityVisual />;
    case "modular-rocket":
      return <ModularRocketVisual />;
    case "telemetry-lost":
      return <TelemetryLostVisual />;
    case "astroforge":
      return <AstroForgeVisual />;
    case "vena":
      return <VENAVisual />;
    case "protoqueue":
      return <ProtoQueueVisual />;
    default:
      return null;
  }
}

/* ---------------------------------------------------------------------
 * PAGES — the list of page keys. Add a new key here when you add a page.
 * --------------------------------------------------------------------- */
type PageKey = "home" | "experience" | "projects" | "atlas" | "photos" | "notes";

/* ---------------------------------------------------------------------
 * NAVIGATION — label, route path, and short blurb for each page. Order here is the menu order.
 * --------------------------------------------------------------------- */
const navItems: { id: PageKey; label: string; to: string; blurb: string; icon: ReactNode }[] = [
  { id: "home", label: "Home", to: "/", blurb: "Overview", icon: <ArrowUpRight size={16} /> },
  { id: "experience", label: "Experience", to: "/experience", blurb: "Teams & roles", icon: <Briefcase size={16} /> },
  { id: "projects", label: "Projects", to: "/projects", blurb: "Selected work", icon: <Layers size={16} /> },
  { id: "atlas", label: "Atlas", to: "/atlas", blurb: "Travel globe", icon: <Globe2 size={16} /> },
  { id: "photos", label: "Photos", to: "/photos", blurb: "Archive", icon: <Camera size={16} /> },
  { id: "notes", label: "Field notes", to: "/notes", blurb: "Writing", icon: <NotebookPen size={16} /> },
];

/* ---------------------------------------------------------------------
 * PAGE TITLES — browser tab title for each page
 * --------------------------------------------------------------------- */
const pageTitles: Record<PageKey, string> = {
  home: "Dylan Kwok | A Personal Flight Log",
  experience: "Experience · Dylan Kwok",
  projects: "Projects · Dylan Kwok",
  atlas: "Atlas · Dylan Kwok",
  photos: "Photos · Dylan Kwok",
  notes: "Field Notes · Dylan Kwok",
};

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);
  return null;
}

/* ---------------------------------------------------------------------
 * PAGE HEADER — large title block used at the top of sub-pages
 * --------------------------------------------------------------------- */
function PageIntro({
  index,
  eyebrow,
  title,
  lede,
  children,
}: {
  index: string;
  eyebrow: string;
  title: ReactNode;
  lede?: ReactNode;
  children?: ReactNode;
}) {
  return (
    <div className="page-intro page-width">
      <div className="eyebrow section-eyebrow">
        <span>{index}</span> {eyebrow}
      </div>
      <h1 className="page-intro-title">{title}</h1>
      {lede && <p className="page-intro-lede">{lede}</p>}
      {children}
    </div>
  );
}

/* ---------------------------------------------------------------------
 * CONTINUE-EXPLORING LINKS — shown at the bottom of each sub-page
 * --------------------------------------------------------------------- */
function SectionShortcuts({ current }: { current: PageKey }) {
  const others = navItems.filter((item) => item.id !== current && item.id !== "home");
  return (
    <nav className="section-shortcuts page-width" aria-label="Other sections">
      <span className="section-shortcuts-label">CONTINUE EXPLORING</span>
      <div className="section-shortcuts-grid">
        {others.map((item) => (
          <Link key={item.id} to={item.to} className="section-shortcut">
            <span className="section-shortcut-icon">{item.icon}</span>
            <span className="section-shortcut-copy">
              <strong>{item.label}</strong>
              <small>{item.blurb}</small>
            </span>
            <ArrowUpRight size={15} />
          </Link>
        ))}
      </div>
    </nav>
  );
}

/* ---------------------------------------------------------------------
 * ROOT — wraps the site in the router
 * --------------------------------------------------------------------- */
export default function App() {
  return (
    <HashRouter>
      <ScrollToTop />
      <Shell />
    </HashRouter>
  );
}

/* ---------------------------------------------------------------------
 * SITE SHELL — header, navigation, every page's content, and all dialogs
 * --------------------------------------------------------------------- */
function Shell() {
  const [firstName, ...lastName] = profile.name.split(" ");
  const [modal, setModal] = useState<ModalName>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [noteFilter, setNoteFilter] = useState("All notes");
  const [projectFilter, setProjectFilter] = useState<
    "All" | (typeof projectCategories)[number]["id"]
  >("All");
  const [spotify, setSpotify] = useState(loadSpotifySource);
  const [musicNotice, setMusicNotice] = useState("");
  const reducedMotion = useReducedMotion();
  const closeModal = useCallback(() => setModal(null), []);
  const selectedNote = notes.find((note) => modal === `note-${note.id}`);
  const location = useLocation();

  const currentPage: PageKey =
    (navItems.find((item) => item.to === location.pathname)?.id as PageKey) ??
    "home";

  useEffect(() => {
    document.title = pageTitles[currentPage];
  }, [currentPage]);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!musicNotice) return;
    const timeout = window.setTimeout(() => setMusicNotice(""), 4500);
    return () => window.clearTimeout(timeout);
  }, [musicNotice]);

  const openModal = (name: ModalName) => {
    setMobileMenuOpen(false);
    setModal(name);
  };
  const saveSpotify = (source: SpotifySource) => {
    setSpotify(source);
    try {
      localStorage.setItem("flight-log-spotify", source.url);
    } catch {
      /* Preferences are optional in private browsing. */
    }
    setModal(null);
    setMusicNotice("Frequency updated. Happy listening.");
  };

  const contactAndFooter = (
    <section
      className="contact-section"
      id="contact"
      aria-labelledby="contact-title"
    >
      <div className="page-width">
        <Reveal className="contact-content">
          <div>
            <div className="eyebrow section-eyebrow">
              <span>··</span> OPEN A CHANNEL
            </div>
            <h2 id="contact-title">
              Good things start
              <br />
              with a little curiosity<span className="accent">.</span>
            </h2>
            <p>
              Have an idea, a question, or a shared fascination with the
              sky?
            </p>
          </div>
          <button
            className="primary-button"
            onClick={() => openModal("contact")}
          >
            Let's make contact <ArrowUpRight size={20} />
          </button>
        </Reveal>
        <footer className="site-footer">
          <Link className="footer-brand" to="/">
            <BrandMark />
            <span>
              {profile.name.toUpperCase()}{" "}
              <span className="footer-year">
                / &copy; {new Date().getFullYear()}
              </span>
            </span>
          </Link>
          <span className="footer-message">
            BUILT WITH CURIOSITY. BEST VIEWED ON EARTH.
          </span>
          <button
            type="button"
            className="back-to-top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Back to top <ArrowUpRight size={14} />
          </button>
        </footer>
      </div>
    </section>
  );

  return (
    <>
      <a
        href="#main-content"
        className="skip-link"
        onClick={(event) => {
          event.preventDefault();
          const main = document.getElementById("main-content");
          main?.setAttribute("tabindex", "-1");
          main?.focus();
        }}
      >
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <Link to="/" className="brand" aria-label={`${profile.name}, home`}>
            <span>
              <strong>{profile.name.toUpperCase()}</strong>
              <small>A PERSONAL FLIGHT LOG</small>
            </span>
          </Link>
          <nav className="desktop-nav" aria-label="Main navigation">
            {navItems.map((item) => (
              <NavLink
                to={item.to}
                key={item.id}
                end={item.to === "/"}
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
          <div className="header-actions">
            <button
              className="contact-button resume-button"
              onClick={() => openModal("resume")}
              aria-label="Open résumé"
            >
              <FileText size={14} /> Résumé
            </button>
            <button
              className="header-contact icon-button"
              onClick={() => openModal("contact")}
              aria-label="Let's talk"
            >
              <Mail size={18} />
            </button>
          </div>
          <button
            className="mobile-menu-toggle icon-button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close navigation" : "Open navigation"}
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.nav
              id="mobile-navigation"
              className="mobile-nav"
              aria-label="Mobile navigation"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="mobile-nav-links">
                {navItems.map((item, index) => (
                  <NavLink
                    to={item.to}
                    key={item.id}
                    end={item.to === "/"}
                    className={({ isActive }) => (isActive ? "active" : "")}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <span>0{index + 1}</span>
                    {item.label}
                    <ArrowUpRight size={18} />
                  </NavLink>
                ))}
              </div>
              <div className="mobile-nav-actions">
                <button onClick={() => openModal("resume")}>
                  Résumé <FileText size={18} />
                </button>
                <button onClick={() => openModal("contact")}>
                  Let's talk <ArrowUpRight size={18} />
                </button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </header>

      <main id="main-content" className={`page page-${currentPage}`}>
        <Routes>
          {/* PAGE: HOME — hero, intro, Spotify, chapter directory, contact footer */}
          <Route
            path="/"
            element={
              <>
                <section className="hero" id="home" aria-labelledby="hero-title">
                  <motion.img
                    className="hero-image"
                    src="/images/orbital-station.png"
                    alt="A silver research satellite above the curved horizon of a distant planet"
                    initial={reducedMotion ? false : { scale: 1.055 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 2.4, ease: "easeOut" }}
                    fetchPriority="high"
                  />
                  <div className="hero-shade" />
                  <div className="hero-content page-width">
                    <motion.div
                      className="eyebrow hero-eyebrow"
                      initial={reducedMotion ? false : { opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.12, duration: 0.6 }}
                    >
                      <span className="tiny-cross">+</span> AEROSPACE ENGINEERING / YEAR
                      01
                    </motion.div>
                    <motion.h1
                      id="hero-title"
                      initial={reducedMotion ? false : { opacity: 0, y: 22 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{
                        delay: 0.2,
                        duration: 0.8,
                        ease: [0.22, 1, 0.36, 1],
                      }}
                    >
                      {firstName}
                      <br />
                      {lastName.join(" ")}
                      <span className="accent">.</span>
                    </motion.h1>
                    <motion.div
                      initial={reducedMotion ? false : { opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4, duration: 0.7 }}
                    >
                      <p className="hero-description">
                        An engineer in the making.
                        <br />A little closer to the stars, every day.
                      </p>
                      <div className="hero-actions">
                        <Link to="/projects" className="primary-button">
                          Explore my work <ArrowDownRight size={19} />
                        </Link>
                        <button
                          type="button"
                          className="hero-secondary"
                          onClick={() =>
                            document
                              .getElementById("about")
                              ?.scrollIntoView({ behavior: "smooth", block: "start" })
                          }
                        >
                          Meet the human <ArrowUpRight size={15} />
                        </button>
                      </div>
                    </motion.div>
                  </div>
                </section>
                <section
                  className="context-section"
                  id="about"
                  aria-labelledby="about-title"
                >
                  <div className="context-grid page-width">
                    <Reveal className="context-copy">
                      <div className="eyebrow section-eyebrow">
                        <span>01</span> A LITTLE CONTEXT
                      </div>
                      <h2 id="about-title">
                        A lifelong space kid.
                        <br />
                        An engineer in progress.
                      </h2>
                      <p>
                        I'm {firstName}, a first-year aerospace engineering student.
                        This is my little corner of the internet for the things I build,
                        the things I learn, and whatever comes next.
                      </p>
                      <button
                        className="text-button"
                        onClick={() => openModal("about")}
                      >
                        A bit more about me <ArrowUpRight size={16} />
                      </button>
                    </Reveal>
                    <Reveal className="context-music" delay={0.12}>
                      <SpotifyWindow
                        source={spotify}
                        onConfigure={() => openModal("music")}
                      />
                      <a
                        href={spotify.url}
                        target="_blank"
                        rel="noreferrer"
                        className="spotify-outlink"
                      >
                        Sound better in the app? Open Spotify <ArrowUpRight size={12} />
                      </a>
                    </Reveal>
                  </div>
                </section>
                <section className="home-directory light-section" aria-labelledby="directory-title">
                  <div className="page-width">
                    <div className="eyebrow section-eyebrow">
                      <span>02</span> INSIDE THE FLIGHT LOG
                    </div>
                    <div className="section-heading">
                      <h2 id="directory-title">Pick a chapter.</h2>
                      <p>
                        Each section lives on its own page,
                        <br />
                        so it stays quick to read on any screen.
                      </p>
                    </div>
                    <div className="directory-grid">
                      {navItems
                        .filter((item) => item.id !== "home")
                        .map((item, index) => (
                          <Link key={item.id} to={item.to} className="directory-card">
                            <span className="directory-index">0{index + 1}</span>
                            <span className="directory-icon">{item.icon}</span>
                            <span className="directory-copy">
                              <strong>{item.label}</strong>
                              <small>{item.blurb}</small>
                            </span>
                            <ArrowUpRight size={18} />
                          </Link>
                        ))}
                    </div>
                  </div>
                </section>
                {contactAndFooter}
              </>
            }
          />
          {/* PAGE: EXPERIENCE — the five roles and the résumé card */}
          <Route
            path="/experience"
            element={
              <>
                <PageIntro
                  index="01"
                  eyebrow="EXPERIENCE / TEAMS / PRACTICE"
                  title={<>Five roles. <span className="accent">One direction.</span></>}
                  lede="From community founding to satellite structures, building more ways into aerospace."
                />
                <ExperienceSection
                  onOpenResume={() => openModal("resume")}
                  onContact={() => openModal("contact")}
                  compactHeading
                />
                <SectionShortcuts current="experience" />
                {contactAndFooter}
              </>
            }
          />
          {/* PAGE: PROJECTS — filter tabs, project cards, orbital model link */}
          <Route
            path="/projects"
            element={
              <>
                <section
                  className="projects-section light-section"
                  id="projects"
                  aria-labelledby="projects-title"
                >
                  <div className="page-width">
                    <Reveal>
                      <div className="eyebrow section-eyebrow">
                        <span>01</span> SELECTED WORK / TEAMS / PROJECTS
                      </div>
                      <div className="section-heading">
                        <h2 id="projects-title">From flight hardware to software.</h2>
                        <p>
                          Teams and organizations I help lead,
                          <br />
                          plus the projects I build myself.
                        </p>
                      </div>
                    </Reveal>
                    <div
                      className="project-filters"
                      role="toolbar"
                      aria-label="Filter projects by category"
                    >
                      {projectCategories.map((category) => {
                        const count =
                          category.id === "All"
                            ? projectCards.length
                            : projectCards.filter(
                                (card) => card.category === category.id,
                              ).length;
                        const active = projectFilter === category.id;
                        return (
                          <button
                            key={category.id}
                            type="button"
                            className={`project-filter-button ${active ? "active" : ""}`}
                            aria-pressed={active}
                            onClick={() => setProjectFilter(category.id)}
                          >
                            <span>{category.label}</span>
                            <span className="project-filter-count">{count}</span>
                          </button>
                        );
                      })}
                    </div>
                    <div className="projects-grid" aria-live="polite">
                      {projectCards
                        .filter(
                          (card) =>
                            projectFilter === "All" || card.category === projectFilter,
                        )
                        .map((card, index) => (
                          <Reveal key={card.id} delay={Math.min(index, 4) * 0.04}>
                            <button
                              className="project-link"
                              onClick={() =>
                                openModal(card.modal as (ModalName & string) | null)
                              }
                              aria-label={card.ariaLabel}
                            >
                              <div
                                className={`project-image ${
                                  card.visual === "rocketry"
                                    ? "rocket-image"
                                    : "project-visual-card"
                                }`}
                              >
                                {card.visual === "rocketry" ? (
                                  <img
                                    src="/images/model-rocket.svg"
                                    alt="Illustrative competition rocket concept, not Untitled Rocketry hardware"
                                    loading="lazy"
                                  />
                                ) : (
                                  renderProjectVisual(card.visual)
                                )}
                                <span className="project-image-index">{card.code}</span>
                                {card.badge && (
                                  <span
                                    className={`project-badge ${card.badge === "NEW" ? "is-new" : ""}`}
                                  >
                                    {card.badge}
                                  </span>
                                )}
                              </div>
                              <div className="project-title-row">
                                <h3>{card.title}</h3>
                                <span className="project-arrow">
                                  <ArrowUpRight size={20} />
                                </span>
                              </div>
                              <div className="project-meta">
                                <span>{card.tag}</span>
                                <span>{card.meta}</span>
                              </div>
                            </button>
                          </Reveal>
                        ))}
                    </div>
                    <Reveal className="projects-footnote">
                      <span className="status-dot" />
                      <span>Four organizations. Five personal builds. One direction.</span>
                      <span className="footnote-rule" />
                    </Reveal>
                    <Reveal className="orbit-demo-link">
                      <span className="eyebrow">ON THIS SITE / A SMALL LEARNING TOOL</span>
                      <span>Explore how an elliptical orbit moves.</span>
                      <button
                        className="text-button"
                        onClick={() => openModal("orbit")}
                        aria-label="Explore and interact with the orbital sandbox"
                      >
                        Open orbital model <ArrowUpRight size={15} />
                      </button>
                    </Reveal>
                  </div>
                </section>
                <SectionShortcuts current="projects" />
                {contactAndFooter}
              </>
            }
          />
          {/* PAGE: ATLAS — travel globe and destination directory (GlobeSection) */}
          <Route
            path="/atlas"
            element={
              <>
                <GlobeSection />
                <SectionShortcuts current="atlas" />
                {contactAndFooter}
              </>
            }
          />
          {/* PAGE: PHOTOS — photo archive (Gallery component) */}
          <Route
            path="/photos"
            element={
              <>
                <PhotoArchive />
                <SectionShortcuts current="photos" />
                {contactAndFooter}
              </>
            }
          />
          {/* PAGE: FIELD NOTES — articles list (notes in src/data.ts) */}
          <Route
            path="/notes"
            element={
              <>
                <section
                  className="notes-section light-section"
                  id="notes"
                  aria-labelledby="notes-title"
                >
                  <div className="page-width">
                    <Reveal>
                      <div className="eyebrow section-eyebrow">
                        <span>01</span> FIELD NOTES
                      </div>
                      <div className="section-heading notes-heading">
                        <h2 id="notes-title">Notes from the ground.</h2>
                        <div className="note-filters" aria-label="Filter field notes">
                          {["All notes", "Learning", "Perspective"].map((filter) => (
                            <button
                              key={filter}
                              className={noteFilter === filter ? "active" : ""}
                              aria-pressed={noteFilter === filter}
                              onClick={() => setNoteFilter(filter)}
                            >
                              {filter}
                            </button>
                          ))}
                        </div>
                      </div>
                    </Reveal>
                    <div className="notes-list" aria-live="polite">
                      {notes
                        .filter(
                          (note) =>
                            noteFilter === "All notes" || note.category === noteFilter,
                        )
                        .map((note) => (
                          <button
                            className="note-row"
                            key={note.id}
                            onClick={() => openModal(`note-${note.id}`)}
                          >
                            <span className="note-date">{note.date}</span>
                            <span className="note-title">{note.title}</span>
                            <span className="note-category">{note.category}</span>
                            <ArrowUpRight size={20} />
                          </button>
                        ))}
                    </div>
                  </div>
                </section>
                <SectionShortcuts current="notes" />
                {contactAndFooter}
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <AnimatePresence>
        {musicNotice && (
          <motion.div
            className="toast"
            role="status"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
          >
            <Check size={16} />
            {musicNotice}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {modal && (
          <Modal
            key="main-dialog"
            contentKey={modal}
            onClose={closeModal}
            wide={
              modal === "rocketry" ||
              modal === "h2gp" ||
              modal === "cubesat" ||
              modal === "makers" ||
              modal === "modular-rocket" ||
              modal === "telemetry-lost" ||
              modal === "astroforge" ||
              modal === "vena" ||
              modal === "protoqueue" ||
              modal === "orbit" ||
              modal === "resume"
            }
          >
            {modal === "music" && (
              <MusicSettings current={spotify} onSave={saveSpotify} />
            )}
            {modal === "contact" && <ContactForm />}
            {modal === "resume" && <ResumeView />}
            {modal === "rocketry" && (
              <>
                <div className="dialog-eyebrow">FOUNDER / FREMONT, CALIFORNIA</div>
                <h2 id="dialog-title">Untitled Rocketry.</h2>
                <p className="dialog-intro">
                  A rocketry community organization founded in Fremont, California.
                </p>
                <img
                  className="dialog-project-image"
                  src="/images/model-rocket.svg"
                  alt="Illustrative rocket concept; not Untitled Rocketry team hardware"
                />
                <div className="project-detail-grid">
                  <div>
                    <h3>The organization</h3>
                    <p>
                      I founded Untitled Rocketry as a community organization
                      centered on rocketry.
                    </p>
                  </div>
                  <div>
                    <h3>The competition</h3>
                    <p>
                      Untitled Rocketry competes in the American Rocketry
                      Challenge.
                    </p>
                  </div>
                </div>
                <div className="project-learning">
                  <span className="dialog-eyebrow">ROLE</span>
                  <p>
                    Founder · Community builder · American Rocketry Challenge
                    competitor
                  </p>
                </div>
                <p className="dialog-fineprint">
                  The rocket drawing is an illustrative concept image and does
                  not represent the team's competition vehicle.
                </p>
              </>
            )}
            {modal === "h2gp" && (
              <>
                <div className="dialog-eyebrow">LEAD ENGINEER / H2GP COMPETITION</div>
                <h2 id="dialog-title">Irvington Driving Force.</h2>
                <p className="dialog-intro">
                  Leading the engineering work for a team competing in H2GP.
                </p>
                <div className="dialog-project-visual">
                  <H2GPVisual expanded />
                </div>
                <div className="project-detail-grid">
                  <div>
                    <h3>The team</h3>
                    <p>
                      Irvington Driving Force is the team I lead as Lead Engineer.
                    </p>
                  </div>
                  <div>
                    <h3>The competition</h3>
                    <p>
                      The team competes in H2GP. My role is engineering
                      leadership within the competition team.
                    </p>
                  </div>
                </div>
                <p className="dialog-fineprint">
                  The vehicle drawing is illustrative and is not a depiction of
                  the team's actual car or specifications.
                </p>
              </>
            )}
            {modal === "cubesat" && (
              <>
                <div className="dialog-eyebrow">SPACE HARDWARE / STRUCTURES</div>
                <h2 id="dialog-title">MakerCubed CubeSat Project.</h2>
                <p className="dialog-intro">
                  Working on structures for a student CubeSat project.
                </p>
                <div className="dialog-project-visual">
                  <CubeSatVisual expanded />
                </div>
                <div className="project-learning">
                  <span className="dialog-eyebrow">MY ROLE</span>
                  <p>
                    I work on structures for the MakerCubed CubeSat Project.
                  </p>
                </div>
                <p className="dialog-fineprint">
                  This diagram is illustrative only. It does not show MakerCubed
                  hardware, dimensions, or flight configuration.
                </p>
              </>
            )}
            {modal === "makers" && (
              <>
                <div className="dialog-eyebrow">CO-FOUNDER / 501(c)(3)</div>
                <h2 id="dialog-title">Fremont Student Makers.</h2>
                <p className="dialog-intro">
                  A Fremont student-maker nonprofit co-founded by Dylan.
                </p>
                <div className="dialog-project-visual">
                  <MakerCommunityVisual expanded />
                </div>
                <div className="project-learning">
                  <span className="dialog-eyebrow">THE ORGANIZATION</span>
                  <p>
                    Fremont Student Makers is a 501(c)(3) nonprofit. I am a
                    co-founder.
                  </p>
                </div>
                <p className="dialog-fineprint">
                  The network drawing is a symbolic illustration, not a diagram
                  of specific programs or services.
                </p>
              </>
            )}
            {(["modular-rocket", "telemetry-lost", "astroforge", "vena", "protoqueue"] as const).map(
              (key) => {
                if (modal !== key) return null;
                const detail = projectDetails[key];
                const visuals = {
                  "modular-rocket": <ModularRocketVisual expanded />,
                  "telemetry-lost": <TelemetryLostVisual expanded />,
                  astroforge: <AstroForgeVisual expanded />,
                  vena: <VENAVisual expanded />,
                  protoqueue: <ProtoQueueVisual expanded />,
                } as const;
                return (
                  <div key={key}>
                    <div className="dialog-eyebrow">{detail.eyebrow}</div>
                    <h2 id="dialog-title">{detail.title}</h2>
                    <p className="dialog-intro">{detail.intro}</p>
                    <div className="dialog-project-visual">{visuals[key]}</div>
                    <div className="project-detail-grid">
                      {detail.sections.map((section) => (
                        <div key={section.heading}>
                          <h3>{section.heading}</h3>
                          <p>{section.body}</p>
                        </div>
                      ))}
                    </div>
                    <div className="project-learning">
                      <span className="dialog-eyebrow">ROLE</span>
                      <p>{detail.role}</p>
                    </div>
                    <div className="project-facts">
                      <span>{detail.facts[0]}</span>
                      <span>{detail.facts[1]}</span>
                    </div>
                    <p className="dialog-fineprint">{detail.fineprint}</p>
                  </div>
                );
              },
            )}
            {modal === "about" && (
              <>
                <div className="dialog-eyebrow">
                  01 / THE HUMAN BEHIND THE FLIGHT LOG
                </div>
                <h2 id="dialog-title">Curiosity, with a trajectory.</h2>
                <p className="dialog-intro">
                  I'm {firstName}. A first-year aerospace engineering student, a
                  habitual question-asker, and a firm believer that making
                  something is one of the best ways to understand it.
                </p>
                <div className="about-dialog-body">
                  <p>
                    I've been fascinated by flight for as long as I can
                    remember. Now I'm turning that fascination into a
                    foundation: learning the physics and getting involved in
                    real engineering teams, from competitive rocketry to CubeSat
                    structures.
                  </p>
                  <p>
                    This website is a living log of the teams and communities I
                    help build, the engineering I get to learn, and the places
                    that keep me curious.
                  </p>
                  <div className="about-detail">
                    <span>ON MY DESK</span>
                    <p>
                      Untitled Rocketry, Irvington Driving Force, and the
                      MakerCubed CubeSat Project.
                    </p>
                  </div>
                  <div className="about-detail">
                  <span>ALSO LEADING</span>
                    <p>
                      Building student maker communities through Fremont
                      Student Makers and Irvington Maker Club.
                    </p>
                  </div>
                </div>
                <button
                  className="primary-button"
                  onClick={() => setModal("contact")}
                >
                  Say hello <ArrowUpRight size={17} />
                </button>
              </>
            )}
            {modal === "orbit" && (
              <>
                <div className="dialog-eyebrow">
                  INTERACTIVE LEARNING TOOL / ORBITAL MOTION
                </div>
                <h2 id="dialog-title">A little orbital thinking.</h2>
                <p className="dialog-intro">
                  A small interactive demonstration of Keplerian orbital motion.
                </p>
                <OrbitSimulation />
                <div className="project-detail-grid">
                  <div>
                    <h3>What is happening?</h3>
                    <p>
                      Earth sits at one focus of the ellipse. Eccentricity
                      describes its shape: zero is circular, and higher values
                      make a more stretched-out orbit.
                    </p>
                  </div>
                  <div>
                    <h3>Under the hood</h3>
                    <p>
                      The visualizer solves Kepler's equation to demonstrate how
                      an orbiting body's speed changes along an ellipse.
                    </p>
                  </div>
                </div>
                <p className="dialog-fineprint">
                  This interactive model is included as an on-page learning tool.
                  It is not a flight-planning application.
                </p>
              </>
            )}
            {selectedNote && (
              <article className="note-article">
                <div className="dialog-eyebrow">
                  FIELD NOTE {selectedNote.number} /{" "}
                  {selectedNote.category.toUpperCase()}
                </div>
                <h2 id="dialog-title">{selectedNote.title}</h2>
                <div className="article-meta">
                  <span>{selectedNote.date}</span>
                  <span>{selectedNote.readingTime}</span>
                </div>
                <p className="article-summary">{selectedNote.summary}</p>
                {selectedNote.paragraphs.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
                <div className="article-signoff">
                  <BrandMark />
                  <span>
                    {profile.name}
                    <br />
                    <small>Still learning. Always looking up.</small>
                  </span>
                </div>
              </article>
            )}
          </Modal>
        )}
      </AnimatePresence>
    </>
  );
}
