"use client";

import { useState } from "react";
import { themes, ThemeKey, templateMessages } from "@/lib/themes";
import Link from "next/link";
import Balloons from "@/components/Balloons";

export default function CreatePage() {
  const [message, setMessage] = useState<string>(templateMessages.romantic);
  const [theme, setTheme] = useState<ThemeKey>("romantic");
  const [senderName, setSenderName] = useState("");
  const [senderEmail, setSenderEmail] = useState("");
  const [recipientName, setRecipientName] = useState("");
  const [eventDate, setEventDate] = useState("2026-02-14");
  const [eventTime, setEventTime] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [createdInvite, setCreatedInvite] = useState<{
    inviteUrl: string;
    resultUrl: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);

  const handleTemplateSelect = (templateTheme: ThemeKey) => {
    setTheme(templateTheme);
    setMessage(templateMessages[templateTheme]);
  };

  const getPreviewMessage = () => {
    if (!recipientName) {
      return message.replace(/\{\{name\}\}/g, "");
    }
    return message.replace(/\{\{name\}\}/g, recipientName);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await fetch("/api/invites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message,
          theme,
          senderName: senderName || null,
          senderEmail: senderEmail || null,
          recipientName: recipientName || null,
          eventDate: eventDate || null,
          eventTime: eventTime || null,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to create invite");
      }

      setCreatedInvite({
        inviteUrl: `${window.location.origin}${data.inviteUrl}`,
        resultUrl: `${window.location.origin}${data.resultUrl}`,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = async (text: string, type: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  if (createdInvite) {
    return (
      <div className="min-h-screen bg-[#FFF0F3] px-6 py-12 relative overflow-hidden">
        <Balloons />
        <div className="max-w-md mx-auto relative z-10">
          <div className="mb-8">
            <p className="text-[#b07d8a] text-sm mb-1">done!</p>
            <h1 className="text-2xl font-serif text-[#2d2d2d]">
              Your link is ready
            </h1>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs uppercase tracking-wider text-[#c49aa3] mb-2">
                Send this to them
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  readOnly
                  value={createdInvite.inviteUrl}
                  className="flex-1 bg-white border border-[#f5d0d8] rounded-lg px-3 py-2.5 text-sm text-[#2d2d2d] font-mono"
                />
                <button
                  onClick={() =>
                    copyToClipboard(createdInvite.inviteUrl, "invite")
                  }
                  className="bg-[#e53e5f] text-white px-4 py-2.5 rounded-lg text-sm hover:bg-[#d63555] transition-colors"
                >
                  {copied === "invite" ? "Copied" : "Copy"}
                </button>
              </div>
            </div>
            <div className="flex gap-3 pt-4">
              <a
                href={createdInvite.inviteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 text-center border border-[#e53e5f] text-[#e53e5f] px-4 py-3 rounded-lg hover:bg-[#e53e5f] hover:text-white transition-colors"
              >
                Preview it
              </a>
              <button
                onClick={() => {
                  setCreatedInvite(null);
                  setMessage(templateMessages.romantic);
                  setTheme("romantic");
                  setSenderName("");
                  setSenderEmail("");
                  setRecipientName("");
                  setEventDate("");
                  setEventTime("");
                }}
                className="flex-1 text-[#c49aa3] px-4 py-3 rounded-lg hover:text-[#b07d8a] transition-colors"
              >
                Make another
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0F3] px-6 py-12 relative overflow-hidden">
      <Balloons />
      <div className="max-w-xl mx-auto relative z-10">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/"
            className="text-[#c49aa3] text-sm hover:text-[#b07d8a] transition-colors"
          >
            ← back
          </Link>
          <h1 className="text-2xl font-serif text-[#2d2d2d] mt-4">
            Write your message
          </h1>
          <p className="text-[#7a5a63] mt-1">
            Pick a vibe and say what you want to say.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Vibe Selection */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c49aa3] mb-3">
              Pick a vibe
            </label>
            <div className="flex gap-2">
              {(Object.keys(themes) as ThemeKey[]).map((themeKey) => (
                <button
                  key={themeKey}
                  type="button"
                  onClick={() => handleTemplateSelect(themeKey)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm transition-all ${
                    theme === themeKey
                      ? "bg-[#e53e5f] text-white"
                      : "bg-white border border-[#f5d0d8] text-[#7a5a63] hover:border-[#f9a8d4]"
                  }`}
                >
                  {themes[themeKey].name}
                </button>
              ))}
            </div>
          </div>

          {/* Their Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c49aa3] mb-2">
              Their name{" "}
              <span className="normal-case text-[#ddb8c0]">(optional)</span>
            </label>
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="leave blank to keep it anonymous"
              maxLength={50}
              className="w-full px-4 py-3 rounded-lg border border-[#f5d0d8] bg-white text-[#2d2d2d] placeholder-[#ddb8c0] focus:outline-none focus:border-[#f9a8d4] transition-colors"
            />
          </div>

          {/* Message */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c49aa3] mb-2">
              Your message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              maxLength={500}
              className="w-full px-4 py-3 rounded-lg border border-[#f5d0d8] bg-white text-[#2d2d2d] placeholder-[#ddb8c0] focus:outline-none focus:border-[#f9a8d4] transition-colors resize-none leading-relaxed"
            />
            <div className="text-right text-xs text-[#ddb8c0] mt-1">
              {message.length}/500
            </div>
          </div>

          {/* Your Name */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c49aa3] mb-2">
              Sign it as{" "}
              <span className="normal-case text-[#ddb8c0]">(optional)</span>
            </label>
            <input
              type="text"
              value={senderName}
              onChange={(e) => setSenderName(e.target.value)}
              placeholder="your name, a nickname, or leave blank"
              maxLength={50}
              className="w-full px-4 py-3 rounded-lg border border-[#f5d0d8] bg-white text-[#2d2d2d] placeholder-[#ddb8c0] focus:outline-none focus:border-[#f9a8d4] transition-colors"
            />
          </div>

          {/* Email for notification */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c49aa3] mb-2">
              Your email{" "}
              <span className="normal-case text-[#ddb8c0]">
                (to get notified)
              </span>
            </label>
            <input
              type="email"
              value={senderEmail}
              onChange={(e) => setSenderEmail(e.target.value)}
              placeholder="we'll email you when they respond"
              className="w-full px-4 py-3 rounded-lg border border-[#f5d0d8] bg-white text-[#2d2d2d] placeholder-[#ddb8c0] focus:outline-none focus:border-[#f9a8d4] transition-colors"
            />
          </div>

          {/* Proposed Date */}
          <div>
            <label className="block text-xs uppercase tracking-wider text-[#c49aa3] mb-2">
              Propose a date{" "}
              <span className="normal-case text-[#ddb8c0]">(optional)</span>
            </label>
            <div className="flex gap-3">
              <input
                type="date"
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="flex-1 px-4 py-3 rounded-lg border border-[#f5d0d8] bg-white text-[#2d2d2d] focus:outline-none focus:border-[#f9a8d4] transition-colors"
              />
              <input
                type="time"
                value={eventTime}
                onChange={(e) => setEventTime(e.target.value)}
                placeholder="Time"
                className="w-32 px-4 py-3 rounded-lg border border-[#f5d0d8] bg-white text-[#2d2d2d] focus:outline-none focus:border-[#f9a8d4] transition-colors"
              />
            </div>
            <p className="text-xs text-[#ddb8c0] mt-2">
              If they say yes, they can add it to their calendar
            </p>
          </div>

          {/* Preview */}
          <div className="border-t border-[#f5d0d8] pt-8">
            <label className="block text-xs uppercase tracking-wider text-[#c49aa3] mb-3">
              Preview
            </label>
            <div className="bg-white border border-[#f5d0d8] rounded-xl p-6">
              <p className="text-[#2d2d2d] leading-relaxed whitespace-pre-wrap">
                {getPreviewMessage() || "Your message will show here..."}
              </p>
              {senderName && (
                <p className="text-[#c49aa3] mt-4 text-sm">— {senderName}</p>
              )}
              <div className="flex gap-2 mt-6 pt-4 border-t border-[#fce7f3]">
                <span className="text-xs text-[#ddb8c0]">
                  They&apos;ll see:
                </span>
                <span className="text-xs text-[#2d2d2d] font-medium">Yes</span>
                <span className="text-xs text-[#2d2d2d] font-medium">
                  Maybe
                </span>
                <span className="text-xs text-[#2d2d2d] font-medium">No</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading || !message.trim()}
            className="w-full bg-[#e53e5f] text-white py-4 rounded-lg font-medium transition-all hover:bg-[#d63555] disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {isLoading ? "Creating..." : "Get my link"}
          </button>
        </form>
      </div>
    </div>
  );
}
