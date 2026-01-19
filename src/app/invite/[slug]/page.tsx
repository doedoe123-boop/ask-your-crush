import { notFound } from "next/navigation";
import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { ThemeKey } from "@/lib/themes";
import { formatMessage } from "@/lib/utils";
import InviteResponse from "./InviteResponse";
import Balloons from "@/components/Balloons";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;

  const invite = await prisma.valentineInvite.findUnique({
    where: { slug },
  });

  if (!invite) {
    return {
      title: "Invite Not Found",
    };
  }

  const senderText = invite.senderName
    ? `${invite.senderName} sent you`
    : "Someone sent you";
  const recipientText = invite.recipientName
    ? `Hey ${invite.recipientName}!`
    : "Hey!";

  return {
    title: `${recipientText} You have a Valentine's message! 💕`,
    description: `${senderText} a Valentine's invite. Open to see their message and respond!`,
    openGraph: {
      title: `${recipientText} You have a Valentine's message! 💕`,
      description: `${senderText} a Valentine's invite. Will you say yes? 💘`,
      images: ["/ask-your-crush.png"],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${recipientText} You have a Valentine's message! 💕`,
      description: `${senderText} a Valentine's invite. Will you say yes? 💘`,
      images: ["/ask-your-crush.png"],
    },
  };
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
      <div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center p-6">
        <div className="max-w-md w-full">
          <p className="text-[#c49aa3] text-sm mb-2">already answered</p>
          <h1 className="text-2xl font-serif text-[#2d2d2d] mb-4">
            You said <span className="italic">{invite.response}</span>
          </h1>
          <p className="text-[#7a5a63]">
            Your response has been recorded. Thanks for being honest.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF0F3] flex items-center justify-center p-6 relative overflow-hidden">
      <Balloons />
      <div className="max-w-md w-full relative z-10">
        <div className="mb-8">
          <p className="text-[#c49aa3] text-sm mb-4">someone sent you this</p>
          <p className="text-xl text-[#2d2d2d] leading-relaxed whitespace-pre-wrap">
            {formattedMessage}
          </p>
          {invite.senderName && (
            <p className="text-[#c49aa3] mt-4">— {invite.senderName}</p>
          )}
        </div>

        <InviteResponse
          slug={slug}
          theme={invite.theme as ThemeKey}
          senderName={invite.senderName}
          eventDate={invite.eventDate}
          eventTime={invite.eventTime}
          eventTitle={invite.eventTitle}
        />
      </div>
    </div>
  );
}
