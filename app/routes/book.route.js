const express = require("express");
const books = require("../controllers/book.controller");

const router = express.Router();

router.post("/", books.create); // Thêm mới sách
router.get("/", books.findAll); // Lấy danh sách tất cả sách
router.get("/:MASACH", books.findById); // Lấy sách theo MASACH
router.put("/:MASACH", books.update); // Cập nhật thông tin sách theo MASACH
router.delete("/:MASACH", books.delete); // Xóa sách theo MASACH
router.delete("/", books.deleteAll); // Xóa tất cả sách
router.get("/search", books.search); // Tìm kiếm sách theo tên hoặc tác giả
router.get("/publisher/:MANXB", books.findBooksByPublisher); // Lọc sách theo nhà xuất bản

module.exports = router;