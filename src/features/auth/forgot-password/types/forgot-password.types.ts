export type ForgotPasswordRequest = {
  email: string;
};

export type ForgotPasswordResponse = {
  success: boolean;
  statusCode: number;
  message: string;
  data: null | unknown;
};
