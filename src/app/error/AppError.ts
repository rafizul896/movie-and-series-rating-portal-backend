class AppError extends Error {
  public statusCode: number

  constructor(statusCode: number, message: string, stack = '') {
    super(message)
    this.statusCode = statusCode

    if (stack) {
      this.stack = stack
    } else {
      Error.captureStackTrace(this, this.constructor)
    }
  }
}

export default AppError

// export class AppError extends Error {
//   statusCode: number;

//   constructor(message: string, statusCode: number) {
//     super(message);
//     this.statusCode = statusCode;
//     Error.captureStackTrace(this, this.constructor);
//   }
// }
