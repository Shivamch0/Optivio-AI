const sendPasswordResetEmail = async ({ to, resetUrl, token }) => {
  const subject = "Reset your Optivio AI password";
  const text = `Use this link to reset your password: ${resetUrl}\n\nDevelopment token: ${token}`;

  if (process.env.RESEND_API_KEY) {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: process.env.EMAIL_FROM || "Optivio AI <onboarding@resend.dev>",
        to,
        subject,
        text,
      }),
    });

    return { delivered: response.ok, provider: "resend" };
  }

  if (process.env.SENDGRID_API_KEY) {
    const response = await fetch("https://api.sendgrid.com/v3/mail/send", {
      method: "POST",
      headers: {
        authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        personalizations: [{ to: [{ email: to }] }],
        from: { email: process.env.EMAIL_FROM || "no-reply@optivio.ai" },
        subject,
        content: [{ type: "text/plain", value: text }],
      }),
    });

    return { delivered: response.ok, provider: "sendgrid" };
  }

  return { delivered: false, provider: "development", token };
};

export { sendPasswordResetEmail };
