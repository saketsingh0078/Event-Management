export type ApiResponse<T> = {
    success: true;
    data: T;
  } | {
    success: false;
    error: string;
    message?: string;
  };
  
  export function successResponse<T>(data: T): ApiResponse<T> {
    return {
      success: true,
      data,
    };
  }
  
  export function errorResponse(error: string, message?: string): ApiResponse<never> {
    return {
      success: false,
      error,
      message,
    };
  }
  
  