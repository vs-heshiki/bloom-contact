export class ApiError extends Error {
  status: number;
  details?: any;
  constructor(status: number, message: string, details?: any) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

export const NotFound = (msg = 'Not found') => new ApiError(404, msg);
export const BadRequest = (msg = 'Bad request', details?: any) =>
  new ApiError(400, msg, details);
export const Conflict = (msg = 'Conflict') => new ApiError(409, msg);
export const Internal = (msg = 'Internal server error') =>
  new ApiError(500, msg);
