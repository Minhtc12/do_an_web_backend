const mongoose = require("mongoose");

const BorrowingRecordSchema = new mongoose.Schema({
    MaMuon: { type: String, required: true, unique: true }, // Mã định danh duy nhất
    MADOCGIA: { type: String, required: true }, // Liên kết với DOCGIA
    MASACH: { type: String, required: true },   // Liên kết với SACH
    NGAYMUON: { type: Date, required: true },  // Ngày mượn
    NGAYTRA: { type: Date, required: false },  // Ngày trả (null nếu chưa trả)
    MSNV: { type: String, required: false },   // Nhân viên xử lý
    TrangThai: { type: String, required: true, default: "pending" }, // Trạng thái: pending, approved, returned
}, {
    versionKey: false // Loại bỏ trường __v
});

// Middleware tạo `MaMuon` duy nhất
BorrowingRecordSchema.pre("save", function (next) {
    if (!this.MaMuon) {
        this.MaMuon = `${this.MADOCGIA}-${this.MASACH}-${Date.now()}`;
    }
    next();
});

const BorrowingRecord = mongoose.model("BorrowingRecord", BorrowingRecordSchema, "THEODOIMUONSACH");
module.exports = BorrowingRecord;