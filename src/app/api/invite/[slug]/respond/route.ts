import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendResponseEmail } from "@/lib/email";

interface RouteParams {
  params: Promise<{ slug: string }>;
}

export async function POST(request: NextRequest, { params }: RouteParams) {
  try {
    const { slug } = await params;
    const body = await request.json();
    const { response } = body;

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

    // Send email notification if sender provided an email
    if (invite.senderEmail) {
      const baseUrl =
        process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
      const resultUrl = `${baseUrl}/invite/${slug}/result`;

      await sendResponseEmail({
        to: invite.senderEmail,
        senderName: invite.senderName,
        recipientName: invite.recipientName,
        response: response as "yes" | "maybe" | "no",
        resultUrl,
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
