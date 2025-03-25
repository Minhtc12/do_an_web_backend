// const PublisherService = require("../services/publisher.service");
// const MongoDB = require("../utils/mongodb.util");
// const ApiError = require("../api-error");

// // Thêm mới nhà xuất bản
// exports.create = async (req, res, next) => {
//     try {
//         const publisherService = new PublisherService(MongoDB.client);
//         const document = await publisherService.create(req.body);
//         res.send({
//             message: "Nhà xuất bản được thêm thành công.",
//             data: document,
//         });
//     } catch (error) {
//         next(new ApiError(500, "Có lỗi xảy ra khi thêm nhà xuất bản."));
//     }
// };

// // Lấy danh sách tất cả nhà xuất bản
// exports.findAll = async (req, res, next) => {
//     try {
//         const publisherService = new PublisherService(MongoDB.client);
//         const documents = await publisherService.find(req.query);
//         res.send(documents);
//     } catch (error) {
//         next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách nhà xuất bản."));
//     }
// };

// // Lấy nhà xuất bản theo MANXB
// exports.findById = async (req, res, next) => {
//     try {
//         const publisherService = new PublisherService(MongoDB.client);
//         const document = await publisherService.findById(req.params.MANXB);

//         if (!document) {
//             return next(new ApiError(404, "Không tìm thấy nhà xuất bản."));
//         }

//         res.send(document);
//     } catch (error) {
//         next(new ApiError(500, `Có lỗi xảy ra khi tìm nhà xuất bản với MANXB=${req.params.MANXB}.`));
//     }
// };

// // Cập nhật nhà xuất bản theo MANXB
// exports.update = async (req, res, next) => {
//     if (Object.keys(req.body).length === 0) {
//         return next(new ApiError(400, "Dữ liệu cập nhật không được để trống."));
//     }

//     try {
//         const publisherService = new PublisherService(MongoDB.client);
//         const document = await publisherService.update(req.params.MANXB, req.body);

//         if (!document) {
//             return next(new ApiError(404, "Không tìm thấy nhà xuất bản."));
//         }

//         res.send({
//             message: "Cập nhật nhà xuất bản thành công.",
//             data: document,
//         });
//     } catch (error) {
//         next(new ApiError(500, `Có lỗi xảy ra khi cập nhật nhà xuất bản với MANXB=${req.params.MANXB}.`));
//     }
// };

// // Xóa nhà xuất bản theo MANXB
// exports.delete = async (req, res, next) => {
//     try {
//         const publisherService = new PublisherService(MongoDB.client);
//         const document = await publisherService.delete(req.params.MANXB);

//         if (!document) {
//             return next(new ApiError(404, "Không tìm thấy nhà xuất bản."));
//         }

//         res.send({
//             message: "Xóa nhà xuất bản thành công.",
//             data: document,
//         });
//     } catch (error) {
//         next(new ApiError(500, `Có lỗi xảy ra khi xóa nhà xuất bản với MANXB=${req.params.MANXB}.`));
//     }
// };

const PublisherService = require("../services/publisher.service");
const ApiError = require("../api-error");

// Thêm mới nhà xuất bản
exports.create = async (req, res, next) => {
    try {
        const publisherService = new PublisherService();
        const document = await publisherService.create(req.body); // Gọi phương thức create từ PublisherService
        res.send({
            message: "Nhà xuất bản được thêm thành công.",
            data: document,
        });
    } catch (error) {
        if (error.message.includes("MANXB đã tồn tại")) {
            next(new ApiError(400, error.message)); // Trả về lỗi trùng lặp MANXB
        } else {
            next(new ApiError(500, "Có lỗi xảy ra khi thêm nhà xuất bản.")); // Trả về lỗi hệ thống
        }
    }
};

// Lấy danh sách tất cả nhà xuất bản
exports.findAll = async (req, res, next) => {
    try {
        const publisherService = new PublisherService();
        const documents = await publisherService.find(req.query); // Gọi phương thức find từ PublisherService
        res.send(documents);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách nhà xuất bản.")); // Trả về lỗi hệ thống
    }
};

// Lấy thông tin nhà xuất bản theo MANXB
exports.findById = async (req, res, next) => {
    try {
        const publisherService = new PublisherService();
        const document = await publisherService.findById(req.params.MANXB); // Gọi phương thức findById từ PublisherService

        if (!document) {
            return next(new ApiError(404, `Không tìm thấy nhà xuất bản với MANXB=${req.params.MANXB}.`)); // Trả về lỗi không tìm thấy
        }

        res.send(document);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi tìm nhà xuất bản với MANXB=${req.params.MANXB}.`)); // Trả về lỗi hệ thống
    }
};

// Cập nhật thông tin nhà xuất bản theo MANXB
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống.")); // Trả về lỗi dữ liệu rỗng
    }

    try {
        const publisherService = new PublisherService();
        const document = await publisherService.update(req.params.MANXB, req.body); // Gọi phương thức update từ PublisherService

        if (!document) {
            return next(new ApiError(404, `Không tìm thấy nhà xuất bản với MANXB=${req.params.MANXB}.`)); // Trả về lỗi không tìm thấy
        }

        res.send({
            message: "Cập nhật nhà xuất bản thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi cập nhật nhà xuất bản với MANXB=${req.params.MANXB}.`)); // Trả về lỗi hệ thống
    }
};

// Xóa nhà xuất bản theo MANXB
exports.delete = async (req, res, next) => {
    try {
        const publisherService = new PublisherService();
        const document = await publisherService.delete(req.params.MANXB); // Gọi phương thức delete từ PublisherService

        if (!document) {
            return next(new ApiError(404, `Không tìm thấy nhà xuất bản với MANXB=${req.params.MANXB}.`)); // Trả về lỗi không tìm thấy
        }

        res.send({
            message: "Xóa nhà xuất bản thành công.",
            data: document,
        });
    } catch (error) {
        if (error.message.includes("Không thể xóa nhà xuất bản vì có sách liên kết")) {
            next(new ApiError(400, error.message)); // Trả về lỗi liên kết với sách
        } else {
            next(new ApiError(500, `Có lỗi xảy ra khi xóa nhà xuất bản với MANXB=${req.params.MANXB}.`)); // Trả về lỗi hệ thống
        }
    }
};