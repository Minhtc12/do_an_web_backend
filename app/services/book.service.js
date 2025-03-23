const { ObjectId } = require("mongodb");
const propertyName = "[NGUONGOC/TACGIA]";

class BookService {
    constructor(client) {
        this.Book = client.db().collection("SACH");           // Collection SACH
        this.Publisher = client.db().collection("NHAXUATBAN"); // Collection NHAXUATBAN
        this.BorrowingRecord = client.db().collection("THEODOIMUONSACH"); // Collection THEODOIMUONSACH
    }

    // Phương thức chuẩn hóa dữ liệu sách
    extractBookData(payload) {
        const book = {
            MASACH: payload.MASACH,
            TENSACH: payload.TENSACH,
            DONGIA: payload.DONGIA,
            SOQUYEN: payload.SOQUYEN,
            NAMXUATBAN: payload.NAMXUATBAN,
            MANXB: payload.MANXB,
            [propertyName]: payload["[NGUONGOC/TACGIA]"],
        };
        Object.keys(book).forEach(
            (key) => book[key] === undefined && delete book[key]
        );
        return book;
    }

    // Kiểm tra sự tồn tại của nhà xuất bản
    async validatePublisher(MANXB) {
        const publisher = await this.Publisher.findOne({ MANXB: MANXB });
        if (!publisher) {
            throw new Error("Nhà xuất bản không tồn tại.");
        }
    }

    // Thêm sách mới
    async create(payload) {
        await this.validatePublisher(payload.MANXB); // Kiểm tra MANXB
        const book = this.extractBookData(payload);

        try {
            const result = await this.Book.insertOne(book);
            return result.ops[0]; // Trả về sách mới được thêm
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("MASACH đã tồn tại. Vui lòng sử dụng một mã khác.");
            }
            throw error;
        }
    }

    // Lấy tất cả sách (với bộ lọc tùy chọn)
    async find(filter) {
        const cursor = this.Book.find(filter).project({ _id: 0 }); // Loại bỏ _id khi trả về
        return await cursor.toArray();
    }

    // Lấy sách theo MASACH
    async findById(masach) {
        return await this.Book.findOne({ MASACH: masach }, { projection: { _id: 0 } });
    }

    // Cập nhật thông tin sách theo MASACH
    async update(masach, payload) {
        const filter = { MASACH: masach }; // Truy vấn theo MASACH
        const update = this.extractBookData(payload);
        const result = await this.Book.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        if (!result.value) {
            throw new Error(`Không tìm thấy sách với MASACH=${masach}.`);
        }

        return result.value;
    }

    // Xóa sách theo MASACH
    async delete(masach) {
        // Kiểm tra bản ghi mượn sách liên quan trước khi xóa
        const borrowingCount = await this.BorrowingRecord.countDocuments({ MASACH: masach });
        if (borrowingCount > 0) {
            throw new Error("Không thể xóa sách vì vẫn còn bản ghi mượn sách liên quan.");
        }

        const result = await this.Book.findOneAndDelete({ MASACH: masach });

        if (!result.value) {
            throw new Error(`Không tìm thấy sách với MASACH=${masach}.`);
        }

        return result.value;
    }

    // Xóa tất cả sách
    async deleteAll() {
        const result = await this.Book.deleteMany({});
        return result.deletedCount; // Trả về số lượng sách đã xóa
    }

    // Tìm kiếm sách theo tên hoặc tác giả
    async search(query) {
        return await this.find({
            $or: [
                { TENSACH: { $regex: new RegExp(query), $options: "i" } },
                { [propertyName]: { $regex: new RegExp(query), $options: "i" } },
            ],
        });
    }

    // Lấy thông tin sách kèm nhà xuất bản
    async getBooksWithPublisher() {
        const books = await this.Book.aggregate([
            {
                $lookup: {
                    from: "NHAXUATBAN",
                    localField: "MANXB",
                    foreignField: "MANXB",
                    as: "PublisherDetails",
                },
            },
            {
                $project: {
                    MASACH: 1,
                    TENSACH: 1,
                    DONGIA: 1,
                    SOQUYEN: 1,
                    NAMXUATBAN: 1,
                    [propertyName]: 1,
                    PublisherDetails: { $arrayElemAt: ["$PublisherDetails.TENNXB", 0] }, // Lấy TenNXB
                },
            },
        ]).toArray();

        return books;
    }

    // Lấy danh sách tất cả sách kèm số lần mượn
    async getBooksWithBorrowingCount() {
        const books = await this.Book.aggregate([
            {
                $lookup: {
                    from: "THEODOIMUONSACH",
                    localField: "MASACH",
                    foreignField: "MASACH",
                    as: "BorrowingRecords",
                },
            },
            {
                $project: {
                    MASACH: 1,
                    TENSACH: 1,
                    BorrowingCount: { $size: "$BorrowingRecords" }, // Đếm số lần mượn
                },
            },
        ]).toArray();

        return books;
    }

    // Đếm số lần mượn sách theo MASACH
    async countBorrowedTimes(masach) {
        const count = await this.BorrowingRecord.countDocuments({ MASACH: masach });
        return count; // Số lần sách đã được mượn
    }

    // Lọc sách theo nhà xuất bản
    async findBooksByPublisher(MANXB) {
        return await this.Book.find({ MANXB: MANXB }).project({ _id: 0 }).toArray();
    }
}

module.exports = BookService;