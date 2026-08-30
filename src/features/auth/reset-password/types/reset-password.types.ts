export type ResetPasswordRequest = {
  resetToken: string;
  newPassword: string;
};

export type ResetPasswordResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: null | unknown;
};
