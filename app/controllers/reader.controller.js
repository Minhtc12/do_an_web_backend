const ReaderService = require("../services/reader.service");
const jwt = require("jsonwebtoken");

// Đăng ký tài khoản độc giả
exports.register = async (req, res, next) => {
    try {
        const readerService = new ReaderService();
        const result = await readerService.register(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Đăng nhập và tạo token JWT
exports.login = async (req, res, next) => {
    const { Email, Password } = req.body;

    try {
        const readerService = new ReaderService();
        const reader = await readerService.authenticate(Email, Password);

        const token = jwt.sign(
            { MADOCGIA: reader.MADOCGIA, Email: reader.Email },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        res.json({ message: "Đăng nhập thành công!", token });
    } catch (error) {
        next(error);
    }
};

// Lấy thông tin độc giả
exports.getInfo = async (req, res, next) => {
    try {
        const readerService = new ReaderService();
        const reader = await readerService.findById(req.params.MADOCGIA);
        res.json(reader);
    } catch (error) {
        next(error);
    }
};

// Cập nhật thông tin tài khoản độc giả
exports.updateInfo = async (req, res, next) => {
    try {
        const readerService = new ReaderService();
        const result = await readerService.update(req.params.MADOCGIA, req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Tìm kiếm sách
exports.searchBooks = async (req, res, next) => {
    try {
        const { keyword } = req.query;
        const readerService = new ReaderService();
        const books = await readerService.searchBooks(keyword);
        res.json(books);
    } catch (error) {
        next(error);
    }
};

