const Book = require("../models/book.model");
const Publisher = require("../models/publisher.model");
const BorrowingRecord = require("../models/borrowing.model");

class BookService {
    // Kiểm tra sự tồn tại của nhà xuất bản
    async validatePublisher(MANXB) {
        const publisher = await Publisher.findOne({ MANXB });
        if (!publisher) {
            throw new Error("Nhà xuất bản không tồn tại.");
        }
    }

    // Thêm sách mới
    async create(payload) {
        await this.validatePublisher(payload.MANXB); // Kiểm tra nhà xuất bản

        // Tạo mới sách
        const book = new Book(payload);
        try {
            const savedBook = await book.save();
            return savedBook;
        } catch (error) {
            if (error.code === 11000) { // Lỗi trùng lặp
                throw new Error("MASACH đã tồn tại. Vui lòng sử dụng một mã khác.");
            }
            throw error;
        }
    }

    // Lấy danh sách tất cả sách
    async find(filter) {
        return await Book.find(filter).select("-_id"); // Loại bỏ _id khi trả về
    }

    // Lấy sách theo MASACH
    async findById(masach) {
        const book = await Book.findOne({ MASACH: masach }).select("-_id");
        if (!book) {
            throw new Error(`Không tìm thấy sách với MASACH=${masach}.`);
        }
        return book;
    }

    // Cập nhật thông tin sách
    async update(masach, payload) {
        const updatedBook = await Book.findOneAndUpdate(
            { MASACH: masach },
            { $set: payload },
            { new: true } // Trả về tài liệu sau khi cập nhật
        );

        if (!updatedBook) {
            throw new Error(`Không tìm thấy sách với MASACH=${masach}.`);
        }

        return updatedBook;
    }

    // Xóa sách theo MASACH
    async delete(masach) {
        // Kiểm tra nếu có bản ghi mượn sách liên quan
        const borrowingCount = await BorrowingRecord.countDocuments({ MASACH: masach });
        if (borrowingCount > 0) {
            throw new Error("Không thể xóa sách vì vẫn còn bản ghi mượn sách liên quan.");
        }

        const deletedBook = await Book.findOneAndDelete({ MASACH: masach });
        if (!deletedBook) {
            throw new Error(`Không tìm thấy sách với MASACH=${masach}.`);
        }

        return deletedBook;
    }

    // Tìm kiếm sách theo tên hoặc tác giả
    async search(query) {
        return await Book.find({
            $or: [
                { TENSACH: { $regex: new RegExp(query, "i") } },
                { "[NGUONGOC/TACGIA].TACGIA": { $regex: new RegExp(query, "i") } },
            ],
        }).select("-_id");
    }

    // Lấy danh sách tất cả sách kèm số lần mượn
    async getBooksWithBorrowingCount() {
        const books = await Book.aggregate([
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
        ]);
        return books;
    }

    // Lọc sách theo nhà xuất bản
    async findBooksByPublisher(MANXB) {
        return await Book.find({ MANXB }).select("-_id");
    }
}

module.exports = BookService;