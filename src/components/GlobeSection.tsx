import { useEffect, useMemo, useRef, useState } from "react";
import { geoDistance, geoGraticule10, geoOrthographic, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import world from "world-atlas/countries-110m.json";
import {
  ArrowLeft,
  ArrowRight,
  ChevronDown,
  Compass,
  Flag,
  Home,
  Layers3,
  LocateFixed,
  Minus,
  Pause,
  Play,
  Plus,
  RotateCcw,
  Search,
  X,
} from "lucide-react";
import FlagBadge, { FlagSvgContents, type FlagCode } from "./FlagBadge";
import {
  travelSectors,
  travelSpots,
  type TravelSector,
  type TravelSpot,
} from "../data";

type Rotation = [number, number];
type SortMode = "region" | "country" | "alpha" | "longitude";
type CountryFeature = {
  type: "Feature";
  properties: { name?: string };
  geometry: { type: string; coordinates: unknown };
};

const topology = world as unknown as {
  objects: { countries: unknown };
  [key: string]: unknown;
};
const countries = (
  feature(
    topology as never,
    topology.objects.countries as never,
  ) as unknown as {
    features: CountryFeature[];
  }
).features;

const ATLAS_COUNTRY_NAME: Record<string, string> = {
  "United States": "United States of America",
  Mexico: "Mexico",
  Jamaica: "Jamaica",
  Canada: "Canada",
  Spain: "Spain",
  France: "France",
  "United Kingdom": "United Kingdom",
  Switzerland: "Switzerland",
  Italy: "Italy",
  China: "China",
  Japan: "Japan",
  "United Arab Emirates": "United Arab Emirates",
};

const COUNTRY_SHORT_LABEL: Record<string, string> = {
  "United States": "USA",
  "United Kingdom": "UK",
  "United Arab Emirates": "UAE",
};

const visitedAtlasCountryNames = new Set(
  travelSpots.map((spot) => ATLAS_COUNTRY_NAME[spot.country] ?? spot.country),
);

const home = travelSpots.find((spot) => spot.kind === "Home")!;
const initialRotation: Rotation = [98, -28];
const initialDefaultId = "san-francisco";
const GLOBE_CENTER_X = 260;
const GLOBE_CENTER_Y = 260;
const BASE_RADIUS = 232;
const EARTH_RADIUS_KM = 6371;

function greatCirclePath(
  projection: ReturnType<typeof geoOrthographic>,
  from: [number, number],
  to: [number, number],
  isVisible: (coordinates: [number, number]) => boolean,
) {
  const interpolate = (a: [number, number], b: [number, number], t: number) => {
    const [lon1, lat1] = a.map((value) => (value * Math.PI) / 180) as [
      number,
      number,
    ];
    const [lon2, lat2] = b.map((value) => (value * Math.PI) / 180) as [
      number,
      number,
    ];
    const d =
      2 *
      Math.asin(
        Math.sqrt(
          Math.sin((lat2 - lat1) / 2) ** 2 +
            Math.cos(lat1) * Math.cos(lat2) * Math.sin((lon2 - lon1) / 2) ** 2,
        ),
      );
    if (d === 0) return [a[0], a[1]] as [number, number];
    const A = Math.sin((1 - t) * d) / Math.sin(d);
    const B = Math.sin(t * d) / Math.sin(d);
    const x =
      A * Math.cos(lat1) * Math.cos(lon1) + B * Math.cos(lat2) * Math.cos(lon2);
    const y =
      A * Math.cos(lat1) * Math.sin(lon1) + B * Math.cos(lat2) * Math.sin(lon2);
    const z = A * Math.sin(lat1) + B * Math.sin(lat2);
    return [
      (Math.atan2(y, x) * 180) / Math.PI,
      (Math.atan2(z, Math.sqrt(x * x + y * y)) * 180) / Math.PI,
    ] as [number, number];
  };

  let path = "";
  let previousVisible = false;
  for (let i = 0; i <= 72; i++) {
    const position = interpolate(from, to, i / 72);
    const point = isVisible(position) ? projection(position) : null;
    if (
      !point ||
      Math.hypot(point[0] - GLOBE_CENTER_X, point[1] - GLOBE_CENTER_Y) >
        BASE_RADIUS + 2
    ) {
      previousVisible = false;
      continue;
    }
    path += `${previousVisible ? "L" : "M"}${point[0].toFixed(1)},${point[1].toFixed(1)}`;
    previousVisible = true;
  }
  return path;
}

type LayoutPin = {
  spot: TravelSpot;
  rawX: number;
  rawY: number;
  x: number;
  y: number;
  displaced: boolean;
  labelLeft: boolean;
  inActiveFilter: boolean;
};

function computeDeCrowdedPins(
  spots: TravelSpot[],
  projection: ReturnType<typeof geoOrthographic>,
  isVisible: (coordinates: [number, number]) => boolean,
  activeIds: Set<string>,
  minDistance: number,
): LayoutPin[] {
  const nodes: LayoutPin[] = [];
  for (const spot of spots) {
    if (!isVisible(spot.coordinates)) continue;
    const projected = projection(spot.coordinates);
    if (!projected) continue;
    const [rawX, rawY] = projected;
    if (
      Math.hypot(rawX - GLOBE_CENTER_X, rawY - GLOBE_CENTER_Y) >
      BASE_RADIUS - 6
    ) {
      continue;
    }
    nodes.push({
      spot,
      rawX,
      rawY,
      x: rawX,
      y: rawY,
      displaced: false,
      labelLeft: false,
      inActiveFilter: activeIds.has(spot.id),
    });
  }

  // Iterative screen-space relaxation so dense clusters (Switzerland, Italy, Hawaii, China, Japan, US Southwest) never overlap.
  const iterations = 18;
  for (let step = 0; step < iterations; step++) {
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i];
        const b = nodes[j];
        let dx = b.x - a.x;
        let dy = b.y - a.y;
        const dist = Math.hypot(dx, dy);
        if (dist < minDistance) {
          if (dist < 0.01) {
            const angle = ((i * 7 + j * 13) % 12) * ((Math.PI * 2) / 12);
            dx = Math.cos(angle);
            dy = Math.sin(angle);
          } else {
            dx /= dist;
            dy /= dist;
          }
          const push = (minDistance - dist) * 0.54;
          const weightA = a.spot.kind === "Home" ? 0.25 : 0.5;
          const weightB = b.spot.kind === "Home" ? 0.25 : 0.5;
          a.x -= dx * push * (weightA / (weightA + weightB)) * 2;
          a.y -= dy * push * (weightA / (weightA + weightB)) * 2;
          b.x += dx * push * (weightB / (weightA + weightB)) * 2;
          b.y += dy * push * (weightB / (weightA + weightB)) * 2;
        }
      }
    }
    for (const node of nodes) {
      node.x = node.x * 0.9 + node.rawX * 0.1;
      node.y = node.y * 0.9 + node.rawY * 0.1;
      const radialDx = node.x - GLOBE_CENTER_X;
      const radialDy = node.y - GLOBE_CENTER_Y;
      const radialDist = Math.hypot(radialDx, radialDy);
      const maxR = BASE_RADIUS - 10;
      if (radialDist > maxR) {
        node.x = GLOBE_CENTER_X + (radialDx / radialDist) * maxR;
        node.y = GLOBE_CENTER_Y + (radialDy / radialDist) * maxR;
      }
    }
  }

  for (const node of nodes) {
    node.displaced = Math.hypot(node.x - node.rawX, node.y - node.rawY) > 2.4;
    node.labelLeft = node.x > GLOBE_CENTER_X + 38;
  }

  return nodes;
}

