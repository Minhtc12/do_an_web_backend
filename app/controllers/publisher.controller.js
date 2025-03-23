const PublisherService = require("../services/publisher.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm mới nhà xuất bản
exports.create = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.create(req.body);
        res.send({
            message: "Nhà xuất bản được thêm thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi thêm nhà xuất bản."));
    }
};

// Lấy danh sách tất cả nhà xuất bản
exports.findAll = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const documents = await publisherService.find(req.query);
        res.send(documents);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách nhà xuất bản."));
    }
};

// Lấy nhà xuất bản theo MANXB
exports.findById = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.findById(req.params.MANXB);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản."));
        }

        res.send(document);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi tìm nhà xuất bản với MANXB=${req.params.MANXB}.`));
    }
};

// Cập nhật nhà xuất bản theo MANXB
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống."));
    }

    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.update(req.params.MANXB, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản."));
        }

        res.send({
            message: "Cập nhật nhà xuất bản thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi cập nhật nhà xuất bản với MANXB=${req.params.MANXB}.`));
    }
};

// Xóa nhà xuất bản theo MANXB
exports.delete = async (req, res, next) => {
    try {
        const publisherService = new PublisherService(MongoDB.client);
        const document = await publisherService.delete(req.params.MANXB);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhà xuất bản."));
        }

        res.send({
            message: "Xóa nhà xuất bản thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi xóa nhà xuất bản với MANXB=${req.params.MANXB}.`));
    }
};