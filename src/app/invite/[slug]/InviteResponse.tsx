"use client";

import { useState } from "react";
import { ThemeKey } from "@/lib/themes";
import confetti from "canvas-confetti";

interface InviteResponseProps {
  slug: string;
  theme: ThemeKey;
  senderName?: string | null;
  eventDate?: string | null;
  eventTime?: string | null;
  eventTitle?: string | null;
}

export default function InviteResponse({
  slug,
  senderName,
  eventDate,
  eventTime,
}: InviteResponseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState("");

  // For "yes" response - collect email for confirmation
  const [showEmailPrompt, setShowEmailPrompt] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");

  // For "no" response - confirm they really mean it
  const [showNoConfirm, setShowNoConfirm] = useState(false);

  const hasEvent = !!eventDate;

  const formattedDate = eventDate
    ? new Date(eventDate + "T12:00:00").toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
      })
    : null;

  const formattedTime = eventTime
    ? new Date(`2000-01-01T${eventTime}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  const triggerConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 45,
        origin: { x: 0, y: 0.7 },
        colors: ["#e53e5f", "#f472b6", "#fb7185", "#ffffff"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 45,
        origin: { x: 1, y: 0.7 },
        colors: ["#e53e5f", "#f472b6", "#fb7185", "#ffffff"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const submitResponse = async (
    responseType: "yes" | "maybe" | "no",
    email?: string,
  ) => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invite/${slug}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          response: responseType,
          recipientEmail: email || null,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit response");
      }

      setResponse(responseType);
      setResponded(true);
      setShowEmailPrompt(false);

      if (responseType === "yes") {
        triggerConfetti();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResponse = (responseType: "yes" | "maybe" | "no") => {
    // If "yes" and there's a date, show email prompt first
    if (responseType === "yes" && hasEvent) {
      setResponse("yes");
      setShowEmailPrompt(true);
      triggerConfetti();
    } else if (responseType === "no") {
      // Show confirmation for "no" - are they sure?
      setShowNoConfirm(true);
    } else {
      submitResponse(responseType);
    }
  };

  const handleConfirmNo = () => {
    setShowNoConfirm(false);
    submitResponse("no");
  };

  const handleCancelNo = () => {
    setShowNoConfirm(false);
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitResponse("yes", recipientEmail);
  };

  const handleSkipEmail = () => {
    submitResponse("yes");
  };

  // Show "No" confirmation - are they sure?
  if (showNoConfirm) {
    return (
      <div className="border-t border-[#f5d0d8] pt-8">
        <div className="text-center mb-6">
          <span className="text-6xl">🧸</span>
          <p className="text-4xl mt-2">👉👈</p>
        </div>
        <h2 className="text-xl font-serif text-[#2d2d2d] mb-3 text-center">
          Sure ka ba?
        </h2>
        <p className="text-[#7a5a63] text-center mb-6">
          Malulungkot ako... baka naman pwede pa?
        </p>

        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
            {error}
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={handleCancelNo}
            disabled={isLoading}
            className="flex-1 bg-[#e53e5f] text-white py-3 rounded-lg font-medium hover:bg-[#d63555] transition-colors disabled:opacity-40"
          >
            Sige na, Yes na! 💕
          </button>
          <button
            onClick={handleConfirmNo}
            disabled={isLoading}
            className="flex-1 border border-[#f5d0d8] text-[#7a5a63] py-3 rounded-lg font-medium hover:bg-white/50 transition-colors disabled:opacity-40"
          >
            {isLoading ? "..." : "Sorry, No talaga 😢"}
          </button>
        </div>
      </div>
    );
  }

  // Show email prompt for "yes" with date
  if (showEmailPrompt && response === "yes" && hasEvent) {
    return (
      <div className="border-t border-[#f5d0d8] pt-8">
        <div className="text-center mb-4">
          <span className="text-5xl">🎉</span>
        </div>
        <p className="text-[#c49aa3] text-sm mb-2 text-center">you said</p>
        <h2 className="text-2xl font-serif text-[#e53e5f] mb-4 text-center">
          Yes!
        </h2>
        <p className="text-[#7a5a63] mb-6 text-center">
          OMG! Sana all! {senderName ? `${senderName}` : "They"}&apos;ll be
          super kilig! 💕
        </p>

        <div className="bg-white/60 border border-[#f9a8d4] rounded-lg p-5">
          <p className="text-[#c49aa3] text-xs uppercase tracking-wider mb-2">
            {senderName ? `${senderName}'s invitation` : "The date"}
          </p>
          <p className="text-[#2d2d2d] font-medium text-lg mb-4">
            {formattedDate}
            {formattedTime && (
              <span className="text-[#7a5a63]"> at {formattedTime}</span>
            )}
          </p>

          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-[#7a5a63] text-sm mb-2">
                Your email
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                placeholder="we'll send you a confirmation"
                className="w-full px-4 py-3 rounded-lg border border-[#f5d0d8] bg-white text-[#2d2d2d] placeholder-[#ddb8c0] focus:outline-none focus:border-[#f9a8d4] transition-colors"
              />
            </div>

            {error && (
              <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-[#e53e5f] text-white py-3 rounded-lg font-medium hover:bg-[#d63555] transition-colors disabled:opacity-40"
              >
                {isLoading
                  ? "Sending..."
                  : recipientEmail
                    ? "Send me confirmation"
                    : "Done"}
              </button>
              {recipientEmail === "" && (
                <button
                  type="button"
                  onClick={handleSkipEmail}
                  disabled={isLoading}
                  className="flex-1 border border-[#f5d0d8] text-[#7a5a63] py-3 rounded-lg font-medium hover:bg-white/50 transition-colors disabled:opacity-40"
                >
                  Skip
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Show final response state
  if (responded) {
    return (
      <div className="border-t border-[#f5d0d8] pt-8">
        {response === "yes" && (
          <>
            <div className="text-center mb-4">
              <span className="text-5xl">💕</span>
            </div>
            <p className="text-[#c49aa3] text-sm mb-2 text-center">you said</p>
            <h2 className="text-2xl font-serif text-[#e53e5f] mb-4 text-center">
              Yes!
            </h2>
            <p className="text-[#7a5a63] text-center">
              Sana all may jowa this Valentine&apos;s! 🥰
            </p>
          </>
        )}

        {response === "maybe" && (
          <>
            <div className="text-center mb-4">
              <span className="text-5xl">🥺</span>
            </div>
            <p className="text-[#c49aa3] text-sm mb-2 text-center">you said</p>
            <h2 className="text-2xl font-serif text-[#2d2d2d] mb-4 text-center">
              Maybe
            </h2>
            <p className="text-[#7a5a63] text-center mb-4">
              Undecided ka pa ba? No worries!
            </p>
            <p className="text-[#c49aa3] text-sm text-center">
              Pwede mo pa to balikan mamaya ha... 👀
            </p>
          </>
        )}

        {response === "no" && (
          <>
            <div className="text-center mb-4">
              <span className="text-5xl">😢</span>
            </div>
            <p className="text-[#c49aa3] text-sm mb-2 text-center">you said</p>
            <h2 className="text-2xl font-serif text-[#2d2d2d] mb-4 text-center">
              No
            </h2>
            <p className="text-[#7a5a63] text-center">
              Ouch. Pero okay lang, salamat sa honesty! 🙏
            </p>
          </>
        )}

        {response === "yes" && hasEvent && (
          <div className="mt-6 bg-white/60 border border-[#f9a8d4] rounded-lg p-5">
            <p className="text-[#c49aa3] text-xs uppercase tracking-wider mb-2">
              {senderName ? `Your date with ${senderName}` : "The date"}
            </p>
            <p className="text-[#2d2d2d] font-medium text-lg">
              {formattedDate}
              {formattedTime && (
                <span className="text-[#7a5a63]"> at {formattedTime}</span>
              )}
            </p>
            {recipientEmail && (
              <p className="text-[#c49aa3] text-sm mt-2">
                ✓ Confirmation sent to {recipientEmail}
              </p>
            )}
          </div>
        )}
      </div>
    );
  }

  // Show initial response buttons
  return (
    <div className="border-t border-[#f5d0d8] pt-8">
      <p className="text-[#c49aa3] text-sm mb-4">what&apos;s your answer?</p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => handleResponse("yes")}
          disabled={isLoading}
          className="flex-1 bg-[#e53e5f] text-white py-3 rounded-lg font-medium hover:bg-[#d63555] transition-colors disabled:opacity-40"
        >
          Yes
        </button>
        <button
          onClick={() => handleResponse("maybe")}
          disabled={isLoading}
          className="flex-1 border border-[#f5d0d8] text-[#2d2d2d] py-3 rounded-lg font-medium hover:bg-white/50 transition-colors disabled:opacity-40"
        >
          Maybe
        </button>
        <button
          onClick={() => handleResponse("no")}
          disabled={isLoading}
          className="flex-1 border border-[#f5d0d8] text-[#c49aa3] py-3 rounded-lg font-medium hover:bg-white/50 transition-colors disabled:opacity-40"
        >
          No
        </button>
      </div>
    </div>
  );
}
