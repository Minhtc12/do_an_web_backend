const jwt = require("jsonwebtoken");

// Middleware xác thực token
exports.authenticate = (req, res, next) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(" ")[1]; // Tách "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: "Vui lòng đăng nhập!" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // Giải mã token
        req.user = decoded; // Lưu thông tin người dùng vào req
        next(); // Tiếp tục xử lý yêu cầu
    } catch (error) {
        return res.status(403).json({ message: "Token không hợp lệ hoặc đã hết hạn!" });
    }
};

// Middleware kiểm tra quyền hạn
exports.authorize = (requiredRoles) => (req, res, next) => {
    const { ChucVu } = req.user;

    if (!requiredRoles.includes(ChucVu)) {
        return res.status(403).json({ message: "Bạn không có quyền truy cập vào tài nguyên này!" });
    }

    next(); // Tiếp tục nếu quyền hợp lệ
};