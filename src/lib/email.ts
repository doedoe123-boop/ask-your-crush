import nodemailer from "nodemailer";
import { generateGoogleCalendarUrl } from "@/lib/calendar";

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "465"),
  secure: true, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

interface SendResponseEmailParams {
  to: string;
  senderName: string | null;
  recipientName: string | null;
  response: "yes" | "maybe" | "no";
  resultUrl: string;
  eventDate?: string | null;
  eventTime?: string | null;
  eventTitle?: string | null;
  recipientEmail?: string; // Crush's email so sender can invite them to calendar
}

// Escape HTML to prevent XSS in email templates
function escapeHtml(text: string): string {
  const htmlEscapes: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#x27;",
  };
  return text.replace(/[&<>"']/g, (char) => htmlEscapes[char]);
}

function buildEmailHtml(
  heading: string,
  subheading: string,
  bodyText: string,
  responseText: string,
  resultUrl: string,
  senderName: string | null,
  calendarSection?: string,
): string {
  const safeSender = senderName ? escapeHtml(senderName) : null;
  const safeUrl = escapeHtml(resultUrl);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FFF0F3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
    <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(229, 62, 95, 0.1);">
      <div style="text-align: center; margin-bottom: 24px;">
        <span style="font-size: 48px;">💌</span>
      </div>
      
      <p style="color: #c49aa3; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0; text-align: center;">${escapeHtml(subheading)}</p>
      <h1 style="font-family: Georgia, serif; color: #2d2d2d; font-size: 24px; font-weight: normal; margin: 0 0 20px 0; text-align: center;">
        ${escapeHtml(heading)}
      </h1>
      
      <p style="color: #7a5a63; font-size: 15px; line-height: 1.6; margin: 0 0 28px 0; text-align: center;">
        ${escapeHtml(bodyText)}
      </p>
      
      <div style="background: #FFF0F3; border: 1px solid #f5d0d8; border-radius: 12px; padding: 20px; margin-bottom: 28px; text-align: center;">
        <p style="color: #c49aa3; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
          The response
        </p>
        <p style="color: #e53e5f; font-size: 28px; font-weight: 600; margin: 0;">${escapeHtml(responseText)}</p>
      </div>
      
      ${calendarSection || ""}
      
      <div style="text-align: center; padding-top: 24px; border-top: 1px solid #f5d0d8; margin-top: 28px;">
        <p style="color: #ddb8c0; font-size: 12px; margin: 0;">
          Sent with 💕 from Ask Your Crush${safeSender ? ` • Created by ${safeSender}` : ""}
        </p>
      </div>
    </div>
  </div>
</body>
</html>`;
}

const emailTemplates = {
  yes: {
    subject: "They said yes! 💕",
    getContent: (
      senderName: string | null,
      recipientName: string | null,
      resultUrl: string,
      eventDate?: string | null,
      eventTime?: string | null,
      eventTitle?: string | null,
      recipientEmail?: string,
    ) => {
      const name = recipientName || "They";

      // Build calendar section if there's a date
      let calendarSection = "";
      if (eventDate) {
        const event = {
          title: eventTitle || "Valentine's Date",
          date: eventDate,
          time: eventTime || undefined,
          description: `Valentine's date${recipientName ? ` with ${recipientName}` : ""}`,
        };

        const googleUrl = generateGoogleCalendarUrl(event);

        const formattedDate = new Date(
          eventDate + "T12:00:00",
        ).toLocaleDateString("en-US", {
          weekday: "long",
          month: "long",
          day: "numeric",
        });

        const formattedTime = eventTime
          ? new Date(`2000-01-01T${eventTime}`).toLocaleTimeString("en-US", {
              hour: "numeric",
              minute: "2-digit",
            })
          : null;

        // Show crush's email if they provided it
        const crushEmailNote = recipientEmail
          ? `<p style="color: #666; font-size: 14px; margin: 0 0 16px 0;">
              ${escapeHtml(name)}'s email: <strong>${escapeHtml(recipientEmail)}</strong><br/>
              <span style="color: #999; font-size: 12px;">Add them to your calendar invite!</span>
            </p>`
          : "";

        calendarSection = `
    <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
      <p style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
        Your date
      </p>
      <p style="color: #1a1a1a; font-size: 18px; margin: 0 0 16px 0;">
        ${escapeHtml(formattedDate)}${formattedTime ? ` at ${escapeHtml(formattedTime)}` : ""}
      </p>
      ${crushEmailNote}
      <p style="color: #666; font-size: 14px; margin: 0 0 16px 0;">
        Create a calendar invite and send it to your crush:
      </p>
      <div style="display: flex; gap: 8px; flex-wrap: wrap;">
        <a href="${escapeHtml(googleUrl)}" style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 10px 16px; border-radius: 6px; font-size: 13px;">
          Google Calendar
        </a>
      </div>
    </div>`;
      }

      return buildEmailHtml(
        `${name} said yes! 🎉`,
        "good news, pre!",
        "LETSGOOOO! Sana all may jowa this Valentine's! Time to make some plans, hindi na to drill!",
        "Yes! 💕",
        resultUrl,
        senderName,
        calendarSection,
      );
    },
  },
  maybe: {
    subject: "Ay... Maybe daw 🥺",
    getContent: (
      senderName: string | null,
      recipientName: string | null,
      resultUrl: string,
    ) => {
      const name = recipientName || "Sila";
      return buildEmailHtml(
        `${name} said maybe`,
        "50/50 pa tayo dito, pre",
        "Dude, baka need mo galingan yung message mo! Charot. Pero seryoso, baka may chance pa yan. Hintay ka lang or try mo ulit with more ✨rizz✨. Suggest ko mag-research ka ng corny jokes — minsan effective yun eh!",
        "Maybe 🤔",
        resultUrl,
        senderName,
      );
    },
  },
  no: {
    subject: "Bro... 💔",
    getContent: (
      senderName: string | null,
      recipientName: string | null,
      resultUrl: string,
    ) => {
      const name = recipientName || "Sila";
      return buildEmailHtml(
        `${name} said no`,
        "ay, masakit to pre",
        "Mukhang tagilid tayo ngayong Valentine's, bro. 😢 Pero alam mo, tara na lang mag-gym! Glow up szn na! Aray ko, pakak! Pero respect sa'yo for putting yourself out there — that takes guts! Next time, ikaw naman papagupit-an nila.",
        "No 😢",
        resultUrl,
        senderName,
      );
    },
  },
};

