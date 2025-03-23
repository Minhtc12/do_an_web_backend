const express = require("express");
const borrowings = require("../controllers/borrowing.controller");

const router = express.Router();

router.post("/", borrowings.create); // Thêm bản ghi mượn sách mới
router.get("/", borrowings.findAll); // Lấy danh sách tất cả bản ghi mượn sách
router.get("/:MASACH/:MADOCGIA/:NGAYMUON", borrowings.findById); // Lấy bản ghi mượn sách theo MASACH, MADOCGIA, NGAYMUON
router.put("/:MASACH/:MADOCGIA/:NGAYMUON", borrowings.update); // Cập nhật bản ghi mượn sách
router.delete("/:MASACH/:MADOCGIA/:NGAYMUON", borrowings.delete); // Xóa bản ghi mượn sách
router.delete("/", borrowings.deleteAll); // Xóa toàn bộ bản ghi mượn sách
router.get("/unreturned", borrowings.findUnreturnedBooks); // Lấy danh sách sách chưa trả
router.get("/reader/:MADOCGIA", borrowings.findBorrowingHistoryByReader); // Lấy lịch sử mượn của độc giả
router.get("/book/:MASACH", borrowings.findBorrowingHistoryByBook); // Lấy lịch sử mượn của sách

module.exports = router;