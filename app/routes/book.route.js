const express = require("express");
const bookController = require("../controllers/book.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Các route bảo vệ với phân quyền
router.post("/", authenticate, authorize(["Quản lý"]), bookController.create); // Thêm sách (chỉ Quản lý)
router.put("/:MASACH", authenticate, authorize(["Quản lý"]), bookController.update); // Sửa sách (chỉ Quản lý)
router.delete("/:MASACH", authenticate, authorize(["Quản lý"]), bookController.delete); // Xóa sách (chỉ Quản lý)

// Các route công khai
router.get("/", bookController.findAll); // Lấy danh sách sách
router.get("/:MASACH", bookController.findById); // Lấy thông tin sách theo MASACH
router.get("/search", bookController.search); // Tìm kiếm sách theo tên hoặc tác giả
router.get("/publisher/:MANXB", bookController.findBooksByPublisher); // Tìm sách theo nhà xuất bản

module.exports = router;