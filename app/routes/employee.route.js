const express = require("express");
const employeeController = require("../controllers/employee.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Đăng nhập bằng Email và Password
router.post("/login", employeeController.login);


// Thêm nhân viên mới (Chỉ Quản lý có quyền)
router.post("/", authenticate, authorize(["Quản lý"]), employeeController.create);

// Lấy danh sách nhân viên (Chỉ Quản lý có quyền)
router.get("/", authenticate, authorize(["Quản lý"]), employeeController.findAll);

router.get("/me", authenticate, employeeController.findById); // Lấy thông tin nhân viên từ JWT
router.put("/me", authenticate, employeeController.update); // Cập nhật thông tin nhân viên từ JWT

// Xóa nhân viên (Chỉ Quản lý có quyền)
router.delete("/:MSNV", authenticate, authorize(["Quản lý"]), employeeController.delete);


module.exports = router;