const BorrowingRecord = require("../models/borrowing.model");
const Book = require("../models/book.model");
const Reader = require("../models/reader.model");
const Employee = require("../models/employee.model");

class BorrowingService {
    // Kiểm tra liên kết (Sách, Độc giả, Nhân viên)
    async validateRelationships(MASACH, MADOCGIA, MSNV) {
        const book = await Book.findOne({ MASACH });
        if (!book) throw new Error(`Sách với MASACH=${MASACH} không tồn tại.`);

        const reader = await Reader.findOne({ MADOCGIA });
        if (!reader) throw new Error(`Độc giả với MADOCGIA=${MADOCGIA} không tồn tại.`);

        if (MSNV) {
            const employee = await Employee.findOne({ MSNV });
            if (!employee) throw new Error(`Nhân viên với MSNV=${MSNV} không tồn tại.`);
        }
    }

    // Tạo yêu cầu mượn sách
    async createBorrowRequest(payload) {
        const borrowing = new BorrowingRecord({
            ...payload,
            TrangThai: "pending", // Trạng thái mặc định là chờ xác nhận
            NGAYMUON: new Date(),
            NGAYTRA: null,
            MSNV: null
        });

        // Kiểm tra liên kết
        await this.validateRelationships(payload.MASACH, payload.MADOCGIA, null);

        try {
            const savedBorrowing = await borrowing.save();
            return savedBorrowing;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("Bản ghi mượn sách đã tồn tại.");
            }
            throw error;
        }
    }

    // Lấy danh sách yêu cầu mượn sách (trạng thái "pending")
    async getPendingRequests() {
        return await BorrowingRecord.find({ TrangThai: "pending" })
            .select("-_id") // Không hiển thị trường _id
            .lean(); // Tối ưu cho hiển thị
    }

    // Xác nhận mượn sách
    async approveBorrow(MaMuon, MSNV) {
        const borrowing = await BorrowingRecord.findOne({ MaMuon, TrangThai: "pending" });
        if (!borrowing) {
            throw new Error("Không tìm thấy yêu cầu mượn sách cần xác nhận.");
        }

        // Cập nhật trạng thái và ghi nhận nhân viên xử lý
        borrowing.TrangThai = "approved";
        borrowing.MSNV = MSNV;
        await borrowing.save();
        return borrowing;
    }

    // Trả sách
    async returnBook(MaMuon, MSNV) {
        const borrowing = await BorrowingRecord.findOne({ MaMuon, TrangThai: "approved" });
        if (!borrowing) {
            throw new Error("Không tìm thấy bản ghi đã xác nhận để trả sách.");
        }

        // Cập nhật ngày trả và trạng thái
        borrowing.NGAYTRA = new Date();
        borrowing.TrangThai = "returned";
        borrowing.MSNV = MSNV;
        await borrowing.save();
        return borrowing;
    }
}

module.exports = BorrowingService;