import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResponseEmail, sendRecipientConfirmationEmail } from "@/lib/email";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { response, recipientEmail } = body;

    // Validate response
    const validResponses = ["yes", "maybe", "no"];
    if (!response || !validResponses.includes(response)) {
      return NextResponse.json(
        { error: "Invalid response. Must be 'yes', 'maybe', or 'no'" },
        { status: 400 },
      );
    }

    // Find the invite
    const invite = await prisma.valentineInvite.findUnique({
      where: { slug },
    });

    if (!invite) {
      return NextResponse.json({ error: "Invite not found" }, { status: 404 });
    }

    // Check if already responded
    if (invite.response) {
      return NextResponse.json(
        { error: "This invite has already been responded to" },
        { status: 400 },
      );
    }

    // Update the invite with the response
    const updatedInvite = await prisma.valentineInvite.update({
      where: { slug },
      data: {
        response,
        respondedAt: new Date(),
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    const resultUrl = `${baseUrl}/invite/${slug}/result`;

    // Send email notification to sender if they provided an email
    if (invite.senderEmail) {
      await sendResponseEmail({
        to: invite.senderEmail,
        senderName: invite.senderName,
        recipientName: invite.recipientName,
        response: response as "yes" | "maybe" | "no",
        resultUrl,
        eventDate: invite.eventDate,
        eventTime: invite.eventTime,
        eventTitle: invite.eventTitle,
        recipientEmail: recipientEmail || undefined, // Include crush's email so sender can invite them
      });
    }

    // Send simple confirmation email to recipient (sender will create the calendar invite)
    if (recipientEmail && response === "yes") {
      await sendRecipientConfirmationEmail({
        to: recipientEmail,
        senderName: invite.senderName ?? "Someone special",
        recipientName: invite.recipientName ?? "Valentine",
        eventDate: invite.eventDate ?? undefined,
        eventTime: invite.eventTime ?? undefined,
      });
    }

    return NextResponse.json({
      success: true,
      response: updatedInvite.response,
    });
  } catch (error) {
    console.error("Error responding to invite:", error);
    return NextResponse.json(
      { error: "Failed to submit response" },
      { status: 500 },
    );
  }
}
