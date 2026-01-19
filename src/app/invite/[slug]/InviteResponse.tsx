"use client";

import { useState } from "react";
import { ThemeKey } from "@/lib/themes";
import confetti from "canvas-confetti";
import {
  generateGoogleCalendarUrl,
  generateOutlookUrl,
  createICSDownloadUrl,
} from "@/lib/calendar";

interface InviteResponseProps {
  slug: string;
  theme: ThemeKey;
  eventDate?: string | null;
  eventTime?: string | null;
  eventTitle?: string | null;
  senderName?: string | null;
  recipientName?: string | null;
}

export default function InviteResponse({
  slug,
  eventDate,
  eventTime,
  eventTitle,
  senderName,
  recipientName,
}: InviteResponseProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [responded, setResponded] = useState(false);
  const [response, setResponse] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [showCalendarOptions, setShowCalendarOptions] = useState(false);
  const [wantsCalendar, setWantsCalendar] = useState<boolean | null>(null);

  const triggerConfetti = () => {
    const duration = 2500;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 2,
        angle: 60,
        spread: 45,
        origin: { x: 0, y: 0.7 },
        colors: ["#1a1a1a", "#666", "#999", "#ccc"],
      });
      confetti({
        particleCount: 2,
        angle: 120,
        spread: 45,
        origin: { x: 1, y: 0.7 },
        colors: ["#1a1a1a", "#666", "#999", "#ccc"],
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };

    frame();
  };

  const handleResponse = async (responseType: "yes" | "maybe" | "no") => {
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/invite/${slug}/respond`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ response: responseType }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to submit response");
      }

      setResponse(responseType);
      setResponded(true);

      if (responseType === "yes") {
        triggerConfetti();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const event = eventDate
    ? {
        title: eventTitle || "Valentine's Date",
        date: eventDate,
        time: eventTime || undefined,
        description: `Valentine's date${senderName ? ` with ${senderName}` : ""}`,
      }
    : null;

  const handleDownloadICS = () => {
    if (!event) return;
    const url = createICSDownloadUrl(event);
    const link = document.createElement("a");
    link.href = url;
    link.download = "valentines-date.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowCalendarOptions(false);
  };

  const handleGoogleCalendar = () => {
    if (!event) return;
    window.open(generateGoogleCalendarUrl(event), "_blank");
    setShowCalendarOptions(false);
  };

  const handleOutlook = () => {
    if (!event) return;
    window.open(generateOutlookUrl(event), "_blank");
    setShowCalendarOptions(false);
  };

  if (responded) {
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

    return (
      <div className="border-t border-[#e5e5e5] pt-8">
        <p className="text-[#999] text-sm mb-2">you said</p>
        <h2 className="text-2xl font-serif text-[#1a1a1a] mb-4">
          {response === "yes" ? "Yes" : response === "maybe" ? "Maybe" : "No"}
        </h2>
        <p className="text-[#666]">
          {response === "yes"
            ? "Nice. They'll be happy to hear that."
            : response === "maybe"
              ? "Fair enough. Take your time."
              : "Respect. Thanks for being upfront."}
        </p>

        {/* Calendar options for "yes" response with a date */}
        {response === "yes" && event && wantsCalendar === null && (
          <div className="mt-6 border border-[#e5e5e5] rounded-lg p-4">
            <p className="text-sm text-[#999] mb-1">they suggested</p>
            <p className="text-[#1a1a1a] font-medium mb-4">
              {formattedDate}
              {formattedTime && (
                <span className="text-[#666]"> at {formattedTime}</span>
              )}
            </p>
            <p className="text-[#666] text-sm mb-4">
              Want to save this date to your calendar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setWantsCalendar(true)}
                className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-lg font-medium hover:bg-[#333] transition-colors"
              >
                Yes, add it
              </button>
              <button
                onClick={() => setWantsCalendar(false)}
                className="flex-1 border border-[#e5e5e5] text-[#666] py-3 rounded-lg font-medium hover:bg-[#f5f5f5] transition-colors"
              >
                No thanks
              </button>
            </div>
          </div>
        )}

        {/* Show calendar options after they agreed */}
        {response === "yes" && event && wantsCalendar === true && (
          <div className="mt-6 border border-[#e5e5e5] rounded-lg p-4">
            <p className="text-sm text-[#999] mb-1">the date</p>
            <p className="text-[#1a1a1a] font-medium mb-4">
              {formattedDate}
              {formattedTime && (
                <span className="text-[#666]"> at {formattedTime}</span>
              )}
            </p>

            <div className="relative">
              <button
                onClick={() => setShowCalendarOptions(!showCalendarOptions)}
                className="w-full bg-[#1a1a1a] text-white py-3 rounded-lg font-medium hover:bg-[#333] transition-colors"
              >
                Choose your calendar
              </button>

              {showCalendarOptions && (
                <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#e5e5e5] rounded-lg shadow-lg overflow-hidden z-10">
                  <button
                    onClick={handleGoogleCalendar}
                    className="w-full px-4 py-3 text-left text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors border-b border-[#e5e5e5]"
                  >
                    Google Calendar
                  </button>
                  <button
                    onClick={handleOutlook}
                    className="w-full px-4 py-3 text-left text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors border-b border-[#e5e5e5]"
                  >
                    Outlook
                  </button>
                  <button
                    onClick={handleDownloadICS}
                    className="w-full px-4 py-3 text-left text-[#1a1a1a] hover:bg-[#f5f5f5] transition-colors"
                  >
                    Download .ics (Apple, others)
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Dismissed calendar */}
        {response === "yes" && event && wantsCalendar === false && (
          <button
            onClick={() => setWantsCalendar(true)}
            className="mt-4 text-sm text-[#999] hover:text-[#666] transition-colors"
          >
            Changed your mind? Add to calendar →
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="border-t border-[#e5e5e5] pt-8">
      <p className="text-[#999] text-sm mb-4">what&apos;s your answer?</p>

      {error && (
        <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm mb-4">
          {error}
        </div>
      )}

      <div className="flex gap-3">
        <button
          onClick={() => handleResponse("yes")}
          disabled={isLoading}
          className="flex-1 bg-[#1a1a1a] text-white py-3 rounded-lg font-medium hover:bg-[#333] transition-colors disabled:opacity-40"
        >
          Yes
        </button>
        <button
          onClick={() => handleResponse("maybe")}
          disabled={isLoading}
          className="flex-1 border border-[#e5e5e5] text-[#1a1a1a] py-3 rounded-lg font-medium hover:bg-[#f5f5f5] transition-colors disabled:opacity-40"
        >
          Maybe
        </button>
        <button
          onClick={() => handleResponse("no")}
          disabled={isLoading}
          className="flex-1 border border-[#e5e5e5] text-[#999] py-3 rounded-lg font-medium hover:bg-[#f5f5f5] transition-colors disabled:opacity-40"
        >
          No
        </button>
      </div>
    </div>
  );
}
