const express = require("express");
const borrowingController = require("../controllers/borrowing.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Gửi yêu cầu mượn sách (dành cho độc giả)
router.post("/request", authenticate, borrowingController.createBorrowRequest);

// Nhân viên lấy danh sách yêu cầu chờ
router.get("/requests/pending", borrowingController.getPendingRequests);

// Nhân viên xác nhận mượn sách
router.put("/approve/:MaMuon", authenticate, authorize(["Nhân viên", "Quản lý"]), borrowingController.approveBorrow);

// Trả sách
router.post("/return/:MaMuon", authenticate, borrowingController.returnBook);
//ds chưa trả
router.get("/not-returned", authenticate, authorize(["Nhân viên", "Quản lý"]),borrowingController.getBooksNotReturned);
//huy mượn
router.delete("/cancel/:MaMuon", authenticate,  borrowingController.cancelBorrowRequest);
//lich su mượn
router.get("/history", authenticate, authorize(["Độc giả"]), borrowingController.getBorrowHistoryByUser);
//
router.get("/pending", authenticate,borrowingController.getPendingBooksByUser);
router.get("/borrowed", authenticate,borrowingController.getBorrowedBooksByUser);



module.exports = router;