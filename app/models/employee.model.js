const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const EmployeeSchema = new mongoose.Schema({
    MSNV: { type: String, required: true, unique: true }, // Mã số nhân viên (Khóa chính)
    HoTenNV: { type: String, required: true }, // Họ và tên nhân viên
    Email: { type: String, required: true, unique: true, match: /.+\@.+\..+/ }, // Email, phải đúng định dạng
    Password: { type: String, required: true }, // Mật khẩu (sẽ được mã hóa)
    ChucVu: { type: String, required: true }, // Chức vụ (vd: "Quản lý", "Nhân viên")
    DiaChi: { type: String, required: true }, // Địa chỉ nhân viên
    SoDienThoai: { type: String, required: true }, // Số điện thoại liên lạc
}, {
    versionKey: false, // Loại bỏ trường __v
});

// Middleware mã hóa mật khẩu trước khi lưu
EmployeeSchema.pre("save", async function (next) {
    if (!this.isModified("Password")) return next();
    this.Password = await bcrypt.hash(this.Password, 10); // Mã hóa mật khẩu với bcrypt
    next();
});

const Employee = mongoose.model("Employee", EmployeeSchema, "NhanVien"); // Tên bảng là NhanVien
module.exports = Employee;