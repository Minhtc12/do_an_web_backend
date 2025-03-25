const express = require("express");
const borrowingController = require("../controllers/borrowing.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Gửi yêu cầu mượn sách (dành cho độc giả)
router.post("/request", authenticate, borrowingController.createBorrowRequest);

// Nhân viên lấy danh sách yêu cầu chờ
router.get("/requests/pending", authenticate, authorize(["Nhân viên", "Quản lý"]), borrowingController.getPendingRequests);

// Nhân viên xác nhận mượn sách
router.put("/approve/:MaMuon", authenticate, authorize(["Nhân viên", "Quản lý"]), borrowingController.approveBorrow);

// Trả sách
router.put("/return/:MaMuon", authenticate, authorize(["Nhân viên", "Quản lý"]), borrowingController.returnBook);

module.exports = router;