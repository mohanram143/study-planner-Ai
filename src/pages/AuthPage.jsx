import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from "firebase/auth";
import sitBoy from "../assets/sitBoy.svg";
import saly from "../assets/Saly.svg"
import {Brain
} from "lucide-react"

const firebaseConfig = {
  apiKey: "AIzaSyCnU4pXtdgTiDlo2ZzOAA3K0mUyqH0kUMs",
  authDomain: "study-planner-ai-88aa7.firebaseapp.com",
  projectId: "study-planner-ai-88aa7",
  storageBucket: "study-planner-ai-88aa7.firebasestorage.app",
  messagingSenderId: "76187477136",
  appId: "1:76187477136:web:5bb9ff25744674f12ea415",
  measurementId: "G-NYZ9MD8RLC",
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// ── Landscape SVG Panel ────────────────────────────────────────
const LandscapeSVG = () => (
  <svg
    viewBox="0 0 480 580"
    xmlns="http://www.w3.org/2000/svg"
    className="w-full h-full"
    preserveAspectRatio="xMidYMid slice"
  >
    <defs>
      <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1a0533" />
        <stop offset="40%" stopColor="#2d0a6e" />
        <stop offset="70%" stopColor="#6b21a8" />
        <stop offset="100%" stopColor="#9333ea" />
      </linearGradient>
      <linearGradient id="mtn1" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#1e1035" />
        <stop offset="100%" stopColor="#2d1b5e" />
      </linearGradient>
      <linearGradient id="mtn2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#7c3aed" />
        <stop offset="100%" stopColor="#4c1d95" />
      </linearGradient>
      <linearGradient id="mtn3" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#5b21b6" />
        <stop offset="100%" stopColor="#3b0764" />
      </linearGradient>
      <linearGradient id="ground" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#4c1d95" />
        <stop offset="100%" stopColor="#1e0a3c" />
      </linearGradient>
      <linearGradient id="river" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
        <stop offset="50%" stopColor="#c084fc" stopOpacity="0.7" />
        <stop offset="100%" stopColor="#7c3aed" stopOpacity="0.2" />
      </linearGradient>
      <linearGradient id="glowPink" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.9" />
        <stop offset="100%" stopColor="#be185d" stopOpacity="0.3" />
      </linearGradient>
      <radialGradient id="moonGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f5d0fe" stopOpacity="0.4" />
        <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="pinkGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#fb7185" stopOpacity="0.5" />
        <stop offset="100%" stopColor="#f43f5e" stopOpacity="0" />
      </radialGradient>
      <filter id="blur2">
        <feGaussianBlur stdDeviation="2" />
      </filter>
      <filter id="blur4">
        <feGaussianBlur stdDeviation="4" />
      </filter>
      <clipPath id="roundedCard">
        <rect width="480" height="580" rx="20" ry="20" />
      </clipPath>
    </defs>

    <g clipPath="url(#roundedCard)">
      {/* Sky */}
      <rect width="480" height="580" fill="url(#sky)" />

      {/* Stars */}
      {[
        [40, 30],
        [80, 20],
        [130, 45],
        [170, 18],
        [220, 35],
        [270, 22],
        [310, 50],
        [360, 28],
        [410, 40],
        [450, 20],
        [60, 70],
        [110, 85],
        [160, 65],
        [200, 90],
        [250, 75],
        [300, 60],
        [350, 80],
        [400, 70],
        [440, 55],
        [30, 95],
        [90, 110],
        [140, 125],
        [190, 100],
        [240, 115],
        [290, 105],
        [340, 120],
        [390, 95],
        [430, 110],
        [20, 130],
        [70, 145],
        [120, 135],
        [165, 150],
        [210, 140],
        [260, 130],
        [305, 145],
        [355, 135],
        [405, 150],
        [455, 125],
      ].map(([x, y], i) => (
        <circle
          key={i}
          cx={x}
          cy={y}
          r={i % 4 === 0 ? 1.5 : i % 3 === 0 ? 1.2 : 0.8}
          fill="white"
          opacity={0.4 + (i % 5) * 0.12}
        >
          <animate
            attributeName="opacity"
            values={`${0.3 + (i % 5) * 0.1};${0.8 + (i % 3) * 0.1};${0.3 + (i % 5) * 0.1}`}
            dur={`${2 + (i % 4)}s`}
            repeatCount="indefinite"
          />
        </circle>
      ))}

      {/* Moon glow */}
      <circle cx="370" cy="80" r="50" fill="url(#moonGlow)" />
      <circle
        cx="370"
        cy="80"
        r="22"
        fill="#f3e8ff"
        opacity="0.15"
        filter="url(#blur4)"
      />
      <circle cx="370" cy="80" r="14" fill="#faf5ff" opacity="0.9" />
      <circle cx="363" cy="75" r="4" fill="#e9d5ff" opacity="0.5" />
      <circle cx="376" cy="84" r="3" fill="#e9d5ff" opacity="0.4" />

      {/* Pink mountain glow */}
      <ellipse
        cx="160"
        cy="280"
        rx="90"
        ry="60"
        fill="url(#pinkGlow)"
        filter="url(#blur4)"
      />

      {/* Back mountains (dark) */}
      <path
        d="M-10 350 L60 200 L120 310 L180 160 L240 260 L300 180 L360 300 L420 220 L490 320 L490 420 L-10 420Z"
        fill="url(#mtn1)"
        opacity="0.9"
      />

      {/* Mid mountains (purple-dark) */}
      <path
        d="M-10 390 L40 260 L100 340 L150 210 L210 310 L260 240 L310 340 L370 260 L420 340 L490 280 L490 440 L-10 440Z"
        fill="url(#mtn3)"
      />

      {/* Pink lit mountain peak */}
      <path
        d="M100 380 L155 230 L165 255 L175 235 L220 360Z"
        fill="url(#glowPink)"
      />
      <path d="M155 230 L165 255 L175 235" fill="#f9a8d4" opacity="0.8" />

      {/* Front mountains */}
      <path
        d="M-10 440 L50 320 L110 400 L160 300 L220 390 L280 320 L340 400 L400 310 L460 400 L490 360 L490 480 L-10 480Z"
        fill="url(#mtn2)"
      />

      {/* Ground / valley */}
      <path d="M-10 480 L490 480 L490 580 L-10 580Z" fill="url(#ground)" />
      <path
        d="M-10 460 C80 440 160 480 240 455 C320 430 400 470 490 450 L490 500 L-10 500Z"
        fill="#3b0764"
        opacity="0.8"
      />

      {/* River / water reflection */}
      <path
        d="M180 460 C200 450 230 465 250 455 C270 445 290 460 310 452 L310 480 C290 475 270 488 250 478 C230 468 200 475 180 480Z"
        fill="url(#river)"
      />
      <path
        d="M185 465 C210 458 240 470 265 462"
        stroke="#c4b5fd"
        strokeWidth="0.8"
        fill="none"
        opacity="0.6"
      >
        <animate
          attributeName="opacity"
          values="0.6;0.9;0.6"
          dur="3s"
          repeatCount="indefinite"
        />
      </path>

      {/* Foreground rocks/land */}
      <ellipse cx="80" cy="510" rx="70" ry="35" fill="#1e0a3c" opacity="0.9" />
      <ellipse cx="400" cy="520" rx="90" ry="30" fill="#1e0a3c" opacity="0.9" />
      <path
        d="M-10 540 C30 520 80 535 130 525 L130 580 L-10 580Z"
        fill="#150726"
      />
      <path
        d="M350 530 C390 515 440 528 490 520 L490 580 L350 580Z"
        fill="#150726"
      />

      {/* Foreground plants */}
      <path
        d="M30 540 C25 510 20 495 15 480 M30 540 C35 505 40 490 50 475 M30 540 C30 508 32 492 38 478"
        stroke="#4c1d95"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />
      <path
        d="M450 535 C445 505 438 490 432 476 M450 535 C455 500 462 485 470 470 M450 535 C450 504 452 488 458 474"
        stroke="#4c1d95"
        strokeWidth="3"
        fill="none"
        strokeLinecap="round"
      />

      {/* Shooting star */}
      <line
        x1="300"
        y1="30"
        x2="340"
        y2="55"
        stroke="white"
        strokeWidth="1"
        opacity="0.8"
      >
        <animate
          attributeName="opacity"
          values="0;0.9;0"
          dur="4s"
          begin="2s"
          repeatCount="indefinite"
        />
      </line>

      {/* Purple overlay for mood */}
      <rect width="480" height="580" fill="#4c1d95" opacity="0.08" />

      {/* Bottom gradient overlay for text readability */}
      <rect y="430" width="480" height="150" fill="url(#sky)" opacity="0.5" />

      {/* Slide dots */}
    </g>
  </svg>
);

// ── Icons ──────────────────────────────────────────────────────
const GoogleSVG = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const AppleSVG = () => (
  <svg
    viewBox="0 0 24 24"
    className="w-5 h-5"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
  </svg>
);

const EyeIcon = ({ open }) =>
  open ? (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[18px] h-[18px]"
    >
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ) : (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="w-[18px] h-[18px]"
    >
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
      <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
      <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
  );

const CheckSVG = () => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-8 h-8"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

// ── Toast ──────────────────────────────────────────────────────
const Toast = ({ toasts }) => (
  <div className="fixed top-5 right-5 z-[9999] flex flex-col gap-2 pointer-events-none">
    {toasts.map((t) => (
      <div
        key={t.id}
        className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-semibold shadow-2xl border pointer-events-auto animate-slideIn
          ${
            t.type === "success"
              ? "bg-emerald-950/95 border-emerald-500/30 text-emerald-300"
              : t.type === "error"
                ? "bg-red-950/95 border-red-500/30 text-red-300"
                : "bg-violet-950/95 border-violet-500/30 text-violet-300"
          }`}
        style={{ backdropFilter: "blur(20px)" }}
      >
        <span>
          {t.type === "success" ? "✅" : t.type === "error" ? "❌" : "ℹ️"}
        </span>
        {t.message}
      </div>
    ))}
  </div>
);

// ── GRAND CELEBRATION SUCCESS MODAL 🎉🎂🎈 ─────────────────────
const SuccessModal = ({ user, onNavigate }) => (
  <div className="fixed inset-0 z-[9999] overflow-hidden flex items-center justify-center bg-gradient-to-br from-fuchsia-950 via-purple-950 to-indigo-950 animate-fadeIn">
    {/* Animated Party Background */}
    <div className="absolute inset-0">
      {/* Glow blobs */}
      <div className="absolute top-[-120px] left-[-80px] w-[350px] h-[350px] bg-pink-500/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute bottom-[-100px] right-[-50px] w-[300px] h-[300px] bg-indigo-500/30 blur-3xl rounded-full animate-pulse" />
      <div className="absolute top-[20%] right-[20%] w-[220px] h-[220px] bg-yellow-400/20 blur-3xl rounded-full animate-bounce" />

      {/* Floating Balloons */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute animate-float"
          style={{
            left: `${5 + i * 8}%`,
            bottom: `-${Math.random() * 120}px`,
            animationDelay: `${i * 0.3}s`,
            animationDuration: `${5 + (i % 3)}s`,
          }}
        >
          <div
            className="w-12 h-14 rounded-full relative shadow-2xl"
            style={{
              background: [
                "#ff4d6d",
                "#22c55e",
                "#3b82f6",
                "#facc15",
                "#a855f7",
                "#fb7185",
              ][i % 6],
            }}
          >
            <div className="absolute left-1/2 top-full w-[2px] h-16 bg-white/40 -translate-x-1/2" />
          </div>
        </div>
      ))}

      {/* Confetti */}
      {[...Array(80)].map((_, i) => (
        <span
          key={i}
          className="absolute animate-confettiFall"
          style={{
            left: `${Math.random() * 100}%`,
            top: `-${Math.random() * 100}px`,
            width: `${6 + Math.random() * 6}px`,
            height: `${10 + Math.random() * 10}px`,
            background: [
              "#ff4d6d",
              "#22c55e",
              "#3b82f6",
              "#facc15",
              "#a855f7",
              "#fb7185",
            ][i % 6],
            transform: `rotate(${Math.random() * 360}deg)`,
            animationDelay: `${Math.random() * 4}s`,
            animationDuration: `${4 + Math.random() * 4}s`,
          }}
        />
      ))}

      {/* Sparkles */}
      {[...Array(25)].map((_, i) => (
        <div
          key={i}
          className="absolute text-yellow-300 animate-ping"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${i * 0.2}s`,
          }}
        >
          ✨
        </div>
      ))}
    </div>

    {/* Main Modal */}
    <div className="relative z-10 w-full max-w-md mx-4">
      {/* Outer Glow Ring */}
      <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-yellow-400 to-indigo-500 rounded-[40px] blur-2xl opacity-70 animate-pulse scale-105" />

      <div className="relative backdrop-blur-2xl bg-white/10 border border-white/20 rounded-[40px] shadow-[0_0_80px_rgba(255,255,255,0.15)] p-8 text-center overflow-hidden">
        {/* Decorative top lights */}
        <div className="absolute top-0 left-0 w-full flex justify-center gap-3 py-2">
          {[
            "bg-pink-400",
            "bg-yellow-300",
            "bg-green-400",
            "bg-blue-400",
            "bg-purple-400",
          ].map((c, i) => (
            <div
              key={i}
              className={`w-3 h-3 rounded-full ${c} animate-pulse shadow-lg`}
              style={{ animationDelay: `${i * 0.2}s` }}
            />
          ))}
        </div>

        {/* Crown Emoji */}
        <div className="text-5xl mb-2 animate-bounce">👑</div>

        {/* Avatar */}
        <div className="relative flex justify-center">
          {user?.photoURL ? (
            <img
              src={user.photoURL}
              referrerPolicy="no-referrer"
              crossOrigin="anonymous"
              alt="avatar"
              onError={(e) => {
                e.target.style.display = "none";
              }}
              className="w-24 h-24 rounded-full mx-auto border-4 border-yellow-300 shadow-2xl shadow-yellow-400/40 object-cover animate-popIn"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-yellow-300 to-pink-500 flex items-center justify-center text-4xl mx-auto shadow-2xl animate-popIn">
              🎉
            </div>
          )}
        </div>
        {/* Heading */}
        <h1 className="mt-5 text-4xl font-extrabold bg-gradient-to-r from-pink-300 via-yellow-200 to-indigo-200 bg-clip-text text-transparent animate-pulse">
          Login Successfully
        </h1>

        <h2 className="mt-2 text-2xl font-bold text-white">
          {user?.displayName
            ? `${user.displayName.split(" ")[0]}, Welcome Aboard 🎂`
            : "Welcome Champion 🎂"}
        </h2>

        <p className="text-pink-100 mt-3 leading-relaxed">
          Your account is now successfully connected! <br />
          Time to celebrate this magical moment 🥳🎈
        </p>

        {/* Fancy Progress */}
        <div className="mt-6 w-full h-3 bg-white/10 rounded-full overflow-hidden border border-white/10">
          <div className="h-full w-full bg-gradient-to-r from-pink-500 via-yellow-300 to-indigo-400 animate-progressBar rounded-full" />
        </div>

        {/* Party Icons */}
        <div className="flex justify-center gap-4 text-3xl mt-6 animate-bounce">
          <span>🎊</span>
          <span>🎉</span>
          <span>🎁</span>
          <span>🍰</span>
          <span>🥳</span>
        </div>

        {/* CTA Button */}
        <button
          onClick={onNavigate}
          className="mt-8 relative overflow-hidden group w-full py-4 rounded-2xl bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500 text-white font-bold text-lg shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300"
        >
          <span className="relative z-10">Enter Dashboard 🚀</span>

          <div className="absolute inset-0 bg-white/20 opacity-0 group-hover:opacity-100 transition duration-300" />
        </button>
      </div>
    </div>
  </div>
);
// ── Floating Orb Background ────────────────────────────────────
const Background = () => (
  <div className="fixed inset-0 overflow-hidden pointer-events-none">
    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-indigo-600/20 blur-3xl animate-float1" />
    <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full bg-violet-600/20 blur-3xl animate-float2" />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 rounded-full bg-blue-600/10 blur-3xl animate-float3" />
    <div
      className="absolute inset-0 opacity-[0.03]"
      style={{
        backgroundImage:
          "linear-gradient(rgba(99,102,241,1) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,1) 1px, transparent 1px)",
        backgroundSize: "50px 50px",
      }}
    />
  </div>
);

