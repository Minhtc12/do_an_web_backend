const BorrowingService = require("../services/borrowing.service");

// Gửi yêu cầu mượn sách
exports.createBorrowRequest = async (req, res, next) => {
    try {
        const borrowingService = new BorrowingService();
        const result = await borrowingService.createBorrowRequest(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Xác nhận mượn sách
exports.approveBorrow = async (req, res, next) => {
    const { MaMuon } = req.params;
    const { MSNV } = req.user;

    try {
        const borrowingService = new BorrowingService();
        const result = await borrowingService.approveBorrow(MaMuon, MSNV);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Trả sách
exports.returnBook = async (req, res, next) => {
    const { MaMuon } = req.params;
    const { MSNV } = req.user;

    try {
        const borrowingService = new BorrowingService();
        const result = await borrowingService.returnBook(MaMuon, MSNV);
        res.json(result);
    } catch (error) {
        next(error);
    }
};
// lấy danh sách yêu cầu chờ
exports.getPendingRequests = async (req, res, next) => {
    try {
        const borrowingService = new BorrowingService();
        const pendingRequests = await borrowingService.getPendingRequests();
        res.json(pendingRequests);
    } catch (error) {
        next(error);
    }
};