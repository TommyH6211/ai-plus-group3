import React, { useState, useEffect } from "react";
import {
  Home,
  History as HistoryIcon,
  Smartphone,
  Watch,
  Glasses,
  Bell,
  Car,
  Flame,
  Baby,
  PawPrint,
  AlertTriangle,
  Volume2,
  VolumeX,
  Vibrate,
  ScreenShare,
  Radio,
} from "lucide-react";

const COLORS = {
  bg: "#EEF3FF",
  phone: "#0B1730",
  card: "#FFFFFF",
  border: "#E1E9FA",
  ink: "#0B1730",
  muted: "#5B6B8C",
  blue: "#1450FF",
  blueDeep: "#0B2A6B",
  cyan: "#35D6FF",
  blueSoft: "#DCE8FF",
  blueFaint: "#F3F7FF",
};

const SOUND_TYPES = [
  { label: "Dog barking", Icon: PawPrint },
  { label: "Siren", Icon: AlertTriangle },
  { label: "Car horn", Icon: Car },
  { label: "Doorbell", Icon: Bell },
  { label: "Baby crying", Icon: Baby },
  { label: "Smoke alarm", Icon: Flame },
];

function sectorLabel(angle) {
  const a = ((angle % 360) + 360) % 360;
  if (a >= 337.5 || a < 22.5) return "ahead of you";
  if (a < 67.5) return "ahead, to your right";
  if (a < 112.5) return "to your right";
  if (a < 157.5) return "behind you, to your right";
  if (a < 202.5) return "behind you";
  if (a < 247.5) return "behind you, to your left";
  if (a < 292.5) return "to your left";
  return "ahead, to your left";
}

function distanceBand(d) {
  if (d <= 15) return 0;
  if (d <= 35) return 1;
  return 2;
}

function proximityWord(d) {
  if (d <= 15) return "close by";
  if (d <= 35) return "mid range";
  return "far off";
}

function seedEntry(label, Icon, angle, distance, confidence, db, minsAgo) {
  const t = new Date();
  t.setMinutes(t.getMinutes() - minsAgo);
  return { id: `${label}-${minsAgo}`, type: label, Icon, angle, distance, confidence, db, time: t };
}

function Toggle({ checked, onChange, disabled }) {
  return (
    <button
      onClick={() => !disabled && onChange(!checked)}
      style={{
        background: disabled ? "#EDF1FA" : checked ? COLORS.blue : COLORS.border,
        width: 44,
        height: 26,
        borderRadius: 999,
        position: "relative",
        flexShrink: 0,
        border: "none",
        cursor: disabled ? "not-allowed" : "pointer",
        transition: "background 0.2s ease",
      }}
      aria-pressed={checked}
    >
      <span
        style={{
          position: "absolute",
          top: 3,
          left: checked ? 21 : 3,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: "#FFFFFF",
          transition: "left 0.2s ease",
          boxShadow: "0 1px 3px rgba(11,23,48,0.35)",
        }}
      />
    </button>
  );
}

function Card({ children, style }) {
  return (
    <div
      style={{
        background: COLORS.card,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 20,
        padding: 18,
        ...style,
      }}
    >
      {children}
    </div>
  );
}

