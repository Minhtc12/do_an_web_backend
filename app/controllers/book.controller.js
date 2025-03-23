const BookService = require("../services/book.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm sách mới
exports.create = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.create(req.body);

        res.send({
            message: "Sách được thêm thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi thêm sách."));
    }
};

// Lấy danh sách tất cả sách
exports.findAll = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const documents = await bookService.find(req.query);

        res.send(documents);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách sách."));
    }
};

// Lấy sách theo MASACH
exports.findById = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.findById(req.params.MASACH);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy sách."));
        }

        res.send(document);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi tìm sách với MASACH=${req.params.MASACH}.`));
    }
};

// Cập nhật thông tin sách theo MASACH
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống."));
    }

    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.update(req.params.MASACH, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy sách."));
        }

        res.send({
            message: "Cập nhật sách thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi cập nhật sách với MASACH=${req.params.MASACH}.`));
    }
};

// Xóa sách theo MASACH
exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const document = await bookService.delete(req.params.MASACH);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy sách."));
        }

        res.send({
            message: "Xóa sách thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi xóa sách với MASACH=${req.params.MASACH}.`));
    }
};

// Xóa tất cả sách
exports.deleteAll = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const deletedCount = await bookService.deleteAll();

        res.send({
            message: `Đã xóa ${deletedCount} sách.`,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả sách."));
    }
};

// Tìm kiếm sách theo tên hoặc tác giả
exports.search = async (req, res, next) => {
    try {
        const query = req.query.q;
        if (!query) {
            return next(new ApiError(400, "Không có từ khóa tìm kiếm."));
        }

        const bookService = new BookService(MongoDB.client);
        const results = await bookService.search(query);

        res.send(results);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi tìm kiếm sách."));
    }
};

// Lọc sách theo nhà xuất bản
exports.findBooksByPublisher = async (req, res, next) => {
    try {
        const bookService = new BookService(MongoDB.client);
        const documents = await bookService.findBooksByPublisher(req.params.MANXB);

        if (!documents || documents.length === 0) {
            return next(new ApiError(404, "Không có sách nào thuộc nhà xuất bản này."));
        }

        res.send(documents);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi lấy sách theo MANXB=${req.params.MANXB}.`));
    }
};