const generateForgotPasswordEmail = (user, resetUrl) => {
  return {
    subject: 'Password Reset Request',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Password Reset Request</h2>
        <p>Hello ${user.name},</p>
        <p>You have requested to reset your password. Click the button below to reset your password:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">Reset Password</a>
        </div>
        <p>If the button above doesn't work, copy and paste this link in your browser:</p>
        <p style="word-break: break-all;">${resetUrl}</p>
        <p>This link will expire in 10 minutes for security reasons.</p>
        <p>If you didn't request a password reset, please ignore this email.</p>
        <hr style="margin: 30px 0; border: none; border-top: 1px solid #eee;">
        <p style="color: #666; font-size: 12px;">This is an automated email, please do not reply to this email.</p>
      </div>
    `,
    text: `
      Password Reset Request
      
      Hello ${user.name},
      
      You have requested to reset your password. Click the link below to reset your password:
      
      ${resetUrl}
      
      This link will expire in 10 minutes for security reasons.
      
      If you didn't request a password reset, please ignore this email.
      
      This is an automated email, please do not reply to this email.
    `
  };
};

export default generateForgotPasswordEmail;