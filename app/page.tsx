"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type StyleKey =
  | "Culture"
  | "Food"
  | "Nature"
  | "Adventure"
  | "Design"
  | "Slow"
  | "Nightlife"
  | "Wellness";

type Pace = "Slow" | "Wandering" | "Expedition" | "Social";

type Region =
  | "Africa"
  | "Asia"
  | "Europe"
  | "North America"
  | "Oceania"
  | "South America";

type TravelEntry = {
  id: string;
  place: string;
  country: string;
  region: Region;
  visitedAt: string;
  rating: number;
  pace: Pace;
  styles: StyleKey[];
  highlight: string;
  memory: string;
};

type PlaceForm = Omit<TravelEntry, "id">;

const storageKey = "travellore-profile-v1";

const styleOptions: StyleKey[] = [
  "Culture",
  "Food",
  "Nature",
  "Adventure",
  "Design",
  "Slow",
  "Nightlife",
  "Wellness",
];

const regions: Region[] = [
  "Africa",
  "Asia",
  "Europe",
  "North America",
  "Oceania",
  "South America",
];

const paces: Pace[] = ["Slow", "Wandering", "Expedition", "Social"];

const starterEntries: TravelEntry[] = [
  {
    id: "kyoto",
    place: "Kyoto",
    country: "Japan",
    region: "Asia",
    visitedAt: "2024-04-12",
    rating: 5,
    pace: "Slow",
    styles: ["Culture", "Food", "Design", "Slow"],
    highlight: "Temple mornings",
    memory: "Lantern streets, noodle counters, quiet gardens, and long walks between shrines.",
  },
  {
    id: "reykjavik",
    place: "Reykjavik",
    country: "Iceland",
    region: "Europe",
    visitedAt: "2025-02-08",
    rating: 4,
    pace: "Expedition",
    styles: ["Nature", "Adventure", "Wellness"],
    highlight: "South Coast road trip",
    memory: "Black sand, glacier air, thermal water, and weather that made every plan feel alive.",
  },
  {
    id: "lisbon",
    place: "Lisbon",
    country: "Portugal",
    region: "Europe",
    visitedAt: "2025-09-17",
    rating: 4,
    pace: "Wandering",
    styles: ["Food", "Culture", "Nightlife", "Design"],
    highlight: "Alfama after dark",
    memory: "Tile walls, late dinners, bright viewpoints, and narrow streets that rewarded detours.",
  },
];

const blankForm: PlaceForm = {
  place: "",
  country: "",
  region: "Asia",
  visitedAt: "2026-06-06",
  rating: 4,
  pace: "Wandering",
  styles: ["Culture"],
  highlight: "",
  memory: "",
};

function readStoredProfile() {
  const fallback = {
    travelerName: "Traveler",
    entries: starterEntries,
  };

  if (typeof window === "undefined") {
    return fallback;
  }

  const saved = window.localStorage.getItem(storageKey);

  if (!saved) {
    return fallback;
  }

  try {
    const parsed = JSON.parse(saved) as {
      travelerName?: string;
      entries?: TravelEntry[];
    };

    return {
      travelerName: parsed.travelerName || fallback.travelerName,
      entries: Array.isArray(parsed.entries) ? parsed.entries : fallback.entries,
    };
  } catch {
    window.localStorage.removeItem(storageKey);
    return fallback;
  }
}

const monthNames = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatVisitDate(value: string) {
  const [year, month] = value.split("-");
  const monthIndex = Number(month) - 1;

  if (!year || monthIndex < 0 || monthIndex > 11) {
    return "Undated";
  }

  return `${monthNames[monthIndex]} ${year}`;
}

function getAverageRating(entries: TravelEntry[]) {
  if (entries.length === 0) {
    return "0.0";
  }

  const total = entries.reduce((sum, entry) => sum + entry.rating, 0);
  return (total / entries.length).toFixed(1);
}

function getStyleCounts(entries: TravelEntry[]) {
  const counts = styleOptions.reduce(
    (acc, style) => ({ ...acc, [style]: 0 }),
    {} as Record<StyleKey, number>,
  );

  entries.forEach((entry) => {
    entry.styles.forEach((style) => {
      counts[style] += 1;
    });

    if (entry.pace === "Slow") {
      counts.Slow += 1;
    }

    if (entry.pace === "Expedition") {
      counts.Adventure += 1;
    }

    if (entry.pace === "Social") {
      counts.Nightlife += 1;
    }
  });

  return counts;
}

