"use client";

export default function Balloons() {
  // Heart balloon colors - red, pink, white variations
  const colors = [
    { fill: "#e53e5f", highlight: "#ff6b8a" }, // Red
    { fill: "#f472b6", highlight: "#fbcfe8" }, // Pink
    { fill: "#ffffff", highlight: "#fff" }, // White
    { fill: "#fb7185", highlight: "#fecdd3" }, // Rose
  ];

  // Fewer balloons, positioned at edges to not distract from content
  const balloons = [
    { id: 0, left: "3%", size: 48, delay: 0, duration: 25 },
    { id: 1, left: "8%", size: 42, delay: 8, duration: 28 },
    { id: 2, left: "12%", size: 36, delay: 4, duration: 22 },
    { id: 3, left: "88%", size: 45, delay: 2, duration: 26 },
    { id: 4, left: "92%", size: 40, delay: 10, duration: 24 },
    { id: 5, left: "96%", size: 34, delay: 6, duration: 30 },
    { id: 6, left: "5%", size: 30, delay: 14, duration: 27 },
    { id: 7, left: "94%", size: 38, delay: 12, duration: 23 },
  ].map((b, i) => ({ ...b, color: colors[i % colors.length] }));

  return (
    <>
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {balloons.map((balloon) => (
          <div
            key={balloon.id}
            className="absolute"
            style={{
              left: balloon.left,
              bottom: "-150px",
              animation: `float-up ${balloon.duration}s ease-in-out infinite`,
              animationDelay: `${balloon.delay}s`,
            }}
          >
            <svg
              width={balloon.size}
              height={balloon.size * 1.8}
              viewBox="0 0 40 72"
              fill="none"
              style={{
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.08))",
                opacity: 0.4,
              }}
            >
              {/* Heart shape */}
              <path
                d="M20 36 C20 36 4 24 4 14 C4 6 10 2 16 2 C19 2 20 4 20 4 C20 4 21 2 24 2 C30 2 36 6 36 14 C36 24 20 36 20 36Z"
                fill={balloon.color.fill}
              />
              {/* Highlight */}
              <ellipse
                cx="12"
                cy="12"
                rx="4"
                ry="5"
                fill={balloon.color.highlight}
                opacity="0.5"
              />
              {/* String */}
              <path
                d="M20 36 Q18 45 22 52 Q18 58 20 70"
                stroke={balloon.color.fill}
                strokeWidth="1"
                fill="none"
                opacity="0.5"
              />
            </svg>
          </div>
        ))}
      </div>

      <style>
        {`
          @keyframes float-up {
            0% {
              transform: translateY(0) rotate(-2deg);
              opacity: 0;
            }
            5% {
              opacity: 0.4;
            }
            50% {
              transform: translateY(-55vh) rotate(2deg);
            }
            95% {
              opacity: 0.4;
            }
            100% {
              transform: translateY(-110vh) rotate(-2deg);
              opacity: 0;
            }
          }
        `}
      </style>
    </>
  );
}
