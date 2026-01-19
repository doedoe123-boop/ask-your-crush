import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { generateSlug } from "@/lib/utils";
import { themes, ThemeKey } from "@/lib/themes";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      message,
      theme,
      senderName,
      senderEmail,
      recipientName,
      eventDate,
      eventTime,
    } = body;

    // Validate required fields
    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    // Validate message length
    if (message.length > 500) {
      return NextResponse.json(
        { error: "Message must be 500 characters or less" },
        { status: 400 },
      );
    }

    // Validate theme
    const validThemes = Object.keys(themes);
    const selectedTheme: ThemeKey = validThemes.includes(theme)
      ? theme
      : "romantic";

    // Sanitize optional fields
    const sanitizedSenderName =
      senderName && typeof senderName === "string"
        ? senderName.trim().slice(0, 50)
        : null;
    const sanitizedSenderEmail =
      senderEmail &&
      typeof senderEmail === "string" &&
      senderEmail.includes("@")
        ? senderEmail.trim().slice(0, 100)
        : null;
    const sanitizedRecipientName =
      recipientName && typeof recipientName === "string"
        ? recipientName.trim().slice(0, 50)
        : null;

    // Sanitize event fields
    const sanitizedEventDate =
      eventDate &&
      typeof eventDate === "string" &&
      /^\d{4}-\d{2}-\d{2}$/.test(eventDate)
        ? eventDate
        : null;
    const sanitizedEventTime =
      eventTime &&
      typeof eventTime === "string" &&
      /^\d{2}:\d{2}$/.test(eventTime)
        ? eventTime
        : null;

    // Generate unique slug
    const slug = generateSlug();

    // Create the invite
    const invite = await prisma.valentineInvite.create({
      data: {
        slug,
        message: message.trim(),
        theme: selectedTheme,
        senderName: sanitizedSenderName,
        senderEmail: sanitizedSenderEmail,
        recipientName: sanitizedRecipientName,
        eventDate: sanitizedEventDate,
        eventTime: sanitizedEventTime,
        eventTitle: sanitizedRecipientName
          ? `Valentine's Date with ${sanitizedRecipientName}`
          : "Valentine's Date",
      },
    });

    return NextResponse.json({
      success: true,
      slug: invite.slug,
      inviteUrl: `/invite/${invite.slug}`,
      resultUrl: `/invite/${invite.slug}/result`,
    });
  } catch (error) {
    console.error("Error creating invite:", error);
    return NextResponse.json(
      { error: "Failed to create invite" },
      { status: 500 },
    );
  }
}
