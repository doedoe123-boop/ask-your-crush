import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import CalendarButtons from "./CalendarButtons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function ResultPage({ params }: PageProps) {
  const { slug } = await params;

  const invite = await prisma.valentineInvite.findUnique({
    where: { slug },
  });

  if (!invite) {
    notFound();
  }

  const getResponseTitle = () => {
    switch (invite.response) {
      case "yes":
        return "They said yes";
      case "maybe":
        return "They said maybe";
      case "no":
        return "They said no";
      default:
        return "Waiting for a response";
    }
  };

  const getResponseDescription = () => {
    switch (invite.response) {
      case "yes":
        return "Time to make some plans.";
      case "maybe":
        return "Give them a moment. Could go either way.";
      case "no":
        return "At least you know. Respect for putting yourself out there.";
      default:
        return "Send them the link and check back here for their answer.";
    }
  };

  return (
    <div className="min-h-screen bg-[#FFF0F3]">
      <div className="max-w-md mx-auto px-6 py-16">
        <Link
          href="/"
          className="text-[#c49aa3] text-sm hover:text-[#b07d8a] transition-colors"
        >
          ← back home
        </Link>

        <div className="mt-12">
          <p className="text-[#c49aa3] text-sm mb-2">
            invite to {invite.recipientName || "someone special"}
          </p>

          <h1 className="text-3xl font-serif text-[#2d2d2d] mb-4">
            {getResponseTitle()}
          </h1>

          <p className="text-[#7a5a63] mb-8">{getResponseDescription()}</p>

          {/* Calendar buttons - show when response is yes and there's a date */}
          {invite.response === "yes" && invite.eventDate && (
            <CalendarButtons
              eventDate={invite.eventDate}
              eventTime={invite.eventTime}
              eventTitle={invite.eventTitle || "Valentine's Date"}
              recipientName={invite.recipientName}
              senderName={invite.senderName}
            />
          )}

          {invite.response && invite.respondedAt && (
            <div className="border-t border-[#f5d0d8] py-6 mb-6">
              <p className="text-sm text-[#c49aa3]">
                Answered on{" "}
                {new Date(invite.respondedAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </div>
          )}

          {!invite.response && (
            <div className="border border-[#f5d0d8] rounded-lg p-4 mb-8">
              <p className="text-sm text-[#c49aa3] mb-2">share this link</p>
              <p className="text-[#2d2d2d] text-sm break-all font-mono">
                {process.env.NEXT_PUBLIC_APP_URL ||
                  window?.location?.origin ||
                  ""}
                /invite/{slug}
              </p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Link
              href="/create"
              className="flex-1 bg-[#e53e5f] text-white py-3 rounded-lg font-medium text-center hover:bg-[#d63555] transition-colors"
            >
              Create another
            </Link>
            <Link
              href="/"
              className="flex-1 border border-[#f5d0d8] text-[#2d2d2d] py-3 rounded-lg font-medium text-center hover:bg-white/50 transition-colors"
            >
              Home
            </Link>
          </div>

          {!invite.response && (
            <p className="text-sm text-[#c49aa3] mt-8 text-center">
              Bookmark this page to check back later.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
