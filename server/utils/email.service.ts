import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const baseEmailLayout = (title: string, content: string) => `
  <div style="font-family: Arial; background:#faf5ff; padding:40px; text-align:center;">
    <div style="max-width:600px; margin:auto; background:#fff; padding:40px; border-radius:16px;">
      <h2>${title}</h2>
      ${content}
    </div>
  </div>
`;

export const sendRegisterOTPEmail = async (email: string, code: string) => {
  const html = baseEmailLayout(
    "Verify your email",
    `
      <p>Enter this code to complete registration:</p>
      <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#a855f7;">
        ${code}
      </div>
      <p>This code expires in 10 minutes.</p>
    `,
  );

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your email",
    html,
  });
};

export const sendCurrentEmailChangeOTP = async (
  email: string,
  code: string,
) => {
  const html = baseEmailLayout(
    "Confirm current email",
    `
      <p>We received a request to change your email.</p>
      <p>Enter this code to confirm your current email:</p>

      <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#a855f7;">
        ${code}
      </div>

      <p>If this wasn't you, ignore this email.</p>
    `,
  );

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirm your current email",
    html,
  });
};

export const sendNewEmailVerificationOTP = async (email: string, code: string) => {
  const html = baseEmailLayout(
    "Confirm new email",
    `
      <p>Enter this code to confirm your new email address:</p>

      <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#22c55e;">
        ${code}
      </div>

      <p>This ensures you own the new email.</p>
    `,
  );

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Confirm your new email",
    html,
  });
};

export const sendForgotPasswordOTP = async (email: string, code: string) => {
  const html = baseEmailLayout(
    "Reset your password",
    `
      <p>We received a request to reset your password.</p>
      <p>Enter this code to continue:</p>

      <div style="font-size:32px; font-weight:bold; letter-spacing:6px; color:#ef4444;">
        ${code}
      </div>

      <p>This code expires in 10 minutes.</p>
    `,
  );

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Password reset code",
    html,
  });
};