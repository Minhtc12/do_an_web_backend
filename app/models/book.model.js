const mongoose = require("mongoose");

const BookSchema = new mongoose.Schema({
    MASACH: { type: String, required: true, unique: true }, // Khóa chính
    TENSACH: { type: String, required: true },
    DONGIA: { type: Number, required: true },
    SOQUYEN: { type: Number, required: true },
    NAMXUATBAN: { type: Number, required: true },
    MANXB: { type: String, required: true }, // Liên kết với NHAXUATBAN
    "[NGUONGOC/TACGIA]": { // Thuộc tính động
        NGUONGOC: { type: String, required: false },
        TACGIA: { type: String, required: false },
    },
});

const Book = mongoose.model("Book", BookSchema, "SACH"); // Tên bảng là SACH
module.exports = Book;