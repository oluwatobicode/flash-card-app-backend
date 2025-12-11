// Service example file - can be implemented as needed

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

export const sendWelcomeEmail = async (
  email: string,
  username: string,
): Promise<void> => {
  // TODO: Implement email sending logic
  // This could use nodemailer, sendgrid, or any other email service
  console.log(`Sending welcome email to ${email} for user ${username}`);
};

export const sendPasswordResetEmail = async (
  email: string,
  resetToken: string,
): Promise<void> => {
  // TODO: Implement password reset email
  console.log(
    `Sending password reset email to ${email} with token ${resetToken}`,
  );
};
