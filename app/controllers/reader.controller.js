const ReaderService = require("../services/reader.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm độc giả mới
exports.create = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.create(req.body);

        res.send({
            message: "Độc giả được thêm thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi thêm độc giả."));
    }
};

// Lấy danh sách tất cả độc giả
exports.findAll = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const documents = await readerService.find(req.query);

        res.send(documents);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách độc giả."));
    }
};

// Lấy thông tin độc giả theo MADOCGIA
exports.findById = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.findById(req.params.MADOCGIA);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả."));
        }

        res.send(document);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi tìm độc giả với MADOCGIA=${req.params.MADOCGIA}.`));
    }
};

// Cập nhật thông tin độc giả theo MADOCGIA
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống."));
    }

    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.update(req.params.MADOCGIA, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả."));
        }

        res.send({
            message: "Cập nhật độc giả thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi cập nhật độc giả với MADOCGIA=${req.params.MADOCGIA}.`));
    }
};

// Xóa độc giả theo MADOCGIA
exports.delete = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const document = await readerService.delete(req.params.MADOCGIA);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy độc giả."));
        }

        res.send({
            message: "Xóa độc giả thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi xóa độc giả với MADOCGIA=${req.params.MADOCGIA}.`));
    }
};

// Xóa toàn bộ độc giả
exports.deleteAll = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const deletedCount = await readerService.deleteAll();

        res.send({
            message: `Đã xóa ${deletedCount} độc giả.`,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả độc giả."));
    }
};

// Lấy thông tin độc giả kèm lịch sử mượn sách
exports.getReaderWithBorrowingHistory = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const reader = await readerService.getReaderWithBorrowingHistory(req.params.MADOCGIA);

        res.send(reader);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi lấy lịch sử mượn sách của độc giả với MADOCGIA=${req.params.MADOCGIA}.`));
    }
};

// Đếm số lượng sách đang mượn bởi độc giả
exports.countBorrowedBooks = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const count = await readerService.countBorrowedBooks(req.params.MADOCGIA);

        res.send({
            MADOCGIA: req.params.MADOCGIA,
            borrowedBooks: count,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi đếm số lượng sách đang mượn bởi độc giả với MADOCGIA=${req.params.MADOCGIA}.`));
    }
};

// Lấy danh sách độc giả chưa trả sách
exports.findReadersWithUnreturnedBooks = async (req, res, next) => {
    try {
        const readerService = new ReaderService(MongoDB.client);
        const readers = await readerService.findReadersWithUnreturnedBooks();

        res.send(readers);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách độc giả chưa trả sách."));
    }
};