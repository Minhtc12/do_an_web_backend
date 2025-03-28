const express = require("express");
const readerController = require("../controllers/reader.controller");
const { authenticate } = require("../middlewares/auth.middleware");

const router = express.Router();

// Đăng ký tài khoản
router.post("/register", readerController.register);

// Đăng nhập
router.post("/login", readerController.login);

// Tìm kiếm sách (không yêu cầu đăng nhập)
router.get("/search", readerController.searchBooks);

router.get("/me", authenticate, readerController.getInfo); // Lấy thông tin độc giả từ JWT
router.put("/me", authenticate, readerController.updateInfo); // Cập nhật thông tin độc giả từ JWT
// Gửi yêu cầu mượn sách
// router.post("/borrow/request", authenticate, readerController.requestBorrowBook);

module.exports = router;