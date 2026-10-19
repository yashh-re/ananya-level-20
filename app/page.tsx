"use client";

import { useEffect, useState } from "react";

const TARGET_DATE = new Date("2026-12-17T18:00:00");

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

export default function Home() {
  const [entered, setEntered] = useState(false);
  const [accepted, setAccepted] = useState(false);
  const [soundOn, setSoundOn] = useState(false);
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setCountdown(getCountdown());
    const timer = window.setInterval(() => setCountdown(getCountdown()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (new URLSearchParams(window.location.search).has("visual")) {
      setEntered(true);
    }
  }, []);

  useEffect(() => {
    if (!soundOn) return;
    const AudioContextClass = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const context = new AudioContextClass();
    const oscillator = context.createOscillator();
    const gain = context.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(110, context.currentTime);
    gain.gain.setValueAtTime(0.0001, context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.03, context.currentTime + 0.2);
    gain.gain.exponentialRampToValueAtTime(0.0001, context.currentTime + 1.4);
    oscillator.connect(gain).connect(context.destination);
    oscillator.start();
    oscillator.stop(context.currentTime + 1.5);
    return () => void context.close();
  }, [soundOn]);

  function enterDossier() {
    setEntered(true);
    setSoundOn(true);
  }

  return (
    <main className={entered ? "site is-entered" : "site"}>
      {!entered && (
        <section className="gate" aria-label="Classified birthday transmission">
          <div className="gate-grid" aria-hidden="true" />
          <div className="gate-scan" aria-hidden="true" />
          <div className="gate-content">
            <div className="status-line"><i /> INCOMING SECURE TRANSMISSION</div>
            <Shield />
            <p className="kicker">Strategic Homeland Intervention</p>
            <h1>IDENTITY<br />CONFIRMED</h1>
            <div className="identity-readout">
              <span>SUBJECT</span><strong>ANANYA</strong><span>CLEARANCE</span><strong>LEVEL 20</strong>
            </div>
            <button className="access-button" onClick={enterDossier}><span>ACCESS BIRTHDAY DOSSIER</span><b aria-hidden="true">→</b></button>
            <p className="microcopy">BIOMETRIC MATCH · ENCRYPTION ACTIVE · EYES ONLY</p>
          </div>
        </section>
      )}

      <div className="experience" aria-hidden={!entered}>
        <nav className="nav-shell">
          <a className="brand" href="#top" aria-label="SHIELD birthday command home"><Shield small /><span><b>S.H.I.E.L.D.</b><small>SPECIAL BIRTHDAY DIVISION</small></span></a>
          <div className="nav-links"><a href="#briefing">Briefing</a><a href="#ticket">Clearance</a><a href="#transport">Transport</a></div>
          <button className="sound-button" onClick={() => setSoundOn((value) => !value)} aria-label="Toggle interface sound"><span className={soundOn ? "sound-bars is-on" : "sound-bars"}><i /><i /><i /></span>{soundOn ? "AUDIO ON" : "AUDIO OFF"}</button>
        </nav>

        <section className="hero" id="top">
          <div className="hero-orbit orbit-one" aria-hidden="true" /><div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="hero-copy">
            <p className="kicker red">● PRIORITY ALPHA · PERSONAL FILE</p><p className="happy">HAPPY</p>
            <div className="twenty-wrap"><span className="twenty">20</span><span className="agent-name">AGENT<br /><b>ANANYA</b></span></div>
            <p className="hero-intro">Twenty years of origin stories, plot twists, and saving the day. Your next mission has officially been declassified.</p>
            <a className="primary-cta" href="#briefing">OPEN MISSION FILE <span>↓</span></a>
          </div>
          <div className="hero-visual" aria-hidden="true">
            <div className="doom-core"><span>20</span><small>LEVEL</small></div><div className="radar radar-a" /><div className="radar radar-b" />
            <span className="coordinate coord-a">41.8781° N</span><span className="coordinate coord-b">EARTH-616</span>
          </div>
          <div className="scroll-cue"><i /> SCROLL TO DECLASSIFY</div>
        </section>

        <section className="briefing section" id="briefing">
          <div className="section-number">01 / MISSION BRIEFING</div>
          <div className="briefing-grid">
            <div className="briefing-copy">
              <p className="kicker">CLASSIFIED // LEVEL 20 ACCESS</p><h2>THE WORLD IS<br /><em>ABOUT TO CHANGE.</em></h2>
              <p className="lead">And you have front-row clearance to witness it.</p>
              <p>An inter-dimensional event has been detected. Heroes will assemble. Worlds will collide. One agent has been selected for an advance screening of the next chapter.</p>
              <div className="assignment"><span>ASSIGNMENT</span><strong>WATCH THE DOOMSDAY PROTOCOL UNFOLD.</strong></div>
            </div>
            <div className="intel-card">
              <div className="intel-top"><span>THREAT ASSESSMENT</span><b>OMEGA</b></div>
              <div className="helmet-mark" aria-hidden="true"><span className="eye left" /><span className="eye right" /></div>
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
                <div><span>AGENT</span><b>ANANYA</b></div><div><span>CLEARANCE</span><b>LEVEL 20</b></div><div><span>ADMIT</span><b>ONE HERO</b></div><div><span>LOCATION</span><b>TO BE DECLASSIFIED</b></div>
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
            <div><p className="kicker">NO HERO LEFT BEHIND</p><h2>TRAVEL?<br /><em>HANDLED.</em></h2><p className="lead">Your journey to the mission—and safely back home—is on me.</p></div>
            <div className="route-panel">
              <div className="route">
                <span className="route-point"><i>01</i><b>HOME BASE</b><small>PICKUP / DEPARTURE</small></span><span className="route-line"><i /></span>
                <span className="route-point destination"><i>02</i><b>MISSION SITE</b><small>AVENGERS: DOOMSDAY</small></span><span className="route-line return"><i /></span>
                <span className="route-point"><i>03</i><b>HOME BASE</b><small>SAFE RETURN</small></span>
              </div>
              <div className="covered"><span>ROUND TRIP STATUS</span><strong>100% COVERED BY ME</strong></div>
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
