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

// Lấy thông tin tài khoản (yêu cầu đăng nhập)
router.get("/:MADOCGIA", authenticate, readerController.getInfo);

// Cập nhật thông tin tài khoản (yêu cầu đăng nhập)
router.put("/:MADOCGIA", authenticate, readerController.updateInfo);
// Gửi yêu cầu mượn sách
// router.post("/borrow/request", authenticate, readerController.requestBorrowBook);

module.exports = router;