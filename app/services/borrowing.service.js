const BorrowingRecord = require("../models/borrowing.model");
const Book = require("../models/book.model");
const Reader = require("../models/reader.model");
const Employee = require("../models/employee.model");
 const { v4: uuidv4 } = require("uuid");
class BorrowingService {
    // Import thư viện UUID


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
    if (!payload.MADOCGIA || !payload.MASACH || !payload.NGAYMUON) {
      throw new Error("Thông tin mượn không đầy đủ.");
    }

    // Tự động tạo mã mượn (MaMuon)
    const MaMuon = `BR-${payload.MADOCGIA}-${Date.now()}-${uuidv4().substring(0, 8)}`;

    const borrowing = new BorrowingRecord({
      ...payload,
      MaMuon, // Gán mã mượn tự động
      TrangThai: "pending", // Trạng thái mặc định là chờ xác nhận
      NGAYMUON: new Date(),
      NGAYTRA: null,
      MSNV: null,
    });

    // Kiểm tra liên kết
    await this.validateRelationships(payload.MASACH, payload.MADOCGIA, null);

    try {
      const savedBorrowing = await borrowing.save();
      return savedBorrowing; // Trả về bản ghi đã lưu, bao gồm MaMuon
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
    async returnBook(MaMuon) {
  const borrow = await BorrowingRecord.findOne({ MaMuon, TrangThai: "not-returned" });
  if (!borrow) throw new Error("Không tìm thấy yêu cầu cần trả hoặc sách đã được trả.");

  borrow.TrangThai = "returned";
  borrow.NGAYTRA = new Date(); // Cập nhật ngày trả
  await borrow.save();

  return { message: "Sách đã được trả thành công." };
}
    async getBooksNotReturned() {
  return await BorrowingRecord.find({ TrangThai: "approved", NGAYTRA: null }).sort({ NGAYMUON: -1 });
}
async cancelBorrowRequest(MaMuon) {
  const borrow = await BorrowingRecord.findOne({ MaMuon, TrangThai: "pending" });
  if (!borrow) throw new Error("Yêu cầu không tồn tại hoặc đã được xử lý.");

  await borrow.deleteOne();
  return { message: "Yêu cầu mượn sách đã bị hủy." };
}
async getBorrowHistoryByUser(MADOCGIA) {
  return await BorrowingRecord.find({ MADOCGIA }).populate("MASACH", "TENSACH") .sort({ NGAYMUON: -1 });
}
}

module.exports = BorrowingService;