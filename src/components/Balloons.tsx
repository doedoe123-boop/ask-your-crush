"use client";

export default function Balloons() {
  return (
    <>
      {/* Left balloons */}
      <div
        className="fixed bottom-0 left-4 pointer-events-none opacity-30"
        style={{ animation: "float-slow 5s ease-in-out infinite" }}
      >
        <svg width="80" height="220" viewBox="0 0 80 220" fill="none">
          {/* Balloon 1 - soft pink */}
          <ellipse cx="40" cy="50" rx="30" ry="42" fill="#f5d0d0" />
          <ellipse cx="40" cy="50" rx="30" ry="42" fill="url(#gradient1)" />
          <path
            d="M40 92 L40 96 Q37 105 43 115 Q38 125 40 140"
            stroke="#e0b0b0"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Balloon 2 - warm beige */}
          <ellipse cx="22" cy="75" rx="20" ry="28" fill="#f0e0d6" />
          <path
            d="M22 103 L22 107 Q19 115 24 122 Q20 130 22 145"
            stroke="#d4c4b8"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <radialGradient id="gradient1" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f5d0d0" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Right balloons */}
      <div
        className="fixed bottom-0 right-4 pointer-events-none opacity-30"
        style={{ animation: "float-slow 6s ease-in-out infinite 1s" }}
      >
        <svg width="80" height="220" viewBox="0 0 80 220" fill="none">
          {/* Balloon 1 - peachy */}
          <ellipse cx="35" cy="55" rx="26" ry="38" fill="#f8e0d8" />
          <ellipse cx="35" cy="55" rx="26" ry="38" fill="url(#gradient2)" />
          <path
            d="M35 93 L35 97 Q38 106 33 115 Q37 124 35 142"
            stroke="#e0c8c0"
            strokeWidth="1.5"
            fill="none"
          />
          {/* Balloon 2 - soft rose */}
          <ellipse cx="58" cy="70" rx="18" ry="26" fill="#f2d4d4" />
          <path
            d="M58 96 L58 100 Q55 108 60 115 Q57 122 58 138"
            stroke="#dbb8b8"
            strokeWidth="1.5"
            fill="none"
          />
          <defs>
            <radialGradient id="gradient2" cx="30%" cy="30%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#f8e0d8" stopOpacity="0" />
            </radialGradient>
          </defs>
        </svg>
      </div>

      {/* Global styles for animation */}
      <style>
        {`
          @keyframes float-slow {
            0%, 100% {
              transform: translateY(0) rotate(-1deg);
            }
            50% {
              transform: translateY(-15px) rotate(1deg);
            }
          }
        `}
      </style>
    </>
  );
}
