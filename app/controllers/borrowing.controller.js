const BorrowingService = require("../services/borrowing.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm bản ghi mượn sách mới
exports.create = async (req, res, next) => {
    try {
        const borrowingService = new BorrowingService(MongoDB.client);
        const document = await borrowingService.create(req.body);

        res.send({
            message: "Bản ghi mượn sách được thêm thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi thêm bản ghi mượn sách."));
    }
};

// Lấy danh sách tất cả bản ghi mượn sách
exports.findAll = async (req, res, next) => {
    try {
        const borrowingService = new BorrowingService(MongoDB.client);
        const documents = await borrowingService.find(req.query);

        res.send(documents);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách bản ghi mượn sách."));
    }
};

// Lấy thông tin bản ghi mượn sách theo MASACH, MADOCGIA, và NGAYMUON
exports.findById = async (req, res, next) => {
    try {
        const { MASACH, MADOCGIA, NGAYMUON } = req.params;
        const borrowingService = new BorrowingService(MongoDB.client);
        const document = await borrowingService.findById(MASACH, MADOCGIA, NGAYMUON);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy bản ghi mượn sách."));
        }

        res.send(document);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi tìm bản ghi mượn sách với MASACH=${req.params.MASACH}, MADOCGIA=${req.params.MADOCGIA}, NGAYMUON=${req.params.NGAYMUON}.`));
    }
};

// Cập nhật thông tin bản ghi mượn sách
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống."));
    }

    try {
        const { MASACH, MADOCGIA, NGAYMUON } = req.params;
        const borrowingService = new BorrowingService(MongoDB.client);
        const document = await borrowingService.update(MASACH, MADOCGIA, NGAYMUON, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy bản ghi mượn sách."));
        }

        res.send({
            message: "Cập nhật bản ghi mượn sách thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi cập nhật bản ghi mượn sách với MASACH=${req.params.MASACH}, MADOCGIA=${req.params.MADOCGIA}, NGAYMUON=${req.params.NGAYMUON}.`));
    }
};

// Xóa bản ghi mượn sách
exports.delete = async (req, res, next) => {
    try {
        const { MASACH, MADOCGIA, NGAYMUON } = req.params;
        const borrowingService = new BorrowingService(MongoDB.client);
        const document = await borrowingService.delete(MASACH, MADOCGIA, NGAYMUON);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy bản ghi mượn sách."));
        }

        res.send({
            message: "Xóa bản ghi mượn sách thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi xóa bản ghi mượn sách với MASACH=${req.params.MASACH}, MADOCGIA=${req.params.MADOCGIA}, NGAYMUON=${req.params.NGAYMUON}.`));
    }
};

// Xóa toàn bộ bản ghi mượn sách
exports.deleteAll = async (req, res, next) => {
    try {
        const borrowingService = new BorrowingService(MongoDB.client);
        const deletedCount = await borrowingService.deleteAll();

        res.send({
            message: `Đã xóa ${deletedCount} bản ghi mượn sách.`,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả bản ghi mượn sách."));
    }
};

// Lấy danh sách sách chưa trả
exports.findUnreturnedBooks = async (req, res, next) => {
    try {
        const borrowingService = new BorrowingService(MongoDB.client);
        const documents = await borrowingService.findUnreturnedBooks();

        res.send(documents);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách sách chưa trả."));
    }
};

// Lấy lịch sử mượn của một độc giả
exports.findBorrowingHistoryByReader = async (req, res, next) => {
    try {
        const borrowingService = new BorrowingService(MongoDB.client);
        const history = await borrowingService.findBorrowingHistoryByReader(req.params.MADOCGIA);

        res.send(history);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi lấy lịch sử mượn sách của độc giả với MADOCGIA=${req.params.MADOCGIA}.`));
    }
};

// Lấy lịch sử mượn của một sách
exports.findBorrowingHistoryByBook = async (req, res, next) => {
    try {
        const borrowingService = new BorrowingService(MongoDB.client);
        const history = await borrowingService.findBorrowingHistoryByBook(req.params.MASACH);

        res.send(history);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi lấy lịch sử mượn sách của sách với MASACH=${req.params.MASACH}.`));
    }
};