export async function sendResponseEmail({
  to,
  senderName,
  recipientName,
  response,
  resultUrl,
  eventDate,
  eventTime,
  eventTitle,
  recipientEmail,
}: SendResponseEmailParams): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("SMTP credentials not set, skipping email");
    return false;
  }

  const template = emailTemplates[response];

  try {
    await transporter.sendMail({
      from: {
        name: "Ask Your Crush",
        address: process.env.SMTP_FROM || process.env.SMTP_USER || "",
      },
      to: to,
      subject: template.subject,
      html: template.getContent(
        senderName,
        recipientName,
        resultUrl,
        eventDate,
        eventTime,
        eventTitle,
        recipientEmail,
      ),
    });
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

interface SendRecipientConfirmationParams {
  to: string;
  senderName: string;
  recipientName: string;
  eventDate?: string;
  eventTime?: string;
}

export async function sendRecipientConfirmationEmail({
  to,
  senderName,
  recipientName,
  eventDate,
  eventTime,
}: SendRecipientConfirmationParams): Promise<boolean> {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.log("SMTP credentials not set, skipping email");
    return false;
  }

  // Escape user-provided values
  const safeSenderName = escapeHtml(senderName);
  const safeRecipientName = escapeHtml(recipientName);

  // Format the date if provided
  let dateSection = "";
  if (eventDate) {
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

    dateSection = `
      <div style="background: #fff0f3; padding: 20px; border-radius: 12px; margin: 24px 0; text-align: center;">
        <p style="margin: 0 0 8px 0; color: #c49aa3; font-size: 12px; text-transform: uppercase; letter-spacing: 1px;">
          The Date
        </p>
        <p style="margin: 0; color: #2d2d2d; font-size: 18px; font-weight: 500;">
          ${escapeHtml(formattedDate)}${formattedTime ? ` at ${escapeHtml(formattedTime)}` : ""}
        </p>
        <p style="margin: 12px 0 0 0; color: #666; font-size: 14px;">
          ${safeSenderName} will send you a calendar invite soon! 📅
        </p>
      </div>
    `;
  }

  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 0; background-color: #fff0f3; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
      <div style="max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <div style="background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(229, 62, 95, 0.1);">
          <div style="text-align: center; margin-bottom: 24px;">
            <span style="font-size: 48px;">💕</span>
          </div>
          
          <h1 style="font-family: Georgia, serif; font-size: 24px; color: #e53e5f; text-align: center; margin: 0 0 16px 0;">
            It's a Date!
          </h1>
          
          <p style="color: #2d2d2d; font-size: 16px; line-height: 1.6; text-align: center; margin: 0 0 24px 0;">
            Hey ${safeRecipientName}! This email confirms that you said <strong style="color: #e53e5f;">yes</strong> to ${safeSenderName}'s valentine invite. 
          </p>
          
          <p style="color: #666; font-size: 15px; line-height: 1.6; text-align: center; margin: 0 0 24px 0;">
            We're so happy for you both! 🎉
          </p>

          ${dateSection}
          
          <div style="text-align: center; padding-top: 24px; border-top: 1px solid #f0f0f0; margin-top: 24px;">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Sent with love from Ask Your Crush 💌
            </p>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await transporter.sendMail({
      from: {
        name: "Ask Your Crush",
        address: process.env.SMTP_FROM || process.env.SMTP_USER || "",
      },
      to: to,
      subject: `💕 It's official! You said yes to ${safeSenderName}`,
      html: htmlContent,
    });
    console.log(`Recipient confirmation email sent to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending recipient confirmation email:", error);
    return false;
  }
}
