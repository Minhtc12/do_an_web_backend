const express = require("express");
const publishers = require("../controllers/publisher.controller");

const router = express.Router();

router.post("/", publishers.create);            // Thêm mới nhà xuất bản
router.get("/", publishers.findAll);            // Lấy danh sách nhà xuất bản
router.get("/:MANXB", publishers.findById);     // Lấy nhà xuất bản theo MANXB
router.put("/:MANXB", publishers.update);       // Cập nhật nhà xuất bản
router.delete("/:MANXB", publishers.delete);    // Xóa nhà xuất bản

module.exports = router;