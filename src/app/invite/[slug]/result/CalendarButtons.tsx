"use client";

import { useState } from "react";
import {
  generateGoogleCalendarUrl,
  generateOutlookUrl,
  createICSDownloadUrl,
} from "@/lib/calendar";

interface CalendarButtonsProps {
  eventDate: string;
  eventTime: string | null;
  eventTitle: string;
  recipientName: string | null;
  senderName: string | null;
}

export default function CalendarButtons({
  eventDate,
  eventTime,
  eventTitle,
  recipientName,
  senderName,
}: CalendarButtonsProps) {
  const [showOptions, setShowOptions] = useState(false);

  const event = {
    title: eventTitle || "Valentine's Date",
    date: eventDate,
    time: eventTime || undefined,
    description: `Valentine's date${recipientName ? ` with ${recipientName}` : ""}${senderName ? ` - invited by ${senderName}` : ""}`,
  };

  const handleDownloadICS = () => {
    const url = createICSDownloadUrl(event);
    const link = document.createElement("a");
    link.href = url;
    link.download = "valentines-date.ics";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setShowOptions(false);
  };

  const handleGoogleCalendar = () => {
    window.open(generateGoogleCalendarUrl(event), "_blank");
    setShowOptions(false);
  };

  const handleOutlook = () => {
    window.open(generateOutlookUrl(event), "_blank");
    setShowOptions(false);
  };

  const formattedDate = new Date(eventDate + "T12:00:00").toLocaleDateString(
    "en-US",
    {
      weekday: "long",
      month: "long",
      day: "numeric",
    },
  );

  const formattedTime = eventTime
    ? new Date(`2000-01-01T${eventTime}`).toLocaleTimeString("en-US", {
        hour: "numeric",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="border border-[#e5e5e5] rounded-lg p-4 mb-6">
      <p className="text-sm text-[#999] mb-1">the date</p>
      <p className="text-[#1a1a1a] font-medium">
        {formattedDate}
        {formattedTime && (
          <span className="text-[#666]"> at {formattedTime}</span>
        )}
      </p>

      <div className="mt-4 relative">
        <button
          onClick={() => setShowOptions(!showOptions)}
          className="w-full bg-[#1a1a1a] text-white py-3 rounded-lg font-medium hover:bg-[#333] transition-colors"
        >
          Add to calendar
        </button>

        {showOptions && (
          <div className="absolute bottom-full left-0 right-0 mb-2 bg-white border border-[#e5e5e5] rounded-lg shadow-lg overflow-hidden">
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
  );
}
