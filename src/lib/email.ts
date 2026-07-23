type ContactNotification = {
  recipient: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };

    return entities[character];
  });
}

export async function sendContactNotification(notification: ContactNotification) {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  const fromEmail = process.env.SENDGRID_FROM_EMAIL?.trim();

  if (!apiKey || !fromEmail || !notification.recipient) {
    return;
  }

  const html = `
    <h2>New website contact submission</h2>
    <p><strong>Name:</strong> ${escapeHtml(notification.name)}</p>
    <p><strong>Email:</strong> ${escapeHtml(notification.email)}</p>
    <p><strong>Phone:</strong> ${escapeHtml(notification.phone)}</p>
    <p><strong>Message:</strong></p>
    <p>${escapeHtml(notification.message).replace(/\n/g, "<br />")}</p>
  `;

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [{ to: [{ email: notification.recipient }] }],
      from: { email: fromEmail, name: "Muhlenbruch Insurance Website" },
      reply_to: { email: notification.email, name: notification.name },
      subject: `New contact form submission from ${notification.name}`,
      content: [{ type: "text/html", value: html }]
    })
  });

  if (!response.ok) {
    throw new Error(`SendGrid rejected the contact notification (${response.status}).`);
  }
}
