import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 180,
  height: 180,
};

export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #FFF0F3 0%, #FFE4E9 100%)",
        borderRadius: "22%",
      }}
    >
      <svg viewBox="0 0 100 100" width="140" height="140">
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f472b6" />
            <stop offset="100%" stopColor="#e53e5f" />
          </linearGradient>
        </defs>
        <path
          fill="url(#heartGrad)"
          d="M50 88.9L43.4 82.9C21.2 62.7 7 49.6 7 33.5C7 20.4 17.4 10 30.5 10C37.9 10 45 13.4 50 18.9C55 13.4 62.1 10 69.5 10C82.6 10 93 20.4 93 33.5C93 49.6 78.8 62.7 56.6 82.9L50 88.9Z"
        />
      </svg>
    </div>,
    {
      ...size,
    },
  );
}
