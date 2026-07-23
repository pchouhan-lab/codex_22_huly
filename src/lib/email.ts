type ContactNotification = {
  recipient: string;
  name: string;
  email: string;
  phone: string;
  message: string;
};

export async function sendContactNotification(notification: ContactNotification) {
  const apiKey = process.env.SENDGRID_API_KEY?.trim();
  const fromEmail = process.env.SENDGRID_FROM_EMAIL?.trim();
  const templateId = process.env.SENDGRID_CONTACT_TEMPLATE_ID?.trim();

  if (!apiKey || !fromEmail || !templateId || !notification.recipient) {
    return;
  }

  const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      personalizations: [
        {
          to: [{ email: notification.recipient }],
          dynamic_template_data: {
            name: notification.name,
            email: notification.email,
            phone: notification.phone,
            message: notification.message
          }
        }
      ],
      from: { email: fromEmail, name: "Muhlenbruch Insurance Website" },
      reply_to: { email: notification.email, name: notification.name },
      subject: `New contact form submission from ${notification.name}`,
      template_id: templateId
    })
  });

  if (!response.ok) {
    throw new Error(`SendGrid rejected the contact notification (${response.status}).`);
  }
}
