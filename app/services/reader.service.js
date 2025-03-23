const { ObjectId } = require("mongodb");

class ReaderService {
    constructor(client) {
        this.Reader = client.db().collection("DOCGIA"); // Collection DOCGIA
        this.BorrowingRecord = client.db().collection("THEODOIMUONSACH"); // Collection THEODOIMUONSACH
    }

    // Chuẩn hóa dữ liệu độc giả
    extractReaderData(payload) {
        const reader = {
            MADOCGIA: payload.MADOCGIA,
            HOLOT: payload.HOLOT,
            TEN: payload.TEN,
            NGAYSINH: payload.NGAYSINH,
            PHAI: payload.PHAI,
            DIACHI: payload.DIACHI,
            DIENTHOAI: payload.DIENTHOAI,
        };
        Object.keys(reader).forEach(
            (key) => reader[key] === undefined && delete reader[key]
        );
        return reader;
    }

    // Thêm mới độc giả
    async create(payload) {
        const reader = this.extractReaderData(payload);

        try {
            const result = await this.Reader.insertOne(reader);
            return result.ops[0]; // Trả về độc giả mới được thêm
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("MADOCGIA đã tồn tại. Vui lòng sử dụng một mã khác.");
            }
            throw error;
        }
    }

    // Lấy tất cả độc giả
    async find(filter) {
        const cursor = this.Reader.find(filter).project({ _id: 0 }); // Loại bỏ _id
        return await cursor.toArray();
    }

    // Lấy thông tin độc giả theo MADOCGIA
    async findById(madocgia) {
        return await this.Reader.findOne({ MADOCGIA: madocgia }, { projection: { _id: 0 } });
    }

    // Cập nhật thông tin độc giả theo MADOCGIA
    async update(madocgia, payload) {
        const filter = { MADOCGIA: madocgia }; // Truy vấn theo MADOCGIA
        const update = this.extractReaderData(payload);
        const result = await this.Reader.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        if (!result.value) {
            throw new Error(`Không tìm thấy độc giả với MADOCGIA=${madocgia}.`);
        }

        return result.value;
    }

    // Xóa độc giả theo MADOCGIA
    async delete(madocgia) {
        // Kiểm tra bản ghi mượn sách liên quan trước khi xóa
        const borrowingCount = await this.BorrowingRecord.countDocuments({ MADOCGIA: madocgia });
        if (borrowingCount > 0) {
            throw new Error("Không thể xóa độc giả vì còn bản ghi mượn sách liên quan.");
        }

        const result = await this.Reader.findOneAndDelete({ MADOCGIA: madocgia });

        if (!result.value) {
            throw new Error(`Không tìm thấy độc giả với MADOCGIA=${madocgia}.`);
        }

        return result.value;
    }

    // Lấy thông tin độc giả kèm lịch sử mượn sách
    async getReaderWithBorrowingHistory(madocgia) {
        const reader = await this.Reader.findOne({ MADOCGIA: madocgia }, { projection: { _id: 0 } });

        if (!reader) {
            throw new Error("Không tìm thấy độc giả.");
        }

        const borrowingHistory = await this.BorrowingRecord.find({ MADOCGIA: madocgia }).toArray();

        return { ...reader, borrowingHistory };
    }

    // Đếm số lượng sách đang mượn theo MADOCGIA
    async countBorrowedBooks(madocgia) {
        const count = await this.BorrowingRecord.countDocuments({ MADOCGIA: madocgia, NGAYTRA: null });
        return count; // Trả về số lượng sách đang mượn
    }

    // Lấy danh sách độc giả chưa trả sách
    async findReadersWithUnreturnedBooks() {
        const readers = await this.BorrowingRecord.aggregate([
            { $match: { NGAYTRA: null } }, // Lọc các bản ghi chưa trả sách
            {
                $lookup: {
                    from: "DOCGIA",
                    localField: "MADOCGIA",
                    foreignField: "MADOCGIA",
                    as: "ReaderDetails",
                },
            },
            { $unwind: "$ReaderDetails" }, // Giải nén dữ liệu độc giả
            {
                $project: {
                    ReaderDetails: 1,
                },
            },
        ]).toArray();

        return readers.map(record => record.ReaderDetails);
    }

    // Xóa toàn bộ độc giả
    async deleteAll() {
        const result = await this.Reader.deleteMany({});
        return result.deletedCount; // Trả về số lượng độc giả đã xóa
    }
}

module.exports = ReaderService;