function getDominantStyles(counts: Record<StyleKey, number>) {
  return styleOptions
    .map((style) => ({ style, count: counts[style] }))
    .sort((a, b) => b.count - a.count)
    .filter((item) => item.count > 0)
    .slice(0, 4);
}

function getSignatureTitle(entries: TravelEntry[], dominantStyles: StyleKey[]) {
  if (entries.length === 0) {
    return "Unstamped Traveler";
  }

  if (entries.length === 1) {
    return `${entries[0].place} Origin`;
  }

  const [primary, secondary] = dominantStyles;

  if (primary === "Culture" && secondary === "Food") {
    return "Cultural Table Seeker";
  }

  if (primary === "Nature" && secondary === "Adventure") {
    return "Open Terrain Collector";
  }

  if (primary === "Slow" && secondary === "Design") {
    return "Slow City Archivist";
  }

  if (primary === "Nightlife" && secondary === "Food") {
    return "After-Hours Tastemaker";
  }

  if (primary === "Wellness" && secondary === "Nature") {
    return "Restorative Route Finder";
  }

  if (!secondary) {
    return `${primary} Traveler`;
  }

  return `${primary} ${secondary} Traveler`;
}

function getTravelArc(entries: TravelEntry[]) {
  if (entries.length === 0) {
    return "Add the first place to create a signature.";
  }

  const origin = entries[0];
  const latest = entries[entries.length - 1];

  if (entries.length === 1) {
    return `${origin.place} is the origin stamp. Every later trip will sharpen the profile.`;
  }

  return `${origin.place} set the first signal; ${latest.place} is the newest stamp in the pattern.`;
}

function sortByVisit(entries: TravelEntry[]) {
  return [...entries].sort((a, b) => b.visitedAt.localeCompare(a.visitedAt));
}