export default function SoundsToLife() {
  const [tab, setTab] = useState("home");
  const [listening, setListening] = useState(false);
  const [pulseKey, setPulseKey] = useState(0);

  const [current, setCurrent] = useState(
    seedEntry("Siren", AlertTriangle, 205, 42, 88, 74, 2)
  );
  const [history, setHistory] = useState([
    seedEntry("Siren", AlertTriangle, 205, 42, 88, 74, 2),
    seedEntry("Dog barking", PawPrint, 95, 9, 93, 61, 11),
    seedEntry("Doorbell", Bell, 15, 4, 97, 55, 26),
  ]);

  const [phoneFlash, setPhoneFlash] = useState(true);
  const [phoneVibrate, setPhoneVibrate] = useState(true);

  const [watchConnected, setWatchConnected] = useState(true);
  const [watchTap, setWatchTap] = useState(true);
  const [watchFace, setWatchFace] = useState(false);

  const [glassesConnected, setGlassesConnected] = useState(false);
  const [glassesOverlay, setGlassesOverlay] = useState(true);
  const [glassesLabel, setGlassesLabel] = useState(true);

  const band = current ? distanceBand(current.distance) : null;

  function detectSound() {
    const t = SOUND_TYPES[Math.floor(Math.random() * SOUND_TYPES.length)];
    const angle = Math.floor(Math.random() * 360);
    const distance = Math.floor(Math.random() * 58) + 2;
    const confidence = Math.floor(Math.random() * 26) + 70;
    const db = Math.floor(Math.random() * 46) + 50;
    const entry = { id: Date.now(), type: t.label, Icon: t.Icon, angle, distance, confidence, db, time: new Date() };
    setCurrent(entry);
    setPulseKey((k) => k + 1);
    setHistory((h) => [entry, ...h].slice(0, 14));
  }

  useEffect(() => {
    if (!listening) return;
    detectSound();
    const id = setInterval(detectSound, 4500);
    return () => clearInterval(id);
  }, [listening]);

  const ringRadii = [60, 100, 140];

  return (
    <div
      style={{
        minHeight: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "flex-start",
        background: COLORS.bg,
        padding: "28px 12px",
        fontFamily: "'Inter', sans-serif",
        boxSizing: "border-box",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes stl-sweep { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes stl-pulse {
          0% { opacity: 0.9; transform: scale(0.85); }
          70% { opacity: 0; transform: scale(1.35); }
          100% { opacity: 0; transform: scale(1.35); }
        }
        .stl-nav-btn { transition: color 0.15s ease; }
        .stl-detect-btn:active { transform: scale(0.97); }
        @keyframes stl-pulse-dot {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.25; }
        }
      `}</style>

      <div
        style={{
          width: 375,
          maxWidth: "100%",
          background: COLORS.phone,
          borderRadius: 46,
          padding: 12,
          boxShadow: "0 30px 60px rgba(11,23,48,0.35)",
        }}
      >
        <div
          style={{
            background: COLORS.blueFaint,
            borderRadius: 36,
            overflow: "hidden",
            height: 780,
            display: "flex",
            flexDirection: "column",
            position: "relative",
          }}
        >
          {/* status bar */}
          <div style={{ height: 30, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <div style={{ width: 90, height: 6, borderRadius: 999, background: "#C7D3EE" }} />
          </div>

          {/* content */}
          <div style={{ flex: 1, overflowY: "auto", padding: "4px 20px 100px" }}>
            {tab === "home" && (
              <>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 2px 18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
                    <svg width="26" height="26" viewBox="0 0 26 26">
                      <circle cx="13" cy="13" r="12" fill={COLORS.blue} />
                      <path d="M8 13a5 5 0 0 1 5 -5" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.55" />
                      <path d="M8 13a5 5 0 0 0 5 5" stroke="#FFFFFF" strokeWidth="1.6" fill="none" strokeLinecap="round" opacity="0.55" />
                      <circle cx="13" cy="13" r="2.6" fill="#FFFFFF" />
                    </svg>
                    <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 17, color: COLORS.ink }}>
                      Sounds to life
                    </span>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 6,
                      background: listening ? COLORS.blueSoft : "#EDF1FA",
                      borderRadius: 999,
                      padding: "6px 12px",
                    }}
                  >
                    {listening ? <Volume2 size={14} color={COLORS.blue} /> : <VolumeX size={14} color={COLORS.muted} />}
                    <span style={{ fontSize: 12.5, fontWeight: 600, color: listening ? COLORS.blue : COLORS.muted }}>
                      {listening ? "Listening" : "Paused"}
                    </span>
                  </div>
                </div>

                <Card style={{ paddingBottom: 22 }}>
                  <div style={{ position: "relative", width: "100%", aspectRatio: "1 / 1", maxWidth: 300, margin: "0 auto" }}>
                    <svg viewBox="0 0 320 320" width="100%" height="100%">
                      <defs>
                        <linearGradient id="arrowGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor={COLORS.cyan} />
                          <stop offset="100%" stopColor={COLORS.blue} />
                        </linearGradient>
                      </defs>

                      {listening && (
                        <g style={{ transformOrigin: "160px 160px", animation: "stl-sweep 7s linear infinite" }}>
                          <line x1="160" y1="160" x2="160" y2="20" stroke={COLORS.blue} strokeWidth="10" opacity="0.06" strokeLinecap="round" />
                        </g>
                      )}

                      {ringRadii.map((r, i) => {
                        const active = current && band === i;
                        return (
                          <circle
                            key={r}
                            cx="160"
                            cy="160"
                            r={r}
                            fill="none"
                            stroke={active ? COLORS.blue : COLORS.border}
                            strokeWidth={active ? 2 : 1.4}
                            opacity={active ? 0.9 : 0.7}
                          />
                        );
                      })}

                      {current && (
                        <circle
                          key={pulseKey}
                          cx="160"
                          cy="160"
                          r={ringRadii[band]}
                          fill="none"
                          stroke={COLORS.cyan}
                          strokeWidth="3"
                          style={{ animation: "stl-pulse 1s ease-out", transformOrigin: "160px 160px" }}
                        />
                      )}

                      {Array.from({ length: 12 }).map((_, i) => {
                        const a = (i * 30 * Math.PI) / 180;
                        const x1 = 160 + 141 * Math.sin(a);
                        const y1 = 160 - 141 * Math.cos(a);
                        const x2 = 160 + 152 * Math.sin(a);
                        const y2 = 160 - 152 * Math.cos(a);
                        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={COLORS.border} strokeWidth="2" strokeLinecap="round" />;
                      })}

                      <g
                        style={{
                          transform: `rotate(${current ? current.angle : 0}deg)`,
                          transformOrigin: "160px 160px",
                          transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)",
                          opacity: current ? 1 : 0.25,
                        }}
                      >
                        <path d="M160,50 L177,152 L160,132 L143,152 Z" fill="url(#arrowGrad)" />
                      </g>

                      <circle cx="160" cy="160" r="15" fill={COLORS.ink} />
                      <circle cx="160" cy="160" r="5.5" fill="#FFFFFF" />
                    </svg>
                  </div>

                  <div style={{ textAlign: "center", marginTop: 6 }}>
                    {current ? (
                      <>
                        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 40, fontWeight: 700, color: COLORS.ink, lineHeight: 1.1 }}>
                          {current.distance}m
                        </div>
                        <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 2 }}>
                          {sectorLabel(current.angle)} &middot; {proximityWord(current.distance)}
                        </div>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 7,
                            marginTop: 14,
                            background: COLORS.blueFaint,
                            border: `1px solid ${COLORS.border}`,
                            borderRadius: 999,
                            padding: "6px 14px",
                          }}
                        >
                          <current.Icon size={15} color={COLORS.blue} />
                          <span style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.ink }}>{current.type}</span>
                        </div>
                        <div style={{ display: "flex", gap: 8, justifyContent: "center", marginTop: 10 }}>
                          <span style={{ fontSize: 11.5, color: COLORS.muted, background: "#F6F9FF", borderRadius: 8, padding: "4px 9px" }}>
                            {current.confidence}% match
                          </span>
                          <span style={{ fontSize: 11.5, color: COLORS.muted, background: "#F6F9FF", borderRadius: 8, padding: "4px 9px" }}>
                            {current.db} dB
                          </span>
                        </div>
                      </>
                    ) : (
                      <div style={{ fontSize: 14, color: COLORS.muted, marginTop: 8 }}>No sound detected yet</div>
                    )}
                  </div>
                </Card>

                <button
                  className="stl-detect-btn"
                  onClick={() => setListening((v) => !v)}
                  style={{
                    width: "100%",
                    marginTop: 14,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 8,
                    background: listening ? COLORS.blueSoft : COLORS.blue,
                    color: listening ? COLORS.blue : "#FFFFFF",
                    border: "none",
                    borderRadius: 16,
                    padding: "14px 0",
                    fontSize: 15,
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "'Space Grotesk', sans-serif",
                  }}
                >
                  {listening && (
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: "50%",
                        background: COLORS.blue,
                        animation: "stl-pulse-dot 1.4s ease-in-out infinite",
                      }}
                    />
                  )}
                  {listening ? "Stop listening" : "Start listening"}
                </button>

                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", margin: "22px 2px 10px" }}>
                  <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 15, color: COLORS.ink }}>
                    Recent sounds
                  </span>
                  <button onClick={() => setTab("history")} style={{ background: "none", border: "none", color: COLORS.blue, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>
                    See all
                  </button>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {history.slice(0, 3).map((h) => (
                    <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "11px 14px" }}>
                      <div style={{ width: 34, height: 34, borderRadius: 10, background: COLORS.blueFaint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <h.Icon size={16} color={COLORS.blue} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13.5, fontWeight: 600, color: COLORS.ink }}>{h.type}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted }}>
                          {h.distance}m &middot; {sectorLabel(h.angle)}
                        </div>
                      </div>
                      <div style={{ fontSize: 11.5, color: COLORS.muted, flexShrink: 0 }}>
                        {h.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "history" && (
              <>
                <div style={{ padding: "10px 2px 4px" }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, color: COLORS.ink }}>Sound history</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 3 }}>Everything picked up around you today</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                  {history.map((h) => (
                    <div key={h.id} style={{ display: "flex", alignItems: "center", gap: 12, background: COLORS.card, border: `1px solid ${COLORS.border}`, borderRadius: 16, padding: "12px 14px" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: COLORS.blueFaint, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                        <h.Icon size={17} color={COLORS.blue} />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 14, fontWeight: 600, color: COLORS.ink }}>{h.type}</div>
                        <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 1 }}>
                          {h.distance}m &middot; {sectorLabel(h.angle)}
                        </div>
                      </div>
                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: 11.5, color: COLORS.muted }}>
                          {h.time.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                        </div>
                        <div style={{ fontSize: 11, color: COLORS.blue, marginTop: 2 }}>{h.confidence}% match</div>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {tab === "devices" && (
              <>
                <div style={{ padding: "10px 2px 4px" }}>
                  <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, fontSize: 20, color: COLORS.ink }}>Connected devices</div>
                  <div style={{ fontSize: 13, color: COLORS.muted, marginTop: 3 }}>Choose how sounds to life reaches you</div>
                </div>

                <Card style={{ marginTop: 16 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: COLORS.blueFaint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Smartphone size={19} color={COLORS.blue} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>This phone</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>Always on, no pairing needed</div>
                    </div>
                    <span style={{ fontSize: 11.5, fontWeight: 600, color: COLORS.blue, background: COLORS.blueSoft, borderRadius: 999, padding: "4px 10px" }}>Active</span>
                  </div>
                  <div style={{ height: 1, background: COLORS.border, margin: "16px 0" }} />
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <ScreenShare size={16} color={COLORS.muted} />
                      <div>
                        <div style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 500 }}>Flash screen for loud sounds</div>
                        <div style={{ fontSize: 11.5, color: COLORS.muted }}>Screen pulses blue above 80 dB</div>
                      </div>
                    </div>
                    <Toggle checked={phoneFlash} onChange={setPhoneFlash} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <Vibrate size={16} color={COLORS.muted} />
                      <div>
                        <div style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 500 }}>Vibrate by distance</div>
                        <div style={{ fontSize: 11.5, color: COLORS.muted }}>Stronger pulse the closer a sound is</div>
                      </div>
                    </div>
                    <Toggle checked={phoneVibrate} onChange={setPhoneVibrate} />
                  </div>
                </Card>

                <Card style={{ marginTop: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: COLORS.blueFaint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Watch size={19} color={COLORS.blue} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>Apple Watch</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{watchConnected ? "Paired and ready" : "Not paired"}</div>
                    </div>
                    <button
                      onClick={() => setWatchConnected((v) => !v)}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: watchConnected ? COLORS.muted : COLORS.blue,
                        background: watchConnected ? "#F1F4FA" : COLORS.blueSoft,
                        border: "none",
                        borderRadius: 999,
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {watchConnected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                  {watchConnected && (
                    <>
                      <div style={{ height: 1, background: COLORS.border, margin: "16px 0" }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 500 }}>Tap wrist on detection</div>
                        <Toggle checked={watchTap} onChange={setWatchTap} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div>
                          <div style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 500 }}>Show direction on watch face</div>
                          <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 1 }}>A small arrow complication on your dial</div>
                        </div>
                        <Toggle checked={watchFace} onChange={setWatchFace} />
                      </div>
                    </>
                  )}
                </Card>

                <Card style={{ marginTop: 12, marginBottom: 8 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: COLORS.blueFaint, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Glasses size={19} color={COLORS.blue} />
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14.5, fontWeight: 600, color: COLORS.ink }}>AR glasses</div>
                      <div style={{ fontSize: 12, color: COLORS.muted }}>{glassesConnected ? "Paired and ready" : "Not paired"}</div>
                    </div>
                    <button
                      onClick={() => setGlassesConnected((v) => !v)}
                      style={{
                        fontSize: 12.5,
                        fontWeight: 600,
                        color: glassesConnected ? COLORS.muted : COLORS.blue,
                        background: glassesConnected ? "#F1F4FA" : COLORS.blueSoft,
                        border: "none",
                        borderRadius: 999,
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      {glassesConnected ? "Disconnect" : "Pair glasses"}
                    </button>
                  </div>

                  {glassesConnected ? (
                    <>
                      <div style={{ height: 1, background: COLORS.border, margin: "16px 0" }} />
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div>
                          <div style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 500 }}>Arrow overlay in view</div>
                          <div style={{ fontSize: 11.5, color: COLORS.muted, marginTop: 1 }}>Points toward the sound as you look around</div>
                        </div>
                        <Toggle checked={glassesOverlay} onChange={setGlassesOverlay} />
                      </div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
                        <div style={{ fontSize: 13.5, color: COLORS.ink, fontWeight: 500 }}>Sound label in view</div>
                        <Toggle checked={glassesLabel} onChange={setGlassesLabel} />
                      </div>
                      <div style={{ fontSize: 11.5, color: COLORS.muted, background: COLORS.blueFaint, borderRadius: 12, padding: "9px 11px" }}>
                        Glasses mode uses more battery than phone alerts alone. Best for walks outside.
                      </div>
                    </>
                  ) : (
                    <div style={{ fontSize: 12, color: COLORS.muted, marginTop: 14, lineHeight: 1.5 }}>
                      Works with compatible AR glasses over Bluetooth. Once paired, direction and sound type show right in your line of sight.
                    </div>
                  )}
                </Card>
              </>
            )}
          </div>

          {/* bottom nav */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              background: "rgba(255,255,255,0.92)",
              backdropFilter: "blur(8px)",
              borderTop: `1px solid ${COLORS.border}`,
              display: "flex",
              padding: "10px 20px 18px",
            }}
          >
            {[
              { key: "home", label: "Home", Icon: Home },
              { key: "history", label: "History", Icon: HistoryIcon },
              { key: "devices", label: "Devices", Icon: Radio },
            ].map(({ key, label, Icon }) => (
              <button
                key={key}
                className="stl-nav-btn"
                onClick={() => setTab(key)}
                style={{
                  flex: 1,
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 4,
                }}
              >
                <Icon size={20} color={tab === key ? COLORS.blue : "#9AA9C7"} />
                <span style={{ fontSize: 11, fontWeight: 600, color: tab === key ? COLORS.blue : "#9AA9C7" }}>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
