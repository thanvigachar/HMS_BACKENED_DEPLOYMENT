// catchAsyncErrors.js
function catchAsyncErrors(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

module.exports = catchAsyncErrors;  // This is correct for CommonJS
