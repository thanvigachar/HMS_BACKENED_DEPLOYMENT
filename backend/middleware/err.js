// ErrorHandler class
class ErrorHandler extends Error {
    constructor(message, statusCode) {    
      super(message);
      this.statusCode = statusCode;    
    }
  }
  
// errorMiddleware function to handle errors
  const errorMiddleware = (err, req, res, next) => {
    err.message = err.message || "Internal Server Error";
    err.statusCode = err.statusCode || 500;

// Handle duplicate key error
    if (err.code === 11000) {
      const message = `Duplicate ${Object.keys(err.keyValue)} Entered`;
      err = new ErrorHandler(message, 400);
    }
  
// Handle JWT errors
    if (err.name === "JsonWebTokenError") {
      const message = `Json Web Token is invalid, Try again!`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle expired JWT errors
    if (err.name === "TokenExpiredError") {
      const message = `Json Web Token is expired, Try again!`;
      err = new ErrorHandler(message, 400);
    }
  
    // Handle invalid cast errors (like wrong ObjectId format)
    if (err.name === "CastError") {
      const message = `Invalid ${err.path}`;
      err = new ErrorHandler(message, 400);
    }
  
// Format validation errors
    const errorMessage = err.errors
      ? Object.values(err.errors)
          .map((error) => error.message)
          .join(" ")
      : err.message;
  
    // Send the error response
    return res.status(err.statusCode).json({
      success: false,
      message: errorMessage,
    });
  };
  
  // Export ErrorHandler and errorMiddleware
  module.exports = { ErrorHandler, errorMiddleware };
  