export type ControllerResponseForSuccess = {
  data: any;
  message: string;
  code: number;
  success: boolean;
};

export type ControllerResponseForFailure = {
  message: string;
  code: number;
  success: boolean;
};


export const APIResponse = {
  create: (
    data?: any,
    message?: string,
    code?: number,
    success?: boolean,
  ): ControllerResponseForSuccess => ({
    data,
    success,
    message,
    code,
  }),
  found: (
    data?: any,
    message?: string,
    code?: number,
    success?: boolean,
  ): ControllerResponseForSuccess => ({
    data,
    success,
    message,
    code,
  }),
  notfound: (
    message?: string,
    code?: number,
    success?: boolean,
  ): ControllerResponseForFailure => ({
    success,
    message,
    code,
  }),
  badRequest: (
    message?: string,
    code?: number,
    success?: boolean,
  ): ControllerResponseForFailure => ({
    success,
    message,
    code,
  }),
  internalServerError: (
    message?: string,
    success?: boolean,
  ): ControllerResponseForFailure => ({
    success,
    message,
    code: 500,
  }),
};
