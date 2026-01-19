export const themes = {
  romantic: {
    name: "Romantic",
    emoji: "💖",
    gradient: "from-pink-500 via-rose-500 to-red-500",
    bgGradient: "from-pink-50 via-rose-50 to-red-50",
    darkBgGradient: "from-pink-950 via-rose-950 to-red-950",
    buttonBg: "bg-pink-500 hover:bg-pink-600",
    textColor: "text-pink-600",
    borderColor: "border-pink-200",
  },
  fun: {
    name: "Fun",
    emoji: "🎉",
    gradient: "from-purple-500 via-pink-500 to-orange-500",
    bgGradient: "from-purple-50 via-pink-50 to-orange-50",
    darkBgGradient: "from-purple-950 via-pink-950 to-orange-950",
    buttonBg: "bg-purple-500 hover:bg-purple-600",
    textColor: "text-purple-600",
    borderColor: "border-purple-200",
  },
  minimal: {
    name: "Minimal",
    emoji: "✨",
    gradient: "from-gray-700 via-gray-800 to-gray-900",
    bgGradient: "from-gray-50 via-white to-gray-50",
    darkBgGradient: "from-gray-900 via-gray-950 to-black",
    buttonBg: "bg-gray-800 hover:bg-gray-900",
    textColor: "text-gray-700",
    borderColor: "border-gray-200",
  },
} as const;

export type ThemeKey = keyof typeof themes;

export const templateMessages = {
  romantic: `Hey {{name}}, I've been meaning to ask… would you like to go on a date with me this Valentine's? 💖`,
  fun: `Roses are red, violets are blue, I made this page just to ask you out 👀`,
  minimal: `No pressure, just vibes—want to grab coffee this Valentine's?`,
} as const;
