const EmployeeService = require("../services/employee.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

// Thêm mới nhân viên
exports.create = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.create(req.body);

        res.send({
            message: "Nhân viên được thêm thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi thêm nhân viên."));
    }
};

// Lấy danh sách tất cả nhân viên
exports.findAll = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const documents = await employeeService.find(req.query);

        res.send(documents);
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi lấy danh sách nhân viên."));
    }
};

// Lấy thông tin nhân viên theo MASNV
exports.findById = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.findById(req.params.MASNV);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên."));
        }

        res.send(document);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi tìm nhân viên với MASNV=${req.params.MASNV}.`));
    }
};

// Cập nhật thông tin nhân viên theo MASNV
exports.update = async (req, res, next) => {
    if (Object.keys(req.body).length === 0) {
        return next(new ApiError(400, "Dữ liệu cập nhật không được để trống."));
    }

    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.update(req.params.MASNV, req.body);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên."));
        }

        res.send({
            message: "Cập nhật thông tin nhân viên thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi cập nhật thông tin nhân viên với MASNV=${req.params.MASNV}.`));
    }
};

// Xóa nhân viên theo MASNV
exports.delete = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const document = await employeeService.delete(req.params.MASNV);

        if (!document) {
            return next(new ApiError(404, "Không tìm thấy nhân viên."));
        }

        res.send({
            message: "Xóa nhân viên thành công.",
            data: document,
        });
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi xóa nhân viên với MASNV=${req.params.MASNV}.`));
    }
};

// Xóa toàn bộ nhân viên
exports.deleteAll = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const deletedCount = await employeeService.deleteAll();

        res.send({
            message: `Đã xóa ${deletedCount} nhân viên.`,
        });
    } catch (error) {
        next(new ApiError(500, "Có lỗi xảy ra khi xóa tất cả nhân viên."));
    }
};

// Đăng nhập nhân viên (xác thực thông tin)
exports.authenticate = async (req, res, next) => {
    try {
        const { MASNV, Password } = req.body;
        if (!MASNV || !Password) {
            return next(new ApiError(400, "Tên đăng nhập và mật khẩu là bắt buộc."));
        }

        const employeeService = new EmployeeService(MongoDB.client);
        const employee = await employeeService.authenticate(MASNV, Password);

        res.send({
            message: "Đăng nhập thành công.",
            data: employee,
        });
    } catch (error) {
        next(new ApiError(401, "Tên đăng nhập hoặc mật khẩu không đúng."));
    }
};

// Lấy thông tin nhân viên kèm các bản ghi mượn sách liên quan
exports.getEmployeeWithBorrowingRecords = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService(MongoDB.client);
        const employee = await employeeService.getEmployeeWithBorrowingRecords(req.params.MASNV);

        res.send(employee);
    } catch (error) {
        next(new ApiError(500, `Có lỗi xảy ra khi lấy thông tin nhân viên với bản ghi mượn sách liên quan cho MASNV=${req.params.MASNV}.`));
    }
};