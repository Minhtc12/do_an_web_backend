const ReaderService = require("../services/reader.service");
const jwt = require("jsonwebtoken");

// Đăng ký tài khoản độc giả
exports.register = async (req, res, next) => {
  try {
    const { Email, TEN, Password } = req.body; // Chỉ lấy những trường cần thiết
    const readerService = new ReaderService();

    // Gọi Service để xử lý đăng ký
    const result = await readerService.register({ Email, TEN, Password });
    res.status(201).json({ message: "Registration successful", reader: result });
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

        // Tạo token JWT
        const token = jwt.sign(
            { MADOCGIA: reader.MADOCGIA, 
              Email: reader.Email,
             },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        // Trả về token và vai trò (role = "Reader")
        res.json({
            message: "Đăng nhập thành công!",
            token,
            role: "Reader",
            name: reader.TEN,
            MADOCGIA: reader.MADOCGIA,
        });
    } catch (error) {
        next(error);
    }
};

// Lấy thông tin độc giả
exports.getInfo = async (req, res, next) => {
  try {
    const readerService = new ReaderService();
    // Lấy MADOCGIA từ token (req.user)
    const reader = await readerService.findById(req.user.MADOCGIA); 
    res.json(reader);
  } catch (error) {
    next(error);
  }
};

// Cập nhật thông tin tài khoản độc giả
// exports.updateInfo = async (req, res, next) => {
//     try {
//         const readerService = new ReaderService();
//         const result = await readerService.update(req.params.MADOCGIA, req.body);
//         res.json(result);
//     } catch (error) {
//         next(error);
//     }
// };
exports.updateInfo = async (req, res, next) => {
  try {
    const readerService = new ReaderService();
    // Lấy MADOCGIA từ token (req.user)
    const updatedReader = await readerService.update(req.user.MADOCGIA, req.body); 
    res.json({ message: "Information updated successfully", reader: updatedReader });
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

