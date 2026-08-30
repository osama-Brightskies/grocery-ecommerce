export type VerifyOtpRequest = {
  code: string;
};

export type VerifyOtpData = {
  resetToken: string;
};

export type VerifyOtpResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: VerifyOtpData | string;
};

export type ResendEmailRequest = {
  email: string;
  purpose?: number;
};
