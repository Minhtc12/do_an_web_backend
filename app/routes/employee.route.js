const express = require("express");
const employees = require("../controllers/employee.controller");

const router = express.Router();

router.post("/", employees.create); // Thêm mới nhân viên
router.get("/", employees.findAll); // Lấy danh sách tất cả nhân viên
router.get("/:MASNV", employees.findById); // Lấy thông tin nhân viên theo MASNV
router.put("/:MASNV", employees.update); // Cập nhật thông tin nhân viên theo MASNV
router.delete("/:MASNV", employees.delete); // Xóa nhân viên theo MASNV
router.delete("/", employees.deleteAll); // Xóa toàn bộ nhân viên
router.post("/login", employees.authenticate); // Đăng nhập nhân viên
router.get("/:MASNV/borrowing-records", employees.getEmployeeWithBorrowingRecords); // Lấy thông tin kèm bản ghi mượn sách

module.exports = router;