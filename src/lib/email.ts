import Brevo from "@getbrevo/brevo";

const apiInstance = new Brevo.TransactionalEmailsApi();
apiInstance.setApiKey(
  Brevo.TransactionalEmailsApiApiKeys.apiKey,
  process.env.BREVO_API_KEY || "",
);

interface SendResponseEmailParams {
  to: string;
  senderName: string | null;
  recipientName: string | null;
  response: "yes" | "maybe" | "no";
  resultUrl: string;
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
): string {
  const safeSender = senderName ? escapeHtml(senderName) : null;
  const safeUrl = escapeHtml(resultUrl);

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #FFF8F0; font-family: Georgia, serif;">
  <div style="max-width: 480px; margin: 0 auto; padding: 48px 24px;">
    <p style="color: #999; font-size: 14px; margin: 0 0 8px 0;">${escapeHtml(subheading)}</p>
    <h1 style="color: #1a1a1a; font-size: 28px; font-weight: normal; margin: 0 0 24px 0;">
      ${escapeHtml(heading)}
    </h1>
    
    <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 32px 0;">
      ${escapeHtml(bodyText)}
    </p>
    
    <div style="background: white; border: 1px solid #e5e5e5; border-radius: 8px; padding: 24px; margin-bottom: 32px;">
      <p style="color: #999; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin: 0 0 8px 0;">
        The response
      </p>
      <p style="color: #1a1a1a; font-size: 24px; margin: 0;">${escapeHtml(responseText)}</p>
    </div>
    
    <a href="${safeUrl}" style="display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-size: 14px;">
      View the full response
    </a>
    
    <p style="color: #ccc; font-size: 12px; margin-top: 48px;">
      Sent from Ask Your Crush${safeSender ? ` • Created by ${safeSender}` : ""}
    </p>
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
    ) => {
      const name = recipientName || "They";
      return buildEmailHtml(
        `${name} said yes`,
        "good news",
        "Your Valentine invite got a yes. Time to make some plans.",
        "Yes",
        resultUrl,
        senderName,
      );
    },
  },
  maybe: {
    subject: "They said maybe...",
    getContent: (
      senderName: string | null,
      recipientName: string | null,
      resultUrl: string,
    ) => {
      const name = recipientName || "They";
      return buildEmailHtml(
        `${name} said maybe`,
        "update",
        "Not a no. Give them a moment — could still go your way.",
        "Maybe",
        resultUrl,
        senderName,
      );
    },
  },
  no: {
    subject: "They responded to your invite",
    getContent: (
      senderName: string | null,
      recipientName: string | null,
      resultUrl: string,
    ) => {
      const name = recipientName || "They";
      return buildEmailHtml(
        `${name} said no`,
        "update",
        "Not the answer you hoped for, but respect for putting yourself out there. That takes courage.",
        "No",
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
}: SendResponseEmailParams): Promise<boolean> {
  if (!process.env.BREVO_API_KEY) {
    console.log("BREVO_API_KEY not set, skipping email");
    return false;
  }

  const template = emailTemplates[response];

  const sendSmtpEmail = new Brevo.SendSmtpEmail();
  sendSmtpEmail.subject = template.subject;
  sendSmtpEmail.htmlContent = template.getContent(
    senderName,
    recipientName,
    resultUrl,
  );
  sendSmtpEmail.sender = {
    name: "Ask Your Crush",
    email: process.env.BREVO_SENDER_EMAIL || "noreply@example.com",
  };
  sendSmtpEmail.to = [{ email: to }];

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`Email sent successfully to ${to}`);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}
