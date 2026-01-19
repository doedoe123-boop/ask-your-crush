import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ThemeKey } from "@/lib/themes";
import { formatMessage } from "@/lib/utils";
import InviteResponse from "./InviteResponse";
import Balloons from "@/components/Balloons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function InvitePage({ params }: PageProps) {
  const { slug } = await params;

  const invite = await prisma.valentineInvite.findUnique({
    where: { slug },
  });

  if (!invite) {
    notFound();
  }

  const formattedMessage = formatMessage(invite.message, invite.recipientName);

  // If already responded, show the result
  if (invite.response) {
    return (
      <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <p className="text-[#999] text-sm mb-2">already answered</p>
          <h1 className="text-2xl font-serif text-[#1a1a1a] mb-4">
            You said <span className="italic">{invite.response}</span>
          </h1>
          <p className="text-[#666]">
            Your response has been recorded. Thanks for being honest.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF8F0] flex items-center justify-center p-6 relative overflow-hidden">
      <Balloons />
      <div className="max-w-md w-full relative z-10">
        <div className="mb-8">
          <p className="text-[#999] text-sm mb-4">someone sent you this</p>
          <p className="text-xl text-[#1a1a1a] leading-relaxed whitespace-pre-wrap">
            {formattedMessage}
          </p>
          {invite.senderName && (
            <p className="text-[#999] mt-4">— {invite.senderName}</p>
          )}
        </div>

        <InviteResponse
          slug={slug}
          theme={invite.theme as ThemeKey}
          eventDate={invite.eventDate}
          eventTime={invite.eventTime}
          eventTitle={invite.eventTitle}
          senderName={invite.senderName}
          recipientName={invite.recipientName}
        />
      </div>
    </div>
  );
}
