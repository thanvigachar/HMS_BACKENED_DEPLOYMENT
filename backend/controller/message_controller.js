const catchAsyncErrors = require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../middleware/err.js");
const { Message } = require("../models/message.js");

exports.sendMessage = catchAsyncErrors(async (req, res, next) => {
  const { firstName, lastName, email, phone, message } = req.body;

  if (!firstName || !lastName || !email || !phone || !message) {
    return next(new ErrorHandler("Please Fill Full Form!", 400));
  }

  await Message.create({ firstName, lastName, email, phone, message });

  res.status(200).json({
    success: true,
    message: "Message Sent!",
  });
});

exports.getAllMessages = catchAsyncErrors(async (req, res, next) => {
  const messages = await Message.find();

  res.status(200).json({
    success: true,
    messages,
  });
});