export default function Home() {
  const [storedProfile] = useState(readStoredProfile);
  const [travelerName, setTravelerName] = useState(storedProfile.travelerName);
  const [entries, setEntries] = useState<TravelEntry[]>(storedProfile.entries);
  const [form, setForm] = useState<PlaceForm>(blankForm);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    window.localStorage.setItem(
      storageKey,
      JSON.stringify({ travelerName, entries }),
    );
  }, [entries, travelerName]);

  const profile = useMemo(() => {
    const counts = getStyleCounts(entries);
    const dominant = getDominantStyles(counts);
    const dominantStyles = dominant.map((item) => item.style);
    const countries = new Set(entries.map((entry) => entry.country)).size;
    const regionsSeen = new Set(entries.map((entry) => entry.region)).size;
    const maxCount = Math.max(...Object.values(counts), 1);
    const sortedEntries = sortByVisit(entries);
    const latest = sortedEntries[0];

    return {
      averageRating: getAverageRating(entries),
      countries,
      dominant,
      maxCount,
      origin: entries[0],
      regionsSeen,
      signatureTitle: getSignatureTitle(entries, dominantStyles),
      styleCounts: counts,
      sortedEntries,
      latest,
      travelArc: getTravelArc(entries),
    };
  }, [entries]);

  function updateForm<Key extends keyof PlaceForm>(
    key: Key,
    value: PlaceForm[Key],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function toggleStyle(style: StyleKey) {
    setForm((current) => {
      const styles = current.styles.includes(style)
        ? current.styles.filter((item) => item !== style)
        : [...current.styles, style];

      return {
        ...current,
        styles: styles.length > 0 ? styles : [style],
      };
    });
  }

  function addEntry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextEntry: TravelEntry = {
      ...form,
      id: `${form.place}-${Date.now()}`.toLowerCase().replace(/\s+/g, "-"),
      place: form.place.trim(),
      country: form.country.trim(),
      highlight: form.highlight.trim(),
      memory: form.memory.trim(),
    };

    if (!nextEntry.place || !nextEntry.country) {
      return;
    }

    setEntries((current) => [...current, nextEntry]);
    setForm(blankForm);
  }

  function removeEntry(id: string) {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  }

  function resetProfile() {
    setTravelerName("Traveler");
    setEntries(starterEntries);
  }

  return (
    <main className="app-shell">
      <header className="topbar" aria-label="Travellore workspace">
        <div className="brand-lockup">
          <span className="brand-mark" aria-hidden="true">
            T
          </span>
          <div>
            <p className="eyebrow">Travellore</p>
            <h1>Travel profile studio</h1>
          </div>
        </div>

        <nav className="nav-tabs" aria-label="Primary">
          <a href="#signature">Signature</a>
          <a href="#journal">Journal</a>
          <a href="#ecosystem">Ecosystem</a>
        </nav>
      </header>

      <section className="workspace-grid" aria-label="Travel profile builder">
        <article className="signature-panel" id="signature">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/travel-signature.png" alt="" className="signature-image" />
          <div className="signature-shade" />

          <div className="signature-content">
            <div className="profile-row">
              <label className="traveler-name">
                <span>Traveler</span>
                <input
                  value={travelerName}
                  onChange={(event) => setTravelerName(event.target.value)}
                  aria-label="Traveler name"
                />
              </label>
              <span className="stamp-count">{entries.length} stamps</span>
            </div>

            <div className="signature-main">
              <p className="eyebrow">Signature profile</p>
              <h2>{profile.signatureTitle}</h2>
              <p>{profile.travelArc}</p>
            </div>

            <dl className="stats-strip">
              <div>
                <dt>Countries</dt>
                <dd>{profile.countries}</dd>
              </div>
              <div>
                <dt>Regions</dt>
                <dd>{profile.regionsSeen}</dd>
              </div>
              <div>
                <dt>Average</dt>
                <dd>{profile.averageRating}</dd>
              </div>
              <div>
                <dt>Origin</dt>
                <dd>{profile.origin?.place ?? "None"}</dd>
              </div>
            </dl>

            <div className="style-row" aria-label="Dominant travel styles">
              {profile.dominant.length > 0 ? (
                profile.dominant.map((item) => (
                  <span key={item.style}>{item.style}</span>
                ))
              ) : (
                <span>No styles yet</span>
              )}
            </div>
          </div>
        </article>

        <aside className="entry-console" aria-label="Add a travel stamp">
          <div className="console-header">
            <div>
              <p className="eyebrow">New stamp</p>
              <h2>Add a place</h2>
            </div>
            <button
              className="icon-button"
              type="button"
              onClick={resetProfile}
              aria-label="Reset demo profile"
              title="Reset demo profile"
            >
              ↺
            </button>
          </div>

          <form onSubmit={addEntry} className="stamp-form">
            <div className="field-pair">
              <label>
                <span>Place</span>
                <input
                  required
                  value={form.place}
                  onChange={(event) => updateForm("place", event.target.value)}
                  placeholder="Marrakech"
                />
              </label>

              <label>
                <span>Country</span>
                <input
                  required
                  value={form.country}
                  onChange={(event) =>
                    updateForm("country", event.target.value)
                  }
                  placeholder="Morocco"
                />
              </label>
            </div>

            <div className="field-pair">
              <label>
                <span>Region</span>
                <select
                  value={form.region}
                  onChange={(event) =>
                    updateForm("region", event.target.value as Region)
                  }
                >
                  {regions.map((region) => (
                    <option key={region}>{region}</option>
                  ))}
                </select>
              </label>

              <label>
                <span>Visited</span>
                <input
                  type="date"
                  value={form.visitedAt}
                  onChange={(event) =>
                    updateForm("visitedAt", event.target.value)
                  }
                />
              </label>
            </div>

            <fieldset className="segmented-field">
              <legend>Rating</legend>
              <div className="segmented-control">
                {[1, 2, 3, 4, 5].map((rating) => (
                  <button
                    className={form.rating === rating ? "is-active" : ""}
                    key={rating}
                    type="button"
                    onClick={() => updateForm("rating", rating)}
                    aria-pressed={form.rating === rating}
                  >
                    {rating}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="segmented-field">
              <legend>Pace</legend>
              <div className="pace-grid">
                {paces.map((pace) => (
                  <button
                    className={form.pace === pace ? "is-active" : ""}
                    key={pace}
                    type="button"
                    onClick={() => updateForm("pace", pace)}
                    aria-pressed={form.pace === pace}
                  >
                    {pace}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="style-picker">
              <legend>Styles</legend>
              <div>
                {styleOptions.map((style) => (
                  <label key={style}>
                    <input
                      type="checkbox"
                      checked={form.styles.includes(style)}
                      onChange={() => toggleStyle(style)}
                    />
                    <span>{style}</span>
                  </label>
                ))}
              </div>
            </fieldset>

            <label>
              <span>Highlight</span>
              <input
                value={form.highlight}
                onChange={(event) =>
                  updateForm("highlight", event.target.value)
                }
                placeholder="Market morning"
              />
            </label>

            <label>
              <span>Memory</span>
              <textarea
                value={form.memory}
                onChange={(event) => updateForm("memory", event.target.value)}
                placeholder="What made this place stay with you?"
                rows={4}
              />
            </label>

            <button className="primary-button" type="submit">
              <span aria-hidden="true">+</span>
              Add place
            </button>
          </form>
        </aside>
      </section>

      <section className="insight-band" aria-label="Travel style mix">
        <div>
          <p className="eyebrow">Travel style mix</p>
          <h2>{`${travelerName || "Traveler"}'s taste map`}</h2>
        </div>

        <div className="style-bars">
          {styleOptions.map((style) => {
            const count = profile.styleCounts[style];
            const width = `${Math.max((count / profile.maxCount) * 100, count ? 16 : 0)}%`;

            return (
              <div className="style-meter" key={style}>
                <span>{style}</span>
                <div aria-hidden="true">
                  <i style={{ width }} />
                </div>
                <strong>{count}</strong>
              </div>
            );
          })}
        </div>
      </section>

      <section className="journal-section" id="journal" aria-label="Travel log">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Passport shelf</p>
            <h2>Places traveled</h2>
          </div>
          <p>{profile.latest ? `Latest: ${profile.latest.place}` : "No stamps"}</p>
        </div>

        <div className="place-grid">
          {profile.sortedEntries.map((entry) => (
            <article className="place-card" key={entry.id}>
              <div className="place-card-head">
                <div>
                  <p>{formatVisitDate(entry.visitedAt)}</p>
                  <h3>{entry.place}</h3>
                  <span>{entry.country}</span>
                </div>
                <button
                  className="icon-button small"
                  type="button"
                  onClick={() => removeEntry(entry.id)}
                  aria-label={`Remove ${entry.place}`}
                  title={`Remove ${entry.place}`}
                >
                  ×
                </button>
              </div>

              <div className="rating-row" aria-label={`${entry.rating} out of 5`}>
                {Array.from({ length: 5 }).map((_, index) => (
                  <span
                    className={index < entry.rating ? "is-filled" : ""}
                    key={index}
                  />
                ))}
              </div>

              <p className="highlight">{entry.highlight || entry.pace}</p>
              <p>{entry.memory || "No memory note yet."}</p>

              <div className="card-tags">
                <span>{entry.region}</span>
                <span>{entry.pace}</span>
                {entry.styles.slice(0, 3).map((style) => (
                  <span key={style}>{style}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="ecosystem-section" id="ecosystem" aria-label="Travel ecosystem">
        <div className="section-heading">
          <div>
            <p className="eyebrow">Ecosystem</p>
            <h2>Profile layers</h2>
          </div>
          <p>{profile.signatureTitle}</p>
        </div>

        <div className="ecosystem-grid">
          <article>
            <span className="layer-index">01</span>
            <h3>Origin stamp</h3>
            <p>
              {profile.origin
                ? `${profile.origin.place}, ${profile.origin.country} defines the first profile signal.`
                : "No origin stamp yet."}
            </p>
          </article>

          <article>
            <span className="layer-index">02</span>
            <h3>Diary taste</h3>
            <p>
              {profile.dominant[0]
                ? `${profile.dominant[0].style} leads the travel style mix across ${entries.length} stamps.`
                : "Style mix is waiting for the first trip."}
            </p>
          </article>

          <article>
            <span className="layer-index">03</span>
            <h3>Lists</h3>
            <p>
              {profile.latest
                ? `${profile.latest.highlight || profile.latest.place} can become a collection seed.`
                : "Collections begin from saved highlights."}
            </p>
          </article>

          <article>
            <span className="layer-index">04</span>
            <h3>People</h3>
            <p>
              Taste matches can connect travelers through shared ratings, styles, and origin stamps.
            </p>
          </article>
        </div>
      </section>
    </main>
  );
}
