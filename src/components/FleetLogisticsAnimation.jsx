import { useState } from "react";

export default function FleetLogisticsAnimation() {
  const [activeVehicle, setActiveVehicle] = useState("Truck-01");

  return (
    <div className="logistics-stage-container">
      <svg
        className="animation-svg-wrapper"
        viewBox="0 0 880 560"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Glowing Gradients */}
          <linearGradient id="phoneBodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="50%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#020617" />
          </linearGradient>

          <linearGradient id="phoneBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#60a5fa" />
            <stop offset="50%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#6366f1" />
          </linearGradient>

          <linearGradient id="screenMapGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#0f172a" />
            <stop offset="100%" stopColor="#1e293b" />
          </linearGradient>

          <linearGradient id="neonRouteGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="50%" stopColor="#60a5fa" />
            <stop offset="100%" stopColor="#a855f7" />
          </linearGradient>

          <linearGradient id="pinGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#94a3b8" />
            <stop offset="40%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          <linearGradient id="pinGlowGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#38bdf8" />
            <stop offset="100%" stopColor="#2563eb" />
          </linearGradient>

          <linearGradient id="handGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818cf8" />
            <stop offset="60%" stopColor="#6366f1" />
            <stop offset="100%" stopColor="#4f46e5" />
          </linearGradient>

          <linearGradient id="truckBadgeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e1b4b" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#312e81" stopOpacity="0.65" />
          </linearGradient>

          <linearGradient id="boxTopGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="boxLeftGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#64748b" />
            <stop offset="100%" stopColor="#475569" />
          </linearGradient>
          <linearGradient id="boxRightGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#475569" />
            <stop offset="100%" stopColor="#334155" />
          </linearGradient>

          {/* Glow filter */}
          <filter id="neonGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="16" stdDeviation="18" floodColor="#000000" floodOpacity="0.6" />
          </filter>
        </defs>

        {/* Ambient background particles / stars */}
        <circle cx="120" cy="80" r="1.5" fill="#38bdf8" opacity="0.6" />
        <circle cx="280" cy="60" r="2" fill="#818cf8" opacity="0.5" />
        <circle cx="740" cy="110" r="1.5" fill="#38bdf8" opacity="0.7" />
        <circle cx="820" cy="340" r="2" fill="#a855f7" opacity="0.6" />
        <circle cx="160" cy="480" r="1.5" fill="#60a5fa" opacity="0.4" />

        {/* ─── 1. ANIMATED NEON ROUTE PATH (Flowing dashed line) ─── */}
        <path
          d="M 170 140 C 220 80, 240 220, 310 120 C 370 40, 470 50, 480 180"
          stroke="#1e3a8a"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.4"
        />
        <path
          d="M 170 140 C 220 80, 240 220, 310 120 C 370 40, 470 50, 480 180"
          stroke="url(#neonRouteGrad)"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeDasharray="10 8"
          style={{ animation: "dashFlow 2s linear infinite" }}
          filter="url(#neonGlow)"
        />

        {/* ─── 2. FLOATING 3D METALLIC GPS PIN (Top Left) ─── */}
        <g style={{ animation: "floatPin 5s ease-in-out infinite" }}>
          {/* Pin Shadow */}
          <ellipse cx="165" cy="210" rx="35" ry="12" fill="#000000" opacity="0.4" />
          {/* Radar ripple rings */}
          <circle cx="165" cy="210" r="20" stroke="#38bdf8" strokeWidth="1.5" fill="none" opacity="0.6" style={{ animation: "pulseRadar 3s ease-out infinite" }} />
          <circle cx="165" cy="210" r="35" stroke="#818cf8" strokeWidth="1.2" fill="none" opacity="0.3" style={{ animation: "pulseRadar 3s ease-out 1s infinite" }} />

          {/* 3D Pin Head */}
          <path
            d="M 120 120 C 120 70, 210 70, 210 120 C 210 160, 165 205, 165 205 C 165 205, 120 160, 120 120 Z"
            fill="url(#pinGrad)"
            stroke="url(#pinGlowGrad)"
            strokeWidth="3"
            filter="url(#softShadow)"
          />
          {/* Pin Center Hole */}
          <circle cx="165" cy="118" r="19" fill="#090d16" stroke="#38bdf8" strokeWidth="2" />
          <circle cx="165" cy="118" r="8" fill="#38bdf8" filter="url(#neonGlow)" />
        </g>

        {/* ─── 3. PHONE & HOLDING HAND (Center) ─── */}
        <g style={{ animation: "floatPhone 6s ease-in-out infinite" }}>
          {/* Stylized Hand (Behind phone) */}
          {/* Palm / Arm */}
          <path
            d="M 280 540 C 260 480, 275 360, 310 300 C 335 255, 360 270, 365 320 L 400 540 Z"
            fill="url(#handGrad)"
            opacity="0.95"
          />
          {/* Fingers wrapping around phone */}
          {/* Thumb */}
          <path
            d="M 310 320 C 295 310, 290 350, 295 400 C 300 450, 330 460, 345 420 C 355 390, 345 340, 310 320 Z"
            fill="#a5b4fc"
          />
          {/* Index finger */}
          <rect x="585" y="270" width="60" height="24" rx="12" fill="#818cf8" transform="rotate(-15 585 270)" />
          {/* Middle finger */}
          <rect x="595" y="320" width="65" height="24" rx="12" fill="#6366f1" transform="rotate(-12 595 320)" />
          {/* Ring finger */}
          <rect x="590" y="370" width="60" height="24" rx="12" fill="#4f46e5" transform="rotate(-8 590 370)" />
          {/* Little finger */}
          <rect x="580" y="420" width="50" height="22" rx="11" fill="#4338ca" transform="rotate(-4 580 420)" />

          {/* Smartphone Outer Shadow */}
          <rect
            x="355"
            y="140"
            width="250"
            height="410"
            rx="36"
            fill="#000000"
            opacity="0.6"
            filter="url(#softShadow)"
          />

          {/* Phone Outer Chassis / Bezel */}
          <rect
            x="350"
            y="130"
            width="250"
            height="410"
            rx="36"
            fill="url(#phoneBodyGrad)"
            stroke="url(#phoneBorderGrad)"
            strokeWidth="3.5"
          />

          {/* Phone Screen Glass */}
          <rect
            x="360"
            y="140"
            width="230"
            height="390"
            rx="28"
            fill="url(#screenMapGrad)"
          />

          {/* Dynamic Island / Speaker Notch */}
          <rect x="435" y="148" width="80" height="18" rx="9" fill="#020617" />
          <circle cx="500" cy="157" r="4.5" fill="#1e293b" />

          {/* ─── Map Interface on Screen ─── */}
          {/* Map City Grid Blocks */}
          <rect x="370" y="180" width="55" height="70" rx="6" fill="#1e293b" opacity="0.7" />
          <rect x="435" y="180" width="65" height="50" rx="6" fill="#1e293b" opacity="0.6" />
          <rect x="510" y="180" width="70" height="90" rx="6" fill="#1e293b" opacity="0.8" />
          <rect x="370" y="260" width="70" height="80" rx="6" fill="#334155" opacity="0.4" />
          <rect x="450" y="240" width="50" height="60" rx="6" fill="#1e293b" opacity="0.7" />
          <rect x="510" y="280" width="70" height="60" rx="6" fill="#334155" opacity="0.5" />

          {/* Map Highway Streets */}
          <line x1="360" y1="250" x2="590" y2="250" stroke="#090d16" strokeWidth="12" />
          <line x1="445" y1="140" x2="445" y2="400" stroke="#090d16" strokeWidth="12" />
          <line x1="505" y1="140" x2="505" y2="400" stroke="#090d16" strokeWidth="10" />

          {/* Live Turn-by-Turn Route Navigation on Map (Electric Blue) */}
          <path
            d="M 505 170 L 490 280 L 470 330"
            stroke="#60a5fa"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter="url(#neonGlow)"
          />
          <path
            d="M 505 170 L 490 280 L 470 330"
            stroke="#ffffff"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Moving Vehicle Arrow Marker on Map */}
          <g transform="translate(470, 330) rotate(-15)">
            <circle cx="0" cy="0" r="14" fill="#38bdf8" opacity="0.25" style={{ animation: "pulseRadar 2s infinite" }} />
            <polygon points="0,-10 8,8 0,4 -8,8" fill="#38bdf8" stroke="#ffffff" strokeWidth="2" filter="url(#neonGlow)" />
          </g>

          {/* Phone Bottom Telemetry HUD Card */}
          <rect
            x="370"
            y="370"
            width="210"
            height="145"
            rx="18"
            fill="#ffffff"
            filter="url(#softShadow)"
          />
          {/* Card header */}
          <circle cx="395" cy="400" r="14" fill="#eff6ff" />
          <path d="M 395 393 L 395 401 L 401 401" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" fill="none" />
          <rect x="420" y="394" width="60" height="12" rx="4" fill="#2563eb" />
          <rect x="420" y="412" width="95" height="5" rx="2.5" fill="#94a3b8" />

          {/* Route progress dots */}
          <circle cx="395" cy="438" r="4.5" fill="#3b82f6" />
          <circle cx="395" cy="452" r="2.5" fill="#cbd5e1" />
          <circle cx="395" cy="466" r="4.5" fill="#10b981" />
          <rect x="415" y="435" width="80" height="5" rx="2.5" fill="#334155" />
          <rect x="415" y="445" width="130" height="4" rx="2" fill="#cbd5e1" />
          <rect x="415" y="463" width="105" height="5" rx="2.5" fill="#10b981" />

          {/* ETA / Speed pill */}
          <rect x="382" y="482" width="85" height="22" rx="6" fill="#f1f5f9" />
          <text x="390" y="497" fill="#1e293b" fontSize="10" fontWeight="700" fontFamily="sans-serif">ETA: 18m · 12km</text>
          <rect x="475" y="482" width="90" height="22" rx="6" fill="#dbeafe" />
          <text x="483" y="497" fill="#1d4ed8" fontSize="10" fontWeight="700" fontFamily="sans-serif">Dispatch Live</text>
        </g>

        {/* ─── 4. FLOATING GLASSMORPHIC TRUCK BADGE (Top Right) ─── */}
        <g style={{ animation: "floatTruckBadge 5.5s ease-in-out infinite" }}>
          {/* Badge Glow & Body */}
          <rect
            x="640"
            y="170"
            width="170"
            height="120"
            rx="24"
            fill="url(#truckBadgeGrad)"
            stroke="url(#neonRouteGrad)"
            strokeWidth="2"
            filter="url(#neonGlow)"
          />
          {/* Soft inner highlight */}
          <rect
            x="645"
            y="175"
            width="160"
            height="110"
            rx="20"
            fill="none"
            stroke="rgba(255,255,255,0.15)"
            strokeWidth="1"
          />

          {/* Neon Truck Icon */}
          <g transform="translate(670, 200)">
            {/* Speed lines */}
            <line x1="-10" y1="12" x2="0" y2="12" stroke="#38bdf8" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="-15" y1="24" x2="-4" y2="24" stroke="#818cf8" strokeWidth="2.5" strokeLinecap="round" />
            {/* Truck Container */}
            <rect x="6" y="2" width="60" height="40" rx="5" fill="none" stroke="#60a5fa" strokeWidth="3.2" />
            {/* Cabin */}
            <path
              d="M 66 12 L 84 12 C 88 12, 92 16, 92 20 L 92 42 L 66 42 Z"
              fill="none"
              stroke="#60a5fa"
              strokeWidth="3.2"
            />
            {/* Window */}
            <path d="M 72 18 L 84 18 L 84 28 L 72 28 Z" fill="#93c5fd" opacity="0.6" />
            {/* Wheels */}
            <circle cx="26" cy="46" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="26" cy="46" r="3" fill="#ffffff" />
            <circle cx="76" cy="46" r="8" fill="#0f172a" stroke="#38bdf8" strokeWidth="3" />
            <circle cx="76" cy="46" r="3" fill="#ffffff" />
          </g>

          {/* Mini Status Pill */}
          <rect x="665" y="262" width="120" height="18" rx="9" fill="rgba(37, 99, 235, 0.35)" />
          <circle cx="676" cy="271" r="3.5" fill="#4ade80" />
          <text x="685" y="275" fill="#e2e8f0" fontSize="9" fontWeight="600" fontFamily="sans-serif">FLEET EN ROUTE</text>
        </g>

        {/* ─── 5. FLOATING 3D ISOMETRIC CARGO DELIVERY BOX (Bottom Right) ─── */}
        <g style={{ animation: "floatBox 6.5s ease-in-out infinite" }}>
          {/* Box Shadow */}
          <ellipse cx="715" cy="510" rx="70" ry="18" fill="#000000" opacity="0.5" />

          {/* 3D Isometric Box */}
          {/* Top Face */}
          <polygon
            points="700,380 770,415 700,450 630,415"
            fill="url(#boxTopGrad)"
            stroke="#94a3b8"
            strokeWidth="1.5"
          />
          {/* Left Face */}
          <polygon
            points="630,415 700,450 700,520 630,485"
            fill="url(#boxLeftGrad)"
            stroke="#475569"
            strokeWidth="1.5"
          />
          {/* Right Face */}
          <polygon
            points="700,450 770,415 770,485 700,520"
            fill="url(#boxRightGrad)"
            stroke="#334155"
            strokeWidth="1.5"
          />

          {/* White Shipping Tape along top & side */}
          <polygon
            points="688,386 712,398 676,438 652,426"
            fill="#f1f5f9"
            opacity="0.85"
          />
          <polygon
            points="652,426 676,438 676,508 652,496"
            fill="#e2e8f0"
            opacity="0.7"
          />

          {/* Fragile / Up Arrows on box side */}
          <g transform="translate(720, 460) skewY(15)">
            <path d="M 10 16 L 10 6 M 6 10 L 10 6 L 14 10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
            <path d="M 22 16 L 22 6 M 18 10 L 22 6 L 26 10" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" />
          </g>
        </g>
      </svg>
    </div>
  );
}