function getRecommendedZoom(spot: TravelSpot): number {
  if (spot.sector === "Pacific") return 2.9;
  if (spot.cluster === "Swiss Alps & Léman") return 2.75;
  if (spot.cluster === "Italy") return 2.5;
  if (spot.cluster === "Japanese Archipelago") return 2.35;
  if (spot.sector === "Europe") return 2.2;
  if (spot.sector === "Asia") return 2.25;
  if (spot.cluster === "Desert Southwest" || spot.cluster === "East Coast")
    return 1.85;
  if (spot.sector === "Middle East") return 2.0;
  return 1.45;
}

function getCountryCamera(country: string): {
  rotation: Rotation;
  zoom: number;
} {
  if (country === "United States") {
    return { rotation: [106, -33], zoom: 1.45 };
  }
  const spots = travelSpots.filter((s) => s.country === country);
  if (spots.length === 0) return { rotation: initialRotation, zoom: 1 };
  const avgLon =
    spots.reduce((sum, s) => sum + s.coordinates[0], 0) / spots.length;
  const avgLat =
    spots.reduce((sum, s) => sum + s.coordinates[1], 0) / spots.length;
  const zoomMap: Record<string, number> = {
    Switzerland: 2.85,
    Italy: 2.55,
    Japan: 2.35,
    China: 2.2,
    Spain: 2.35,
    Mexico: 1.9,
  };
  return {
    rotation: [-avgLon, -avgLat * 0.78],
    zoom: zoomMap[country] ?? 2.2,
  };
}

