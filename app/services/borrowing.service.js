const { ObjectId } = require("mongodb");

class BorrowingService {
    constructor(client) {
        this.BorrowingRecord = client.db().collection("THEODOIMUONSACH"); // Collection THEODOIMUONSACH
        this.Book = client.db().collection("SACH");                      // Collection SACH
        this.Reader = client.db().collection("DOCGIA");                 // Collection DOCGIA
    }

    // Chuẩn hóa dữ liệu bản ghi mượn sách
    extractBorrowingData(payload) {
        const borrowing = {
            MASACH: payload.MASACH,
            MADOCGIA: payload.MADOCGIA,
            NGAYMUON: payload.NGAYMUON,
            NGAYTRA: payload.NGAYTRA || null, // Mặc định là chưa trả nếu không cung cấp NGAYTRA
        };
        Object.keys(borrowing).forEach(
            (key) => borrowing[key] === undefined && delete borrowing[key]
        );
        return borrowing;
    }

    // Kiểm tra sự tồn tại của sách và độc giả
    async validateRelationships(MASACH, MADOCGIA) {
        const book = await this.Book.findOne({ MASACH: MASACH });
        if (!book) {
            throw new Error(`Sách với MASACH=${MASACH} không tồn tại.`);
        }

        const reader = await this.Reader.findOne({ MADOCGIA: MADOCGIA });
        if (!reader) {
            throw new Error(`Độc giả với MADOCGIA=${MADOCGIA} không tồn tại.`);
        }
    }

    // Thêm bản ghi mượn sách mới
    async create(payload) {
        const borrowing = this.extractBorrowingData(payload);

        // Kiểm tra các ràng buộc về sách và độc giả
        await this.validateRelationships(borrowing.MASACH, borrowing.MADOCGIA);

        try {
            const result = await this.BorrowingRecord.insertOne(borrowing);
            return result.ops[0]; // Trả về bản ghi vừa thêm
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("Bản ghi mượn sách với thông tin đã tồn tại.");
            }
            throw error;
        }
    }

    // Lấy danh sách bản ghi mượn sách (với bộ lọc tùy chọn)
    async find(filter) {
        const cursor = this.BorrowingRecord.find(filter).project({ _id: 0 }); // Loại bỏ `_id` khi trả về
        return await cursor.toArray();
    }

    // Lấy thông tin bản ghi mượn sách theo MASACH, MADOCGIA, và NGAYMUON
    async findById(MASACH, MADOCGIA, NGAYMUON) {
        return await this.BorrowingRecord.findOne(
            { MASACH, MADOCGIA, NGAYMUON },
            { projection: { _id: 0 } }
        );
    }

    // Cập nhật thông tin bản ghi mượn sách theo MASACH, MADOCGIA, và NGAYMUON
    async update(MASACH, MADOCGIA, NGAYMUON, payload) {
        const filter = { MASACH, MADOCGIA, NGAYMUON };
        const update = this.extractBorrowingData(payload);
        const result = await this.BorrowingRecord.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        if (!result.value) {
            throw new Error(
                `Không tìm thấy bản ghi mượn sách với MASACH=${MASACH}, MADOCGIA=${MADOCGIA}, NGAYMUON=${NGAYMUON}.`
            );
        }

        return result.value;
    }

    // Xóa bản ghi mượn sách theo MASACH, MADOCGIA, và NGAYMUON
    async delete(MASACH, MADOCGIA, NGAYMUON) {
        const filter = { MASACH, MADOCGIA, NGAYMUON };

        const result = await this.BorrowingRecord.findOneAndDelete(filter);

        if (!result.value) {
            throw new Error(
                `Không tìm thấy bản ghi mượn sách với MASACH=${MASACH}, MADOCGIA=${MADOCGIA}, NGAYMUON=${NGAYMUON}.`
            );
        }

        return result.value;
    }

    // Xóa toàn bộ bản ghi mượn sách
    async deleteAll() {
        const result = await this.BorrowingRecord.deleteMany({});
        return result.deletedCount; // Trả về số lượng bản ghi đã xóa
    }

    // Lấy danh sách sách chưa trả
    async findUnreturnedBooks() {
        const books = await this.BorrowingRecord.find({ NGAYTRA: null }).toArray();
        return books;
    }

    // Lấy lịch sử mượn của một độc giả
    async findBorrowingHistoryByReader(MADOCGIA) {
        const history = await this.BorrowingRecord.find({ MADOCGIA }).toArray();
        return history;
    }

    // Lấy lịch sử mượn của một sách
    async findBorrowingHistoryByBook(MASACH) {
        const history = await this.BorrowingRecord.find({ MASACH }).toArray();
        return history;
    }
}
module.exports = BorrowingService;