"use client";

import { FormEvent, useEffect, useRef, useState } from "react";
import Image from "next/image";

const TARGET_DATE = new Date("2026-12-17T18:00:00");
const MEMORIES = Array.from({ length: 15 }, (_, index) => `/memories/memory-${String(index + 1).padStart(2, "0")}.jpg`);
const QUOTE_CHALLENGE = [
  { person: "Anvitha", quote: "she makes u piss ur pants but in a nice warm way" },
  { person: "Vanya", quote: "I love Ananya for being emotionally intellectual" },
  { person: "Anish", quote: "Ananya is like a Christopher Nolan movie. You either understand or you don’t, but whatever it is you can’t deny she isn’t a fucking vibe. Absolute peak cinema. 🇵🇰" },
  { person: "Pranav", quote: "Most sarcastic funny movie enthusiast person I know" },
  { person: "Pandu", quote: "Manam Manam dosthulam chettu meeda kothulam." },
  { person: "RRR", quote: "Psycho Munda of my heart" },
  { person: "Neeha", quote: "Ananya is fun, crazy, gudhabal overall all in one package" },
  { person: "Shreya", quote: "shed fierce, incredibly caring, and honestly the best person to have a good time with" },
  { person: "Shashank", quote: "Pain in my ass" },
  { person: "Yash", quote: "Independent Hardworking 20 year old hardcore Telangana that loves Tamil and Mallu boys" },
];