export default function GlobeSection() {
  const [rotation, setRotation] = useState<Rotation>(initialRotation);
  const [zoom, setZoom] = useState<number>(1);
  const [selectedId, setSelectedId] = useState<string>(initialDefaultId);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [activeSector, setActiveSector] = useState<"All" | TravelSector>("All");
  const [activeCountry, setActiveCountry] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState<SortMode>("region");
  const [spinning, setSpinning] = useState(false);
  const [directoryOpen, setDirectoryOpen] = useState(false);
  const [countriesExpanded, setCountriesExpanded] = useState(false);

  const drag = useRef({ active: false, x: 0, y: 0, rotation: initialRotation });
  const selected =
    travelSpots.find((spot) => spot.id === selectedId) ?? travelSpots[0];

  const countryStats = useMemo(() => {
    const map = new Map<
      string,
      { country: string; shortName: string; flag: FlagCode; count: number }
    >();
    for (const spot of travelSpots) {
      const existing = map.get(spot.country);
      if (existing) {
        existing.count += 1;
      } else {
        map.set(spot.country, {
          country: spot.country,
          shortName: COUNTRY_SHORT_LABEL[spot.country] ?? spot.country,
          flag: spot.countryFlag,
          count: 1,
        });
      }
    }
    return [...map.values()].sort(
      (a, b) => b.count - a.count || a.country.localeCompare(b.country),
    );
  }, []);

  const usStateCount = useMemo(
    () =>
      new Set(
        travelSpots
          .filter((spot) => spot.flagCode.startsWith("US-"))
          .map((spot) => spot.flagCode),
      ).size,
    [],
  );

  const filteredSpots = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    const list = travelSpots.filter((spot) => {
      const matchesSector =
        activeSector === "All" || spot.sector === activeSector;
      if (!matchesSector) return false;
      const matchesCountry =
        !activeCountry || spot.country === activeCountry;
      if (!matchesCountry) return false;
      if (!q) return true;
      return (
        spot.place.toLowerCase().includes(q) ||
        spot.region.toLowerCase().includes(q) ||
        spot.country.toLowerCase().includes(q) ||
        spot.sector.toLowerCase().includes(q) ||
        spot.cluster.toLowerCase().includes(q) ||
        spot.flagLabel.toLowerCase().includes(q)
      );
    });

    if (sortMode === "alpha") {
      return [...list].sort((a, b) => a.place.localeCompare(b.place));
    }
    if (sortMode === "longitude") {
      return [...list].sort((a, b) => a.coordinates[0] - b.coordinates[0]);
    }
    return list;
  }, [activeSector, activeCountry, searchQuery, sortMode]);

  const activeIds = useMemo(
    () => new Set(filteredSpots.map((spot) => spot.id)),
    [filteredSpots],
  );

  const projection = useMemo(
    () =>
      geoOrthographic()
        .rotate(rotation)
        .translate([GLOBE_CENTER_X, GLOBE_CENTER_Y])
        .scale(BASE_RADIUS * zoom)
        .clipAngle(90),
    [rotation, zoom],
  );

  const path = useMemo(() => geoPath(projection), [projection]);
  const center: [number, number] = [-rotation[0], -rotation[1]];
  const isVisible = (coordinates: [number, number]) =>
    geoDistance(coordinates, center) < Math.PI / 2 - 0.015;

  const route = greatCirclePath(
    projection,
    home.coordinates,
    selected.coordinates,
    isVisible,
  );

  const layoutPins = useMemo(
    () =>
      computeDeCrowdedPins(
        travelSpots,
        projection,
        isVisible,
        activeIds,
        zoom >= 2 ? 17.5 : 13.8,
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [rotation, zoom, activeIds],
  );

  const distanceFromHomeKm = useMemo(() => {
    if (selected.id === home.id) return 0;
    return Math.round(
      geoDistance(home.coordinates, selected.coordinates) * EARTH_RADIUS_KM,
    );
  }, [selected]);

  useEffect(() => {
    if (!spinning) return;
    let frame = 0;
    let previous = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(now - previous, 80);
      previous = now;
      setRotation(([longitude, latitude]) => [
        longitude - delta * 0.012,
        latitude,
      ]);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [spinning]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      setSpinning(false);
  }, []);

  const focusSpot = (spot: TravelSpot, adjustZoom = true) => {
    setSelectedId(spot.id);
    setSpinning(false);
    setRotation([-spot.coordinates[0], -spot.coordinates[1] * 0.72]);
    if (adjustZoom) {
      const recommended = getRecommendedZoom(spot);
      setZoom((current) => Math.max(current, recommended));
    }
  };

  const selectSpot = (id: string, adjustZoom = true) => {
    const spot = travelSpots.find((item) => item.id === id);
    if (!spot) return;
    focusSpot(spot, adjustZoom);
  };

  const handleSectorChange = (sectorId: "All" | TravelSector) => {
    setActiveSector(sectorId);
    setActiveCountry(null);
    setSpinning(false);
    const preset = travelSectors.find((item) => item.id === sectorId);
    if (preset) {
      setRotation(preset.rotation);
      setZoom(preset.zoom);
    }
    if (sectorId !== "All" && selected.sector !== sectorId) {
      const firstInSector = travelSpots.find(
        (spot) => spot.sector === sectorId,
      );
      if (firstInSector) setSelectedId(firstInSector.id);
    }
  };

  const handleCountryToggle = (country: string) => {
    setSpinning(false);
    if (activeCountry === country) {
      setActiveCountry(null);
      setRotation(initialRotation);
      setZoom(1);
      return;
    }
    setActiveSector("All");
    setActiveCountry(country);
    const camera = getCountryCamera(country);
    setRotation(camera.rotation);
    setZoom(camera.zoom);
    if (selected.country !== country) {
      const firstInCountry = travelSpots.find(
        (spot) => spot.country === country,
      );
      if (firstInCountry) setSelectedId(firstInCountry.id);
    }
  };

  const stepSelection = (direction: -1 | 1) => {
    const pool = filteredSpots.length > 0 ? filteredSpots : travelSpots;
    const currentIndex = pool.findIndex((item) => item.id === selected.id);
    const nextIndex =
      currentIndex === -1
        ? 0
        : (currentIndex + direction + pool.length) % pool.length;
    focusSpot(pool[nextIndex], true);
  };

  const rotate = (step: number) => {
    setSpinning(false);
    setRotation(([longitude, latitude]) => [
      longitude + step / Math.sqrt(zoom),
      Math.max(-68, Math.min(68, latitude)),
    ]);
  };

  const adjustZoom = (delta: number) => {
    setSpinning(false);
    setZoom((value) =>
      Math.max(1, Math.min(3.5, Number((value + delta).toFixed(2)))),
    );
  };

  const resetGlobe = () => {
    setSpinning(false);
    setActiveSector("All");
    setActiveCountry(null);
    setSearchQuery("");
    setRotation(initialRotation);
    setZoom(1);
    setSelectedId(initialDefaultId);
  };

  const groupedSpots = useMemo(() => {
    if (sortMode === "country") {
      return countryStats
        .map((entry) => ({
          title: entry.country.toUpperCase(),
          flag: entry.flag as FlagCode | undefined,
          spots: filteredSpots.filter((spot) => spot.country === entry.country),
        }))
        .filter((group) => group.spots.length > 0);
    }
    if (sortMode !== "region") {
      return [
        {
          title: "SORTED DESTINATIONS",
          flag: undefined,
          spots: filteredSpots,
        },
      ];
    }
    const order: TravelSector[] = [
      "North America",
      "Europe",
      "Pacific",
      "Asia",
      "Middle East",
    ];
    return order
      .map((sector) => ({
        title: sector.toUpperCase(),
        flag: undefined,
        spots: filteredSpots.filter((spot) => spot.sector === sector),
      }))
      .filter((group) => group.spots.length > 0);
  }, [filteredSpots, sortMode, countryStats]);

  const highlightedAtlasCountry =
    ATLAS_COUNTRY_NAME[activeCountry ?? selected.country] ?? selected.country;

  return (
    <section className="atlas-section" id="atlas" aria-labelledby="atlas-title">
      <div className="page-width">
        <div className="eyebrow section-eyebrow">
          <span>01</span> THE LONG WAY HOME
        </div>
        <div className="section-heading atlas-heading">
          <h2 id="atlas-title">A world worth crossing.</h2>
          <p>
            {travelSpots.length} coordinates across {countryStats.length}{" "}
            countries.
            <br />
            Filter by country, sector, or zoom into a cluster.
          </p>
        </div>

        {/* Country Counter & Visited Passport Deck */}
        <div
          className="atlas-passport-deck"
          aria-label="Visited countries counter and filter"
        >
          <div className="atlas-counter-metrics">
            <div className="atlas-metric primary-metric">
              <span className="atlas-metric-value">
                {String(countryStats.length).padStart(2, "0")}
              </span>
              <span className="atlas-metric-label">
                <Flag size={10} aria-hidden="true" /> COUNTRIES LOGGED
              </span>
            </div>
            <div className="atlas-metric">
              <span className="atlas-metric-value">
                {String(usStateCount).padStart(2, "0")}
              </span>
              <span className="atlas-metric-label">U.S. STATES</span>
            </div>
            <div className="atlas-metric">
              <span className="atlas-metric-value">
                {String(travelSpots.length).padStart(2, "0")}
              </span>
              <span className="atlas-metric-label">DESTINATIONS</span>
            </div>
          </div>

          <div
            className={`atlas-country-strip ${countriesExpanded ? "is-expanded" : ""}`}
            role="toolbar"
            aria-label="Filter destinations by country"
          >
            {countryStats.map((entry) => {
              const isSelectedCountry = activeCountry === entry.country;
              return (
                <button
                  key={entry.country}
                  type="button"
                  className={`atlas-country-chip ${isSelectedCountry ? "active" : ""}`}
                  aria-pressed={isSelectedCountry}
                  onClick={() => handleCountryToggle(entry.country)}
                  title={`Filter by ${entry.country} (${entry.count})`}
                >
                  <FlagBadge code={entry.flag} size="xs" />
                  <span>{entry.shortName}</span>
                  <span className="country-chip-count">{entry.count}</span>
                </button>
              );
            })}
            {activeCountry && (
              <button
                type="button"
                className="atlas-country-reset"
                onClick={() => handleCountryToggle(activeCountry)}
              >
                <X size={11} /> ALL COUNTRIES
              </button>
            )}
          </div>
          <button
            type="button"
            className="atlas-countries-more"
            aria-expanded={countriesExpanded}
            onClick={() => setCountriesExpanded((value) => !value)}
          >
            {countriesExpanded ? "SHOW FEWER" : `SHOW ALL ${countryStats.length} COUNTRIES`}
            <ChevronDown size={12} aria-hidden="true" />
          </button>
        </div>

        {/* Sector Filter Bar */}
        <div
          className="atlas-sector-bar"
          role="toolbar"
          aria-label="Filter destinations by region"
        >
          {travelSectors.map((sector) => {
            const count =
              sector.id === "All"
                ? travelSpots.length
                : travelSpots.filter((spot) => spot.sector === sector.id)
                    .length;
            const active = activeSector === sector.id && !activeCountry;
            return (
              <button
                key={sector.id}
                type="button"
                className={`atlas-sector-pill ${active ? "active" : ""}`}
                aria-pressed={active}
                onClick={() => handleSectorChange(sector.id)}
              >
                <span className="sector-pill-name">{sector.label}</span>
                <span className="sector-pill-count">{count}</span>
              </button>
            );
          })}
        </div>

        <div className="atlas-layout">
          <div className="globe-card">
            <div className="globe-toolbar">
              <div className="globe-label">
                <LocateFixed size={13} />
                <span>
                  {activeCountry
                    ? `COUNTRY / ${activeCountry.toUpperCase()}`
                    : activeSector === "All"
                      ? `GLOBAL (${home.place.toUpperCase()} BASE)`
                      : `SECTOR / ${activeSector.toUpperCase()}`}
                </span>
              </div>
              <div className="globe-status">
                <span className="status-dot" /> ZOOM {zoom.toFixed(1)}× ·{" "}
                {layoutPins.length} IN VIEW
              </div>
            </div>

            <div className="globe-stage">
              <svg
                viewBox="0 0 520 530"
                className="globe-svg"
                role="group"
                aria-label="Interactive globe with travel destinations. Drag to rotate, use zoom or country and region filters to separate clusters, or select a place from the list."
                onDoubleClick={() => adjustZoom(0.6)}
                onPointerDown={(event) => {
                  drag.current = {
                    active: true,
                    x: event.clientX,
                    y: event.clientY,
                    rotation,
                  };
                  setSpinning(false);
                  event.currentTarget.setPointerCapture(event.pointerId);
                }}
                onPointerMove={(event) => {
                  if (!drag.current.active) return;
                  const dx = event.clientX - drag.current.x;
                  const dy = event.clientY - drag.current.y;
                  const sensitivity = 0.32 / Math.sqrt(zoom);
                  setRotation([
                    drag.current.rotation[0] + dx * sensitivity,
                    Math.max(
                      -78,
                      Math.min(
                        78,
                        drag.current.rotation[1] - dy * sensitivity * 0.85,
                      ),
                    ),
                  ]);
                }}
                onPointerUp={() => {
                  drag.current.active = false;
                }}
                onPointerCancel={() => {
                  drag.current.active = false;
                }}
              >
                <defs>
                  <radialGradient id="ocean-fill" cx="35%" cy="28%">
                    <stop offset="0%" stopColor="#4d382e" />
                    <stop offset="58%" stopColor="#342a25" />
                    <stop offset="100%" stopColor="#1a1512" />
                  </radialGradient>
                  <radialGradient id="globe-glow">
                    <stop offset="60%" stopColor="#ff6b2b" stopOpacity=".09" />
                    <stop offset="100%" stopColor="#ff6b2b" stopOpacity="0" />
                  </radialGradient>
                  <pattern
                    id="globe-grid"
                    width="24"
                    height="24"
                    patternUnits="userSpaceOnUse"
                  >
                    <path
                      d="M24 0H0V24"
                      fill="none"
                      stroke="#af9285"
                      strokeOpacity=".08"
                    />
                  </pattern>
                  <clipPath id="globe-viewport-clip">
                    <circle
                      cx={GLOBE_CENTER_X}
                      cy={GLOBE_CENTER_Y}
                      r={BASE_RADIUS}
                    />
                  </clipPath>
                </defs>

                <circle
                  cx={GLOBE_CENTER_X}
                  cy={GLOBE_CENTER_Y}
                  r="246"
                  fill="url(#globe-glow)"
                />
                <circle
                  cx={GLOBE_CENTER_X}
                  cy={GLOBE_CENTER_Y}
                  r={BASE_RADIUS}
                  fill="url(#ocean-fill)"
                  stroke="#927468"
                  strokeOpacity=".55"
                />

                <g clipPath="url(#globe-viewport-clip)">
                  <circle
                    cx={GLOBE_CENTER_X}
                    cy={GLOBE_CENTER_Y}
                    r={BASE_RADIUS}
                    fill="url(#globe-grid)"
                    opacity=".65"
                  />
                  <g aria-hidden="true">
                    <path
                      d={path(geoGraticule10()) || undefined}
                      fill="none"
                      stroke="#b39588"
                      strokeOpacity=".17"
                      strokeWidth=".7"
                    />
                  </g>
                  <g aria-hidden="true">
                    {countries.map((country, index) => {
                      const d = path(country as unknown as never);
                      if (!d) return null;
                      const countryName = country.properties?.name ?? "";
                      const isCurrent = countryName === highlightedAtlasCountry;
                      const isVisited = visitedAtlasCountryNames.has(countryName);
                      return (
                        <path
                          key={index}
                          d={d}
                          fill={
                            isCurrent
                              ? "#8e6350"
                              : isVisited
                                ? "#755344"
                                : "#584035"
                          }
                          fillOpacity=".86"
                          stroke={isCurrent ? "#e0b39e" : "#b99f93"}
                          strokeOpacity={isCurrent ? ".55" : ".33"}
                          strokeWidth={isCurrent ? ".75" : ".55"}
                        />
                      );
                    })}
                  </g>

                  <path
                    d={route || undefined}
                    fill="none"
                    stroke="#ff6b2b"
                    strokeWidth="1.4"
                    strokeDasharray="5 5"
                    strokeOpacity=".88"
                  />

                  {/* Leader lines for de-crowded pins */}
                  <g aria-hidden="true">
                    {layoutPins.map((pin) =>
                      pin.displaced ? (
                        <g key={`leader-${pin.spot.id}`}>
                          <circle
                            cx={pin.rawX}
                            cy={pin.rawY}
                            r="1.4"
                            fill="#ff8952"
                            opacity={pin.inActiveFilter ? ".75" : ".28"}
                          />
                          <line
                            x1={pin.rawX}
                            y1={pin.rawY}
                            x2={pin.x}
                            y2={pin.y}
                            stroke="#ff8952"
                            strokeWidth=".75"
                            strokeOpacity={pin.inActiveFilter ? ".6" : ".22"}
                          />
                        </g>
                      ) : null,
                    )}
                  </g>
                </g>

                <circle
                  cx={GLOBE_CENTER_X}
                  cy={GLOBE_CENTER_Y}
                  r={BASE_RADIUS}
                  fill="none"
                  stroke="#ff6b2b"
                  strokeOpacity=".28"
                />

                {/* Interactive destination pins */}
                {[...layoutPins]
                  .sort((a, b) => {
                    const score = (p: LayoutPin) =>
                      (p.spot.id === selectedId ? 10 : 0) +
                      (p.spot.id === hoveredId ? 5 : 0) +
                      (p.inActiveFilter ? 2 : 0);
                    return score(a) - score(b);
                  })
                  .map((pin) => {
                    const { spot, x, y, labelLeft, inActiveFilter } = pin;
                    const active = spot.id === selectedId;
                    const hovered = spot.id === hoveredId;
                    const showCalloutFlag = active || hovered;
                    const isHome = spot.kind === "Home";
                    return (
                      <g
                        key={spot.id}
                        transform={`translate(${x} ${y})`}
                        className={`globe-pin ${active ? "active" : ""} ${!inActiveFilter ? "dimmed" : ""}`}
                        role="button"
                        tabIndex={inActiveFilter ? 0 : -1}
                        aria-label={`Explore ${spot.place}, ${spot.region}`}
                        aria-pressed={active}
                        onMouseEnter={() => setHoveredId(spot.id)}
                        onMouseLeave={() =>
                          setHoveredId((current) =>
                            current === spot.id ? null : current,
                          )
                        }
                        onClick={() => selectSpot(spot.id, true)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter" || event.key === " ") {
                            event.preventDefault();
                            selectSpot(spot.id, true);
                          }
                        }}
                      >
                        <circle
                          r={active ? 15 : 9.5}
                          fill="#ff6b2b"
                          opacity={
                            active ? ".18" : inActiveFilter ? ".07" : ".02"
                          }
                        />
                        {active && (
                          <circle
                            r="10.5"
                            fill="none"
                            stroke="#ff6b2b"
                            strokeOpacity=".65"
                          />
                        )}
                        <circle
                          r={active ? "4.2" : isHome ? "3.8" : "3.1"}
                          fill={
                            active
                              ? "#ff9b6a"
                              : isHome
                                ? "#ffd2b8"
                                : inActiveFilter
                                  ? "#ff6d29"
                                  : "#8d6d5f"
                          }
                          stroke="#261b16"
                          strokeWidth="1.3"
                        />
                        {showCalloutFlag && (
                          <g
                            transform={`translate(${labelLeft ? -22 : 8} -15.5) scale(0.66)`}
                            aria-hidden="true"
                            className="globe-pin-flag"
                          >
                            <FlagSvgContents code={spot.flagCode} />
                          </g>
                        )}
                        <text
                          x={
                            labelLeft
                              ? showCalloutFlag
                                ? -25
                                : -8
                              : showCalloutFlag
                                ? 25
                                : 8
                          }
                          y="-7"
                          textAnchor={labelLeft ? "end" : "start"}
                          fill={active ? "#ff9b6a" : "#e5d5cd"}
                          fontSize="8"
                          fontFamily="IBM Plex Mono, monospace"
                          letterSpacing=".6"
                          className="globe-pin-label"
                          aria-hidden="true"
                        >
                          {spot.place.toUpperCase()}
                        </text>
                      </g>
                    );
                  })}

                <g
                  fill="#bea99f"
                  fontFamily="IBM Plex Mono, monospace"
                  fontSize="7"
                  letterSpacing="1"
                  opacity=".75"
                  aria-hidden="true"
                >
                  <text x="22" y="514">
                    ORTHOGRAPHIC / {zoom.toFixed(1)}×
                  </text>
                  <text x="498" y="514" textAnchor="end">
                    {countryStats.length} COUNTRIES · {layoutPins.length} IN VIEW
                  </text>
                </g>
              </svg>

              <div className="globe-controls">
                <button
                  type="button"
                  className="globe-control-button"
                  onClick={() => rotate(20)}
                  aria-label="Rotate globe west"
                >
                  <ArrowLeft size={15} />
                </button>
                <button
                  type="button"
                  className="globe-control-button spin-control"
                  onClick={() => setSpinning(!spinning)}
                  aria-label={
                    spinning ? "Pause globe rotation" : "Auto-spin globe"
                  }
                  aria-pressed={spinning}
                >
                  {spinning ? <Pause size={13} /> : <Play size={13} />}
                  <span>{spinning ? "PAUSE" : "AUTO-SPIN"}</span>
                </button>
                <button
                  type="button"
                  className="globe-control-button"
                  onClick={() => rotate(-20)}
                  aria-label="Rotate globe east"
                >
                  <ArrowRight size={15} />
                </button>
                <button
                  type="button"
                  className="globe-control-button"
                  onClick={() => adjustZoom(0.45)}
                  disabled={zoom >= 3.5}
                  aria-label="Zoom in globe"
                >
                  <Plus size={14} />
                </button>
                <button
                  type="button"
                  className="globe-control-button"
                  onClick={() => adjustZoom(-0.45)}
                  disabled={zoom <= 1}
                  aria-label="Zoom out globe"
                >
                  <Minus size={14} />
                </button>
                <button
                  type="button"
                  className="globe-control-button reset-control"
                  onClick={resetGlobe}
                  aria-label="Reset globe"
                >
                  <RotateCcw size={14} />
                </button>
              </div>
              <span className="drag-hint">
                <Compass size={12} /> DRAG OR ZOOM TO SEPARATE CLUSTERS
              </span>
            </div>

            <div className="globe-footer">
              <span>
                <Layers3 size={12} /> {countryStats.length} Countries ·{" "}
                {usStateCount} U.S. State Flags
              </span>
              <span>
                {travelSpots.length} DESTINATIONS / 5 SECTORS
              </span>
            </div>
          </div>

          <div className="atlas-directory">
            <div className="atlas-selected">
              <div className="atlas-selected-top">
                <span className="atlas-kind">
                  {selected.kind === "Home" ? (
                    <Home size={12} />
                  ) : (
                    <span className="atlas-cross">+</span>
                  )}
                  {selected.sector.toUpperCase()} · {selected.cluster.toUpperCase()}
                </span>
                <div className="atlas-step-controls">
                  <button
                    type="button"
                    className="atlas-step-button"
                    onClick={() => stepSelection(-1)}
                    aria-label="Previous destination"
                  >
                    <ArrowLeft size={12} />
                  </button>
                  <button
                    type="button"
                    className="atlas-step-button"
                    onClick={() => stepSelection(1)}
                    aria-label="Next destination"
                  >
                    <ArrowRight size={12} />
                  </button>
                </div>
              </div>

              <div className="atlas-selected-title-row">
                <div>
                  <h3>{selected.place}</h3>
                  <span className="atlas-region">
                    {selected.region} · {selected.year}
                  </span>
                </div>
                <div className="atlas-selected-flags">
                  <FlagBadge
                    code={selected.flagCode}
                    label={selected.flagLabel}
                    size="lg"
                  />
                  {selected.flagCode.startsWith("US-") && (
                    <FlagBadge
                      code="US"
                      label="United States Flag"
                      size="xs"
                      className="atlas-sub-flag"
                    />
                  )}
                </div>
              </div>

              <div className="atlas-flag-caption">
                <span>{selected.flagLabel.toUpperCase()}</span>
                <span>{selected.country.toUpperCase()}</span>
              </div>

              <p>{selected.note}</p>
              <div className="atlas-coordinates">
                <span>COORDINATES</span>
                <span>{selected.label}</span>
              </div>
              <div className="atlas-route-line">
                <span>{home.place}</span>
                <span className="route-rule" />
                <span>
                  {selected.id === home.id
                    ? "HOME BASE"
                    : `${distanceFromHomeKm.toLocaleString()} KM`}
                </span>
              </div>
            </div>

            <button
              type="button"
              className="atlas-directory-toggle"
              aria-expanded={directoryOpen}
              aria-controls="atlas-directory-panel"
              onClick={() => setDirectoryOpen((open) => !open)}
            >
              <span>
                {directoryOpen ? "HIDE" : "BROWSE"} ALL {travelSpots.length} DESTINATIONS
              </span>
              <ChevronDown size={14} aria-hidden="true" />
            </button>
            <div
              id="atlas-directory-panel"
              className={`atlas-list-panel ${directoryOpen ? "is-open" : ""}`}
            >
              <div className="atlas-list-controls">
                <div className="atlas-search-wrap">
                  <Search size={12} aria-hidden="true" />
                  <input
                    type="search"
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder={`Filter ${travelSpots.length} places or countries...`}
                    aria-label="Search destinations"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      className="atlas-search-clear"
                      onClick={() => setSearchQuery("")}
                      aria-label="Clear search"
                    >
                      <X size={12} />
                    </button>
                  )}
                </div>
                <div
                  className="atlas-sort-buttons"
                  role="group"
                  aria-label="Sort destinations"
                >
                  {(
                    [
                      { id: "region", label: "SECTOR" },
                      { id: "country", label: "COUNTRY" },
                      { id: "alpha", label: "A–Z" },
                      { id: "longitude", label: "W→E" },
                    ] as const
                  ).map((option) => (
                    <button
                      key={option.id}
                      type="button"
                      className={sortMode === option.id ? "active" : ""}
                      aria-pressed={sortMode === option.id}
                      onClick={() => setSortMode(option.id)}
                    >
                      {option.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="atlas-list" aria-label="Travel destinations">
                {groupedSpots.length === 0 ? (
                  <div className="atlas-empty">
                    No coordinates match "{searchQuery}".{" "}
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setActiveCountry(null);
                        setActiveSector("All");
                      }}
                    >
                      Reset filter
                    </button>
                  </div>
                ) : (
                  groupedSpots.map((group) => (
                    <div className="atlas-group" key={group.title}>
                      <div className="atlas-list-head">
                        <span className="atlas-group-title">
                          {group.flag && (
                            <FlagBadge code={group.flag} size="xs" />
                          )}
                          {group.title}
                        </span>
                        <span>{group.spots.length}</span>
                      </div>
                      {group.spots.map((spot) => {
                        const globalIndex = travelSpots.findIndex(
                          (item) => item.id === spot.id,
                        );
                        return (
                          <button
                            key={spot.id}
                            type="button"
                            className={`atlas-place ${selectedId === spot.id ? "active" : ""}`}
                            aria-pressed={selectedId === spot.id}
                            onClick={() => selectSpot(spot.id, true)}
                          >
                            <span className="atlas-index">
                              {String(globalIndex + 1).padStart(2, "0")}
                            </span>
                            <FlagBadge
                              code={spot.flagCode}
                              label={spot.flagLabel}
                              size="sm"
                            />
                            <span className="atlas-place-copy">
                              <strong>{spot.place}</strong>
                              <small>
                                {spot.region} · {spot.cluster}
                              </small>
                            </span>
                            <span className="atlas-place-year">
                              {spot.kind === "Home" ? "BASE" : spot.year}
                            </span>
                            <ArrowRight size={13} />
                          </button>
                        );
                      })}
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
