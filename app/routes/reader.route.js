const express = require("express");
const readers = require("../controllers/reader.controller");

const router = express.Router();

router.post("/", readers.create); // Thêm mới độc giả
router.get("/", readers.findAll); // Lấy danh sách tất cả độc giả
router.get("/:MADOCGIA", readers.findById); // Lấy thông tin độc giả theo MADOCGIA
router.put("/:MADOCGIA", readers.update); // Cập nhật thông tin độc giả theo MADOCGIA
router.delete("/:MADOCGIA", readers.delete); // Xóa độc giả theo MADOCGIA
router.delete("/", readers.deleteAll); // Xóa toàn bộ độc giả
router.get("/:MADOCGIA/borrowing-history", readers.getReaderWithBorrowingHistory); // Lấy lịch sử mượn sách
router.get("/:MADOCGIA/borrowed-books", readers.countBorrowedBooks); // Đếm số sách đang mượn
router.get("/unreturned", readers.findReadersWithUnreturnedBooks); // Danh sách chưa trả sách

module.exports = router;