export const generateOTP = (length: number = 6): string => {
  const digits = "0123456789";
  let otp = "";
  for (let i = 0; i < length; i++) {
    otp += digits[Math.floor(Math.random() * 10)];
  }
  return otp;
};

export const verifyOTPExpiry = (
  createdAt: Date,
  expiryMinutes: number = 10,
): boolean => {
  const now = new Date();
  const diffInMinutes = (now.getTime() - createdAt.getTime()) / (1000 * 60);
  return diffInMinutes <= expiryMinutes;
};
