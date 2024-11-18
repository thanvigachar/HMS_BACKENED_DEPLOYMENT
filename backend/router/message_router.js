const express = require("express");
const {
  getAllMessages,
  sendMessage,
} = require("../controller/message_controller.js");
const { isAdminAuthenticated } = require("../middleware/auth.js");

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getall", isAdminAuthenticated, getAllMessages);
module.exports = router;
