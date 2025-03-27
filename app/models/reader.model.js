const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const ReaderSchema = new mongoose.Schema({
    MADOCGIA: { type: String, required: true, unique: true }, // Khóa chính
    HOLOT: { type: String }, // Họ lót
    TEN: { type: String, required: true }, // Tên
    NGAYSINH: { 
        type: Date, 
        
        get: (date) => date.toISOString().split("T")[0] // Chỉ lấy phần ngày (yyyy-mm-dd)
    },
    PHAI: { type: String }, // Ví dụ: "Nam" hoặc "Nữ"
    DIACHI: { type: String }, // Địa chỉ
    DIENTHOAI: { type: String }, // Số điện thoại
    Email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Email, định dạng hợp lệ
    Password: { type: String, required: true }, // Mật khẩu (sẽ được mã hóa)
}, {
    versionKey: false, // Loại bỏ trường __v
    getters: true // Cho phép sử dụng get() để định dạng ngày
});

// Middleware mã hóa mật khẩu trước khi lưu
ReaderSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    this.Password = await bcrypt.hash(this.Password, 10); // Mã hóa mật khẩu
    next();
});

const Reader = mongoose.model("Reader", ReaderSchema, "DOCGIA"); // Tên bảng là DOCGIA
module.exports = Reader;