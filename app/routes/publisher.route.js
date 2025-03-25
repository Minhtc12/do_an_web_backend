const express = require("express");
const publisherController = require("../controllers/publisher.controller");
const { authenticate, authorize } = require("../middlewares/auth.middleware");

const router = express.Router();

// Các route bảo vệ với phân quyền
router.post("/", authenticate, authorize(["Quản lý"]), publisherController.create); // Thêm nhà xuất bản (chỉ Quản lý)
router.put("/:MANXB", authenticate, authorize(["Quản lý"]), publisherController.update); // Sửa nhà xuất bản (chỉ Quản lý)
router.delete("/:MANXB", authenticate, authorize(["Quản lý"]), publisherController.delete); // Xóa nhà xuất bản (chỉ Quản lý)

// Các route công khai
router.get("/", publisherController.findAll); // Lấy danh sách nhà xuất bản
router.get("/:MANXB", publisherController.findById); // Lấy thông tin nhà xuất bản

module.exports = router;