// ── Input Field ────────────────────────────────────────────────
const Input = ({
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  rightEl,
}) => (
  <div className="flex flex-col gap-1.5">
    {label && (
      <label className="text-xs font-semibold text-purple-300/80 tracking-widest uppercase">
        {label}
      </label>
    )}
    <div className="relative">
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-300"
        style={{
          background: "rgba(109,40,217,0.08)",
          border: "1px solid rgba(139,92,246,0.2)",
          fontFamily: "'Space Grotesk', sans-serif",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "rgba(167,139,250,0.6)";
          e.target.style.background = "rgba(109,40,217,0.12)";
          e.target.style.boxShadow = "0 0 0 3px rgba(139,92,246,0.12)";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "rgba(139,92,246,0.2)";
          e.target.style.background = "rgba(109,40,217,0.08)";
          e.target.style.boxShadow = "none";
        }}
      />
      {rightEl && (
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
          {rightEl}
        </div>
      )}
    </div>
  </div>
);

// ── Main ───────────────────────────────────────────────────────
export default function AuthPage(collapsed) {
  const navigate = useNavigate();
  const [tab, setTab] = useState("signup");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [appleLoading, setAppleLoading] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [successUser, setSuccessUser] = useState(null);
  const [mounted, setMounted] = useState(false);
  const toastId = useRef(0);

  useEffect(() => {
    setTimeout(() => setMounted(true), 50);
  }, []);

  const toast = (message, type = "info") => {
    const id = ++toastId.current;
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 4000);
  };

  const onSuccess = (user) => setTimeout(() => setSuccessUser(user), 500);

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const r = await signInWithPopup(auth, googleProvider);
      toast(
        `Welcome, ${r.user.displayName?.split(" ")[0] || "there"}! 🎉`,
        "success",
      );
      onSuccess(r.user);
    } catch (e) {
      toast(
        e.code === "auth/popup-closed-by-user"
          ? "Sign-in cancelled"
          : e.code === "auth/popup-blocked"
            ? "Allow popups for this site"
            : "Google sign-in failed",
        "error",
      );
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleApple = () => toast("Apple sign-in coming soon!", "info");

  const handleSignIn = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast("Please fill all fields", "error");
    setLoading(true);
    try {
      const r = await signInWithEmailAndPassword(auth, email, password);
      toast("Signed in successfully!", "success");
      onSuccess(r.user);
    } catch (e) {
      toast(
        e.code === "auth/invalid-credential"
          ? "Invalid email or password"
          : e.code === "auth/too-many-requests"
            ? "Too many attempts — try later"
            : "Sign in failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (!firstName || !email || !password)
      return toast("Please fill all fields", "error");
    if (!agreed)
      return toast("Please agree to the terms & conditions", "error");
    if (password.length < 6)
      return toast("Password must be at least 6 characters", "error");
    setLoading(true);
    try {
      const r = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(r.user, {
        displayName: `${firstName} ${lastName}`.trim(),
      });
      toast("Account created! Welcome aboard 🎉", "success");
      onSuccess(r.user);
    } catch (e) {
      toast(
        e.code === "auth/email-already-in-use"
          ? "Email already registered — try signing in"
          : e.code === "auth/weak-password"
            ? "Password too weak"
            : "Sign up failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async () => {
    if (!email) return toast("Enter your email first", "error");
    try {
      await sendPasswordResetEmail(auth, email);
      toast("Reset email sent! Check your inbox.", "success");
    } catch {
      toast("Could not send reset email", "error");
    }
  };

  const switchTab = (t) => {
    setTab(t);
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
    setAgreed(false);
    setShowPw(false);
  };

  const pwStrength = !password
    ? 0
    : password.length < 4
      ? 1
      : password.length < 6
        ? 2
        : password.length < 10
          ? 3
          : 4;
  const pwColor = ["", "#ef4444", "#f97316", "#eab308", "#22c55e"][pwStrength];
  const pwLabel = ["", "Weak", "Fair", "Good", "Strong"][pwStrength];

  return (
    <>
      <style>
        {`
      
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800&family=Space+Grotesk:wght@400;500;600&display=swap');
        *,*::before,*::after{box-sizing:border-box;}
        body{margin:0;background:#0a0515;}
        input::placeholder{color:rgba(167,139,250,0.35);}
        input{color-scheme:dark;}

        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes scaleIn{from{opacity:0;transform:scale(0.85) translateY(16px)}to{opacity:1;transform:scale(1) translateY(0)}}
        @keyframes popIn{0%{transform:scale(0)}60%{transform:scale(1.2)}100%{transform:scale(1)}}
        @keyframes progressBar{from{width:0}to{width:100%}}
        @keyframes confetti{0%{transform:translateY(0) rotate(0deg);opacity:1}100%{transform:translateY(90px) rotate(720deg);opacity:0}}
        @keyframes slideIn{from{opacity:0;transform:translateX(30px)}to{opacity:1;transform:translateX(0)}}
        @keyframes panelIn{from{opacity:0;transform:translateX(-24px)}to{opacity:1;transform:translateX(0)}}
        @keyframes formIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}
        @keyframes spin{to{transform:rotate(360deg)}}
        @keyframes floatUp{0%,100%{transform:translateY(0)}50%{transform:translateY(-6px)}}
        @keyframes shimmerLine{0%{background-position:-400% 0}100%{background-position:400% 0}}

        .animate-fadeIn{animation:fadeIn 0.3s ease-out}
        .animate-scaleIn{animation:scaleIn 0.45s cubic-bezier(0.34,1.56,0.64,1)}
        .animate-popIn{animation:popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.15s both}
        .animate-progressBar{animation:progressBar 2.5s ease-in-out 0.4s both forwards}
        .animate-confetti{animation:confetti 1.4s ease-out both}
        .animate-slideIn{animation:slideIn 0.35s ease-out}
        .animate-panel{animation:panelIn 0.6s ease-out}
        .animate-form{animation:formIn 0.4s ease-out}
        .animate-spin{animation:spin 0.9s linear infinite}
        .animate-float{animation:floatUp 4s ease-in-out infinite}

        .card-wrap{
          display:flex;width:100%;max-width:920px;min-height:560px;
          border-radius:20px;overflow:hidden;
          background:#100820;
          border:1px solid rgba(139,92,246,0.15);
          box-shadow:0 0 100px rgba(109,40,217,0.12), 0 40px 80px rgba(0,0,0,0.7);
        }
        .panel-left{
          width:42%;flex-shrink:0;position:relative;overflow:hidden;
        }
        .panel-right{
          flex:1;display:flex;flex-direction:column;justify-content:center;
          padding:48px 44px;
          background:rgba(8,4,20,0.6);
          border-left:1px solid rgba(139,92,246,0.1);
        }
        .tab-wrap{
          display:inline-flex;gap:0;padding:4px;border-radius:12px;margin-bottom:28px;
          background:rgba(109,40,217,0.1);border:1px solid rgba(139,92,246,0.15);
        }
        .tab-btn{
          padding:8px 24px;border-radius:9px;font-family:'Outfit',sans-serif;font-weight:600;font-size:13px;
          border:none;cursor:pointer;transition:all 0.3s cubic-bezier(0.34,1.56,0.64,1);
        }
        .tab-active{background:linear-gradient(135deg,#7c3aed,#9333ea);color:white;box-shadow:0 4px 14px rgba(124,58,237,0.4);}
        .tab-inactive{background:transparent;color:rgba(167,139,250,0.6);}
        .tab-inactive:hover{color:rgba(167,139,250,1);}
        .btn-main{
          width:100%;padding:13px;border-radius:12px;border:none;cursor:pointer;
          background:linear-gradient(135deg,#7c3aed,#9333ea);
          color:white;font-family:'Outfit',sans-serif;font-weight:700;font-size:15px;
          transition:all 0.3s ease;position:relative;overflow:hidden;
          box-shadow:0 4px 20px rgba(124,58,237,0.3);
        }
        .btn-main:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(124,58,237,0.45);}
        .btn-main:active{transform:translateY(0);}
        .btn-main:disabled{opacity:0.55;cursor:not-allowed;transform:none;}
        .btn-social{
          flex:1;display:flex;align-items:center;justify-content:center;gap:10px;
          padding:11px 16px;border-radius:12px;cursor:pointer;
          font-family:'Outfit',sans-serif;font-weight:600;font-size:13px;
          border:1px solid rgba(139,92,246,0.2);background:rgba(109,40,217,0.07);
          color:rgba(229,222,255,0.85);transition:all 0.25s ease;
        }
        .btn-social:hover{background:rgba(109,40,217,0.14);border-color:rgba(167,139,250,0.35);transform:translateY(-1px);}
        .btn-social:disabled{opacity:0.5;cursor:not-allowed;}
        .divider{display:flex;align-items:center;gap:12px;margin:4px 0;}
        .divider::before,.divider::after{content:'';flex:1;height:1px;background:rgba(139,92,246,0.2);}
        .divider span{font-size:11px;color:rgba(167,139,250,0.5);white-space:nowrap;font-family:'Outfit',sans-serif;letter-spacing:0.05em;}
        .checkbox-wrap{display:flex;align-items:center;gap:10px;cursor:pointer;}
        .checkbox-box{
          width:18px;height:18px;border-radius:5px;flex-shrink:0;
          border:1.5px solid rgba(139,92,246,0.4);background:rgba(109,40,217,0.1);
          display:flex;align-items:center;justify-content:center;
          transition:all 0.2s;
        }
        .checkbox-box.checked{background:#7c3aed;border-color:#7c3aed;}
        .shimmer-top{
          height:1.5px;width:100%;
          background:linear-gradient(90deg,transparent,rgba(167,139,250,0.8),transparent);
          background-size:400% 100%;
          animation:shimmerLine 3s linear infinite;
        }

        @media(max-width:700px){
          .card-wrap{flex-direction:column;max-width:420px;}
          .panel-left{width:100%;height:220px;}
          .panel-right{padding:32px 28px;}
        }
      `}
        
      </style>

      <Toast toasts={toasts} />
      {successUser && (
        <SuccessModal
          user={successUser}
          onNavigate={() => {
            setSuccessUser(null);
            navigate("/dashboard");
          }}
        />
      )}

      <div
        className="min-h-screen flex items-center justify-center p-4"
        style={{
          fontFamily: "'Outfit',sans-serif",
          background:
            "radial-gradient(ellipse at 30% 40%, rgba(109,40,217,0.12) 0%, transparent 60%), #0a0515",
        }}
      >
        <div
          className={`card-wrap transition-all duration-700 ${mounted ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          {/* Left Panel */}
<div className="relative flex items-center justify-center">
         {/* Logo */}
      <div
        className="flex items-center gap-3 px-4 py-5 items-left justify-left absolute top-0 left-0 w-full"
        style={{ borderBottom: "1px solid var(--border)" }}
      >
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "linear-gradient(135deg,#7c3aed,#9333ea)" }}
        >
          <Brain size={20} color="white" />
        </div>
        {collapsed && (
          <div>
            <p
              className="font-bold text-sm leading-4 tracking-wide"
              style={{ color: "white" }}
            >
              StudyAI
            </p>
            <p
              className="text-[10px] tracking-widest mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              PLANNER
            </p>
          </div>
        )}
      </div>



  {/* Glow Ring */}
  <div className="
    absolute w-[50%] h-[50%]
    rounded-full
    bg-gradient-to-r from-pink-500 via-fuchsia-500 to-indigo-500
    blur-3xl opacity-40
    animate-pulse
  " />
  
  {/* Character */}
  <img
    src={saly}
    alt="AI Character"
    className="
      relative z-10
      w-100 h-full object-contain
      animate-panel
      drop-shadow-[0_20px_40px_rgba(168,85,247,0.35)]
    "
  />
</div>
          {/* Right Panel */}
          <div className="panel-right">
            
            <div className="shimmer-top mb-8" style={{ marginTop: "-8px" }} />

            {/* Header */}
            <div className="mb-6">
              
              <h1
                className="text-2xl font-bold text-white mb-1"
                style={{ letterSpacing: "-0.5px" }}
              >
                {tab === "signup" ? "Create an account" : "Welcome back"}
              </h1>
              <p className="text-sm" style={{ color: "rgba(167,139,250,0.7)" }}>
                {tab === "signup" ? (
                  <>
                    Already have an account?{" "}
                    <button
                      onClick={() => switchTab("signin")}
                      className="underline font-semibold transition-colors"
                      style={{
                        color: "#a78bfa",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Log in
                    </button>
                  </>
                ) : (
                  <>
                    Don't have an account?{" "}
                    <button
                      onClick={() => switchTab("signup")}
                      className="underline font-semibold transition-colors"
                      style={{
                        color: "#a78bfa",
                        background: "none",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Sign up
                    </button>
                  </>
                )}
              </p>
            </div>

            {/* Tabs */}
            <div className="tab-wrap w-max mb-8 flex items-center justify-center">
              <button
                className={`tab-btn ${tab === "signup" ? "tab-active" : "tab-inactive"}`}
                onClick={() => switchTab("signup")}
              >
                Sign Up
              </button>
              <button
                className={`tab-btn ${tab === "signin" ? "tab-active" : "tab-inactive"}`}
                onClick={() => switchTab("signin")}
              >
                Log In
              </button>
            </div>

            {/* Sign Up Form */}
            {tab === "signup" && (
              <form
                onSubmit={handleSignUp}
                className="animate-form flex flex-col gap-4"
              >
                {/* Name row */}
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="First Name"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-300"
                      style={{
                        background: "rgba(109,40,217,0.08)",
                        border: "1px solid rgba(139,92,246,0.2)",
                        fontFamily: "'Space Grotesk',sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(167,139,250,0.6)";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(139,92,246,0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(139,92,246,0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Last Name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-300"
                      style={{
                        background: "rgba(109,40,217,0.08)",
                        border: "1px solid rgba(139,92,246,0.2)",
                        fontFamily: "'Space Grotesk',sans-serif",
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = "rgba(167,139,250,0.6)";
                        e.target.style.boxShadow =
                          "0 0 0 3px rgba(139,92,246,0.12)";
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = "rgba(139,92,246,0.2)";
                        e.target.style.boxShadow = "none";
                      }}
                    />
                  </div>
                </div>

                {/* Email */}
                <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-300"
                  style={{
                    background: "rgba(109,40,217,0.08)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(167,139,250,0.6)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(139,92,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />

                {/* Password */}
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-300"
                    style={{
                      background: "rgba(109,40,217,0.08)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      fontFamily: "'Space Grotesk',sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(167,139,250,0.6)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(139,92,246,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(139,92,246,0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{
                      color: "rgba(167,139,250,0.5)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                    }}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                {password && (
                  <div className="-mt-2">
                    <div className="flex gap-1 mb-1">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className="h-1 flex-1 rounded-full transition-all duration-300"
                          style={{
                            background:
                              i <= pwStrength
                                ? pwColor
                                : "rgba(109,40,217,0.15)",
                          }}
                        />
                      ))}
                    </div>
                    <p className="text-xs" style={{ color: pwColor }}>
                      {pwLabel} password
                    </p>
                  </div>
                )}

                {/* Terms checkbox */}
                <label className="checkbox-wrap select-none">
                  <div
                    className={`checkbox-box ${agreed ? "checked" : ""}`}
                    onClick={() => setAgreed(!agreed)}
                  >
                    {agreed && (
                      <svg
                        viewBox="0 0 12 10"
                        fill="none"
                        className="w-3 h-2.5"
                      >
                        <polyline
                          points="1,5 4.5,8.5 11,1.5"
                          stroke="white"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </div>
                  <span
                    className="text-sm"
                    style={{ color: "rgba(167,139,250,0.7)" }}
                  >
                    I agree to the{" "}
                    <span
                      className="underline font-semibold cursor-pointer"
                      style={{ color: "#a78bfa" }}
                    >
                      terms & conditions
                    </span>
                  </span>
                </label>

                <button type="submit" className="btn-main" disabled={loading}>
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                        Creating account...
                      </>
                    ) : (
                      "Create account"
                    )}
                  </span>
                </button>

                <div className="divider">
                  <span>Or register with</span>
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn-social"
                    onClick={handleGoogle}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <GoogleSVG />
                    )}
                    Google
                  </button>
                </div>
              </form>
            )}

            {/* Sign In Form */}
            {tab === "signin" && (
              <form
                onSubmit={handleSignIn}
                className="animate-form flex flex-col gap-4"
              >
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl px-4 py-3 text-sm text-white outline-none transition-all duration-300"
                  style={{
                    background: "rgba(109,40,217,0.08)",
                    border: "1px solid rgba(139,92,246,0.2)",
                    fontFamily: "'Space Grotesk',sans-serif",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "rgba(167,139,250,0.6)";
                    e.target.style.boxShadow =
                      "0 0 0 3px rgba(139,92,246,0.12)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "rgba(139,92,246,0.2)";
                    e.target.style.boxShadow = "none";
                  }}
                />
                <div className="relative">
                  <input
                    type={showPw ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl px-4 py-3 pr-12 text-sm text-white outline-none transition-all duration-300"
                    style={{
                      background: "rgba(109,40,217,0.08)",
                      border: "1px solid rgba(139,92,246,0.2)",
                      fontFamily: "'Space Grotesk',sans-serif",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "rgba(167,139,250,0.6)";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(139,92,246,0.12)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "rgba(139,92,246,0.2)";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPw(!showPw)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{
                      color: "rgba(167,139,250,0.5)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      display: "flex",
                    }}
                  >
                    <EyeIcon open={showPw} />
                  </button>
                </div>
                <div className="flex justify-end -mt-1">
                  <button
                    type="button"
                    onClick={handleForgot}
                    style={{
                      color: "rgba(167,139,250,0.7)",
                      background: "none",
                      border: "none",
                      cursor: "pointer",
                      fontSize: "12px",
                      fontFamily: "'Outfit',sans-serif",
                    }}
                    className="hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>
                <button type="submit" className="btn-main" disabled={loading}>
                  <span className="flex items-center justify-center gap-2 relative z-10">
                    {loading ? (
                      <>
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{" "}
                        Signing in...
                      </>
                    ) : (
                      "Log in"
                    )}
                  </span>
                </button>
                <div className="divider">
                  <span>Or continue with</span>
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    className="btn-social"
                    onClick={handleGoogle}
                    disabled={googleLoading}
                  >
                    {googleLoading ? (
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <GoogleSVG />
                    )}
                    Google
                  </button>
                  
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
