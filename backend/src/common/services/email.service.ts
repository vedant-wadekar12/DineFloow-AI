import { env } from "../../config";
import { mailTransporter } from "../../config/mail/mail.config";
class EmailService {
  async sendPasswordResetEmail(
    email: string,
    resetUrl: string
  ) {
    await mailTransporter.sendMail({
      from: `"DineFlow AI" <${env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your DineFlow AI Password",
      html: `
        <!DOCTYPE html>
        <html>
          <body>
            <h2>DineFlow AI Password Reset</h2>

            <p>
              We received a request to reset your password.
            </p>

            <p>
              Click the button below to create a new password:
            </p>

            <p>
              <a
                href="${resetUrl}"
                style="
                  display:inline-block;
                  padding:12px 20px;
                  background:#FF6B35;
                  color:white;
                  text-decoration:none;
                  border-radius:6px;
                "
              >
                Reset Password
              </a>
            </p>

            <p>
              This link will expire in 15 minutes.
            </p>

            <p>
              If you did not request this, you can safely ignore this email.
            </p>

            <p>
              — DineFlow AI Team
            </p>
          </body>
        </html>
      `,
    });
  }
}

export const emailService = new EmailService();