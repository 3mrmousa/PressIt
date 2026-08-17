export type OtpVerificationEmailType = {
  otpHash: string;
  userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  };
};

export type OtpForgotPasswordType = {
  email: string;
  otpHash: string;
  verified: boolean;
};