function pad(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function getCountdown() {
  const distance = Math.max(0, TARGET_DATE.getTime() - Date.now());
  return {
    days: Math.floor(distance / 86_400_000),
    hours: Math.floor((distance / 3_600_000) % 24),
    minutes: Math.floor((distance / 60_000) % 60),
    seconds: Math.floor((distance / 1_000) % 60),
  };
}

function Shield({ small = false }: { small?: boolean }) {
  return (
    <svg className={small ? "shield shield-small" : "shield"} viewBox="0 0 120 140" role="img" aria-label="Agent shield">
      <path d="M60 5 108 23v45c0 31-19 55-48 67C31 123 12 99 12 68V23L60 5Z" />
      <path className="shield-inner" d="m60 22 31 12v33c0 20-11 37-31 48-20-11-31-28-31-48V34l31-12Z" />
      <path className="shield-star" d="m60 36 7 18 20 1-15 13 5 19-17-10-17 10 5-19-15-13 20-1 7-18Z" />
    </svg>
  );
}

function SignalIcon({ type }: { type: "gotham" | "wizard" | "demigod" }) {
  if (type === "gotham") {
    return <svg className="signal-icon" viewBox="0 0 64 48" aria-hidden="true" shapeRendering="crispEdges"><path d="M4 12h10V6h8v8h20V6h8v6h10v8h-6v8h-8v8H36v8h-8v-8H18v-8h-8v-8H4Z" /></svg>;
  }

  if (type === "wizard") {
    return <svg className="signal-icon" viewBox="0 0 64 48" aria-hidden="true" shapeRendering="crispEdges"><path d="M5 24h5v-8h8v-4h8v4h4v8h4v-8h8v-4h8v4h8v8h-4v8h-8v4h-8v-4h-4v-6h-4v6h-4v4h-8v-4h-8v-8H5Zm9-4v8h8v-8h-8Zm28 0v8h8v-8h-8ZM34 0h10l-8 12h8L28 30l6-14h-8Z" /></svg>;
  }

  return <svg className="signal-icon" viewBox="0 0 64 48" aria-hidden="true" shapeRendering="crispEdges"><path d="M28 4h8v16h6V10h6v14l-12 8v12h-8V32l-12-8V10h6v10h6V4Zm-22 36h16v4H6v-4Zm36 0h16v4H42v-4Z" /></svg>;
}

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [identityConfirmed, setIdentityConfirmed] = useState(false);
  const [dogName, setDogName] = useState("");
  const [identityError, setIdentityError] = useState("");
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [quoteFeedback, setQuoteFeedback] = useState("");
  const [quoteStatus, setQuoteStatus] = useState<"idle" | "correct" | "wrong">("idle");
  const [matchedPeople, setMatchedPeople] = useState<string[]>([]);
  const [quoteChallengeComplete, setQuoteChallengeComplete] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [trackTime, setTrackTime] = useState(0);
  const [trackDuration, setTrackDuration] = useState(0);
  const [currentSlide, setCurrentSlide] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const initialUpdate = window.setTimeout(() => setCountdown(getCountdown()), 0);
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => {
      window.clearTimeout(initialUpdate);
      window.clearInterval(timer);
    };
  }, []);

  useEffect(() => {
    const visualTarget = new URLSearchParams(window.location.search).get("visual");
    if (visualTarget !== null) {
      let visualScroll: number | undefined;
      const visualEntry = window.setTimeout(() => {
        setEntered(true);
        visualScroll = window.setTimeout(() => document.getElementById(visualTarget || "top")?.scrollIntoView(), 120);
      }, 0);
      return () => {
        window.clearTimeout(visualEntry);
        if (visualScroll) window.clearTimeout(visualScroll);
      };
    }
  }, []);

  useEffect(() => {
    if (!entered) return;
    const slideshow = window.setInterval(() => setCurrentSlide((slide) => (slide + 1) % MEMORIES.length), 4500);
    return () => window.clearInterval(slideshow);
  }, [entered]);

  function enterDossier() {
    setEntered(true);
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.65;
      void audio.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false));
    }
  }

  function toggleAudio() {
    const audio = audioRef.current;
    if (!audio) return;
    if (audio.paused) {
      void audio.play().then(() => setSoundOn(true)).catch(() => setSoundOn(false));
    } else {
      audio.pause();
      setSoundOn(false);
    }
  }

  function formatTime(value: number) {
    if (!Number.isFinite(value)) return "0:00";
    const minutes = Math.floor(value / 60);
    return `${minutes}:${String(Math.floor(value % 60)).padStart(2, "0")}`;
  }

  function confirmIdentity(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (dogName.trim().toLowerCase() === "percy") {
      setIdentityConfirmed(true);
      setIdentityError("");
      return;
    }

    setIdentityError("ACCESS DENIED · THAT DOESN'T MATCH OUR RECORDS");
  }

  function matchQuote(person: string) {
    if (quoteStatus === "correct") return;
    const answer = QUOTE_CHALLENGE[quoteIndex].person;

    if (person !== answer) {
      setQuoteStatus("wrong");
      setQuoteFeedback("NO MATCH // TRY ANOTHER FRIEND");
      return;
    }

    setQuoteStatus("correct");
    setQuoteFeedback(`MATCH CONFIRMED // ${person.toUpperCase()}`);
    window.setTimeout(() => {
      const nextMatched = [...matchedPeople, person];
      setMatchedPeople(nextMatched);
      if (quoteIndex === QUOTE_CHALLENGE.length - 1) {
        setQuoteChallengeComplete(true);
      } else {
        setQuoteIndex((index) => index + 1);
        setQuoteStatus("idle");
        setQuoteFeedback("");
      }
    }, 650);
  }

  return (
    <main className={entered ? "site is-entered" : "site"}>
      <audio
        ref={audioRef}
        src="/illuminati.mp3"
        loop
        preload="metadata"
        onPlay={() => setSoundOn(true)}
        onPause={() => setSoundOn(false)}
        onTimeUpdate={(event) => setTrackTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setTrackDuration(event.currentTarget.duration)}
      />
      {!entered && (
        <section className="gate" aria-label="Classified birthday transmission">
          <div className="gate-grid" aria-hidden="true" />
          <div className="gate-scan" aria-hidden="true" />
          <div className="personality-collage" aria-hidden="true">
            <figure className="personality-sticker sticker-camp"><Image src="/personality/camp-half-blood.webp" alt="" width={900} height={900} /><figcaption>DEMIGOD ENERGY</figcaption></figure>
            <figure className="personality-sticker sticker-hat"><Image src="/personality/sorting-hat.webp" alt="" width={900} height={786} /><figcaption>MISCHIEF MANAGED</figcaption></figure>
            <figure className="personality-sticker sticker-charminar"><Image src="/personality/charminar.webp" alt="" width={819} height={900} /><figcaption>HYDERABAD HOMEBASE</figcaption></figure>
            <figure className="personality-sticker sticker-sunrisers"><Image src="/personality/sunrisers.webp" alt="" width={600} height={900} /><figcaption>ORANGE ARMY</figcaption></figure>
            <figure className="personality-sticker sticker-camera"><Image src="/personality/camera.webp" alt="" width={766} height={900} /><figcaption>MEMORY KEEPER</figcaption></figure>
          </div>
          <div className="gate-content">
            {!identityConfirmed ? (
              <>
                <div className="status-line"><i /> IDENTITY CHECK REQUIRED</div>
                <Shield />
                <p className="kicker">S.H.I.E.L.D. SECURITY QUESTION</p>
                <h1>CONFIRM<br />IDENTITY</h1>
                <form className="identity-challenge" onSubmit={confirmIdentity}>
                  <label htmlFor="dog-name">NAME YOUR DOG</label>
                  <div className="challenge-control">
                    <input
                      id="dog-name"
                      autoComplete="off"
                      autoFocus
                      value={dogName}
                      onChange={(event) => {
                        setDogName(event.target.value);
                        setIdentityError("");
                      }}
                      placeholder="ENTER ANSWER"
                    />
                    <button type="submit" disabled={!dogName.trim()}>VERIFY →</button>
                  </div>
                  <p className={identityError ? "challenge-status is-error" : "challenge-status"} aria-live="polite">
                    {identityError || "SECURITY PROMPT 01 // CASE INSENSITIVE"}
                  </p>
                </form>
                <p className="microcopy">ENCRYPTED CONNECTION · ONE ATTEMPT AT A TIME</p>
              </>
            ) : !quoteChallengeComplete ? (
              <div className="confirmed-panel match-stage">
                <div className="status-line"><i /> IDENTITY CONFIRMED // CHALLENGE 02</div>
                <p className="kicker">FRIENDSHIP INTELLIGENCE ARCHIVE</p>
                <h1>MATCH THE<br /><span>TRANSMISSION</span></h1>
                <div className="match-progress"><span>FILES MATCHED</span><strong>{String(matchedPeople.length).padStart(2, "0")} / {QUOTE_CHALLENGE.length}</strong><i><b style={{ width: `${(matchedPeople.length / QUOTE_CHALLENGE.length) * 100}%` }} /></i></div>
                <article className="quote-card">
                  <small>A SENTENCE FOR ANANYA // FILE {String(quoteIndex + 1).padStart(2, "0")}</small>
                  <blockquote>“{QUOTE_CHALLENGE[quoteIndex].quote}”</blockquote>
                </article>
                <div className="friend-roster" aria-label="Choose who said this">
                  {QUOTE_CHALLENGE.filter(({ person }) => !matchedPeople.includes(person)).map(({ person }) => <button key={person} onClick={() => matchQuote(person)} disabled={quoteStatus === "correct"}>{person}</button>)}
                </div>
                <p className={`match-feedback is-${quoteStatus}`} aria-live="polite">{quoteFeedback || "SELECT THE FRIEND WHO SENT THIS TRANSMISSION"}</p>
              </div>
            ) : (
              <div className="confirmed-panel clearance-won">
                <div className="status-line"><i /> ALL IDENTITIES CONFIRMED</div>
                <Shield />
                <p className="kicker">FRIENDSHIP ARCHIVE COMPLETE</p>
                <h1>HAPPY 20<br /><span>ANANYA</span></h1>
                <div className="identity-readout">
                  <span>SUBJECT</span><strong>ANANYA</strong><span>ORIGIN</span><strong>HYDERABAD</strong>
                  <span>CLEARANCE</span><strong>LEVEL 20</strong><span>STATUS</span><strong>LEGEND</strong>
                </div>
                <button className="access-button" onClick={enterDossier}><span>UNLOCK CLEARANCE 20 GIFT</span><b aria-hidden="true">→</b></button>
                <p className="microcopy">ALL 10 TRANSMISSIONS MATCHED · GIFT CLEARANCE AVAILABLE</p>
              </div>
            )}
          </div>
        </section>
      )}

      <div className="experience" aria-hidden={!entered}>
        <nav className="nav-shell">
          <a className="brand" href="#top" aria-label="SHIELD birthday command home"><Shield small /><span><b>S.H.I.E.L.D.</b><small>SPECIAL BIRTHDAY DIVISION</small></span></a>
          <div className="nav-links"><a href="#briefing">Briefing</a><a href="#ticket">Clearance</a><a href="#transport">Transport</a></div>
          <button className="sound-button" onClick={toggleAudio} aria-label={soundOn ? "Pause Illuminati" : "Play Illuminati"}><span className={soundOn ? "sound-bars is-on" : "sound-bars"}><i /><i /><i /></span>{soundOn ? "NOW PLAYING" : "PLAY TRACK"}</button>
        </nav>

        <aside className="music-player" aria-label="Soundtrack player">
          <Image className="album-cover" src="/illuminati-cover.png" alt="Illuminati from Aavesham cover art" width={500} height={500} />
          <div className="track-copy"><small>MISSION SOUNDTRACK // 01</small><strong>ILLUMINATI</strong><span>AAVESHAM · SUSHIN SHYAM</span>
            <label className="track-progress"><span>{formatTime(trackTime)}</span><input aria-label="Song position" type="range" min="0" max={trackDuration || 1} step="1" value={Math.min(trackTime, trackDuration || 1)} onChange={(event) => { if (audioRef.current) audioRef.current.currentTime = Number(event.target.value); }} /><span>{formatTime(trackDuration)}</span></label>
          </div>
          <button className="player-toggle" onClick={toggleAudio} aria-label={soundOn ? "Pause Illuminati" : "Play Illuminati"}>{soundOn ? "Ⅱ" : "▶"}</button>
        </aside>

        <section className="hero" id="top">
          <div className="pixel-marquee" aria-hidden="true"><span>HYDERABAD ✦ WEST LAFAYETTE ✦ EARTH-616 ✦ LEVEL 20 ✦ HYDERABAD ✦ WEST LAFAYETTE ✦ EARTH-616 ✦ LEVEL 20 ✦</span></div>
          <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="hero-copy">
            <p className="kicker red">● PRIORITY ALPHA · PERSONAL FILE</p><p className="happy">HAPPY</p>
            <div className="twenty-wrap"><span className="twenty">20</span><span className="agent-name">AGENT<br /><b>ANANYA</b></span></div>
            <p className="hero-intro">20 is wild, the fact that we&apos;ve known each other 8 years is wilder, so here&apos;s to at least 40 more (+ more hopefully)</p>
            <a className="primary-cta" href="#briefing">OPEN MISSION FILE <span>↓</span></a>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="crossover-console">
              <div className="console-head"><span>ANANYA&apos;S MULTIVERSE ARCHIVE</span><b>CREATIVE MOOD.ID</b></div>
              <div className="console-body">
                <div className="signal-grid">
                  <div className="signal-card"><SignalIcon type="gotham" /><span>GOTHAM</span><b>DETECTIVE MODE</b></div>
                  <div className="signal-card"><SignalIcon type="wizard" /><span>WIZARDING WORLD</span><b>PLATFORM 9¾</b></div>
                  <div className="signal-card"><SignalIcon type="demigod" /><span>CAMP HALF-BLOOD</span><b>TRIDENT ACTIVE</b></div>
                </div>
                <div className="feature-file">
                  <div className="slideshow-frame">
                    <Image className="memory-image" src={MEMORIES[currentSlide]} alt={`Ananya birthday memory ${currentSlide + 1}`} fill sizes="(max-width: 720px) 100vw, 48vw" priority={currentSlide === 0} />
                    <div className="memory-shade" />
                    <div className="memory-label"><small>MEMORY ARCHIVE // {String(currentSlide + 1).padStart(2, "0")}</small><strong>ANANYA</strong><span>LEVEL 20</span></div>
                    <div className="slide-controls"><button onClick={() => setCurrentSlide((slide) => (slide - 1 + MEMORIES.length) % MEMORIES.length)} aria-label="Previous memory">←</button><div>{MEMORIES.map((_, index) => <button key={index} className={index === currentSlide ? "is-active" : ""} onClick={() => setCurrentSlide(index)} aria-label={`Show memory ${index + 1}`} />)}</div><button onClick={() => setCurrentSlide((slide) => (slide + 1) % MEMORIES.length)} aria-label="Next memory">→</button></div>
                  </div>
                  <i>AVENGERS</i>
                </div>
                <div className="file-tabs"><span>AVENGERS</span><span>HISTOGRAM</span><span>POSTER</span><span>STORYTELLING</span></div>
              </div>
              <div className="console-foot"><span>HYDERABAD // WEST LAFAYETTE</span><strong>20</strong><span>ALL WORLDS ONLINE</span></div>
            </div>
          </div>
          <div className="scroll-cue"><i /> SCROLL TO DECLASSIFY</div>
        </section>

        <section className="briefing section" id="briefing">
          <div className="section-number">01 / MISSION BRIEFING</div>
          <div className="briefing-grid">
            <div className="briefing-copy">
              <p className="kicker">CLASSIFIED // LEVEL 20 ACCESS</p><h2>NOW COMING TO<br /><em>YOUR GIFT.</em></h2>
              <p className="lead">Thought a lot about what to give and honestly what can quite beat watching the best movie ever with the best person ever (me lol..jk .. not really)</p>
              <div className="assignment"><span>ASSIGNMENT</span><strong>WATCH THE DOOMSDAY PROTOCOL UNFOLD.</strong></div>
            </div>
            <div className="intel-card">
              <div className="intel-top"><span>THREAT ASSESSMENT</span><b>OMEGA</b></div>
              <figure className="doom-poster">
                <Image src="/avengers-doomsday-poster.jpg" alt="Doctor Doom in the Avengers: Doomsday poster" width={1280} height={1897} priority={false} />
                <figcaption><span>VISUAL INTEL // DOCTOR DOOM</span><a href="https://www.artofvfx.com/avengers-doomsday/" target="_blank" rel="noreferrer">SOURCE: THE ART OF VFX ↗</a></figcaption>
              </figure>
              <div className="scan-labels"><span>IDENTITY<br /><b>UNKNOWN</b></span><span>THREAT LEVEL<br /><b>DOOMSDAY</b></span></div>
              <div className="intel-footer">AVENGERS // DOOMSDAY<br /><b>THE FUTURE IS MASKED</b></div>
            </div>
          </div>
        </section>

        <section className="ticket-section section" id="ticket">
          <div className="section-number">02 / ACCESS CLEARANCE</div>
          <div className="ticket-heading"><div><p className="kicker red">YOUR OFFICIAL INVITATION</p><h2>MISSION PASS</h2></div><p>NON-TRANSFERABLE<br />ONE VERY IMPORTANT AGENT</p></div>
          <article className="ticket">
            <div className="ticket-main">
              <div className="ticket-brand"><Shield small /><span>MARVEL STUDIOS<br /><b>AVENGERS: DOOMSDAY</b></span></div>
              <div className="ticket-title"><span>ADVANCE PREVIEW</span><strong>17<span>DEC</span></strong></div>
              <div className="ticket-details">
                <div><span>AGENT</span><b>ANANYA</b></div><div><span>ORIGIN</span><b>HYDERABAD</b></div><div><span>ADMIT</span><b>ONE HERO</b></div><div><span>LOCATION</span><b>TO BE DECLASSIFIED</b></div>
              </div>
              <p className="ticket-note">Your seat at the end of the world is secured.</p>
            </div>
            <div className="ticket-stub"><span>MISSION</span><b>DOOMSDAY</b><div className="barcode" aria-hidden="true" /><small>DEC.17 // A20</small><Shield small /></div>
          </article>
          <p className="fine-print">* Official booking details, showtime and venue will be transmitted to Agent Ananya upon confirmation.</p>
        </section>

        <section className="transport section" id="transport">
          <div className="section-number">03 / EXTRACTION PLAN</div>
          <div className="transport-grid">
            <div><p className="kicker">NO HERO LEFT BEHIND</p><h2>THE WHOLE<br /><em>EXPERIENCE.</em></h2><p className="lead">From West Lafayette to Doomsday and safely back—your entire mission is covered.</p></div>
            <div className="route-panel">
              <div className="route">
                <span className="route-point"><i>01</i><b>WEST LAFAYETTE</b><small>BUS DEPARTURE</small></span><span className="route-line"><i /></span>
                <span className="route-point destination"><i>02</i><b>MISSION SITE</b><small>AVENGERS: DOOMSDAY</small></span><span className="route-line return"><i /></span>
                <span className="route-point"><i>03</i><b>WEST LAFAYETTE</b><small>SAFE RETURN</small></span>
              </div>
              <div className="mission-includes" aria-label="Everything included">
                <span><i>01</i><b>THE BUS</b><small>TO + FROM WEST LAFAYETTE</small></span>
                <span><i>02</i><b>THE MOVIE</b><small>YOUR DOOMSDAY TICKET</small></span>
                <span><i>03</i><b>THE FOOD</b><small>MISSION FUEL INCLUDED</small></span>
              </div>
              <div className="covered"><span>FULL EXPERIENCE STATUS</span><strong>100% COVERED BY ME</strong></div>
            </div>
          </div>
        </section>

        <section className="countdown-section section">
          <div className="countdown-copy"><p className="kicker red">RENDEZVOUS // DECEMBER 17, 2026</p><h2>ASSEMBLE IN</h2></div>
          <div className="countdown" aria-label="Countdown to December 17, 2026">
            {[[countdown.days, "DAYS"], [countdown.hours, "HOURS"], [countdown.minutes, "MINUTES"], [countdown.seconds, "SECONDS"]].map(([value, label]) => <div key={label}><strong>{pad(Number(value))}</strong><span>{label}</span></div>)}
          </div>
          <div className="final-copy"><span className="giant-twenty">20</span><div><p>HAPPY BIRTHDAY, ANANYA.</p><h2>YOUR NEXT ERA<br />STARTS NOW.</h2><small>— WITH LOVE, FROM YOUR MISSION HANDLER</small></div></div>
          <button className="accept-button" onClick={() => setAccepted(true)} disabled={accepted}>{accepted ? "MISSION ACCEPTED ✓" : "ACCEPT THE MISSION"}</button>
          {accepted && <div className="accepted-message" role="status">CLEARANCE GRANTED · SEE YOU ON DECEMBER 17, AGENT ANANYA.</div>}
          {accepted && <div className="confetti" aria-hidden="true">{Array.from({ length: 30 }, (_, index) => <i key={index} style={{ "--i": index } as React.CSSProperties} />)}</div>}
        </section>
        <footer><Shield small /><span>SECURE TRANSMISSION ENDS</span><span>FILE A-20-1217</span></footer>
      </div>
    </main>
  );
}
