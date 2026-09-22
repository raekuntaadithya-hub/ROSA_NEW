/**
 * Uniform API Response Formatter for ROSA Knee Clinical Platform
 */

export function successResponse(res, data = null, message = "Operation successful", statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
    timestamp: new Date().toISOString(),
  });
}

export function errorResponse(res, error = "An error occurred", message = "Request failed", statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message,
    error: typeof error === "object" ? (error.message || JSON.stringify(error)) : error,
    timestamp: new Date().toISOString(),
  });
}
