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
       res.json({
      message: "Yêu cầu mượn sách đã được duyệt thành công!",
      borrow: result, // Trả về bản ghi cập nhật
    });
    } catch (error) {
        next(error);
    }
};

// Trả sách
exports.returnBook = async (req, res, next) => {
  const { MaMuon } = req.params;

  try {
    const borrowingService = new BorrowingService();
    const result = await borrowingService.returnBook(MaMuon);
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
exports.getBooksNotReturned = async (req, res, next) => {
  try {
    const borrowingService = new BorrowingService();
    const notReturnedBooks = await borrowingService.getBooksNotReturned();
    res.json(notReturnedBooks);
  } catch (error) {
    next(error);
  }
};
exports.cancelBorrowRequest = async (req, res, next) => {
  const { MaMuon } = req.params;

  try {
    const borrowingService = new BorrowingService();
    const result = await borrowingService.cancelBorrowRequest(MaMuon);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
exports.getBorrowHistoryByUser = async (req, res, next) => {
  const { MADOCGIA } = req.user;
console.log("MADOCGIA từ token:", MADOCGIA);
  try {
    const borrowingService = new BorrowingService();
    const history = await borrowingService.getBorrowHistoryByUser(MADOCGIA);
    res.json(history);
  } catch (error) {
    next(error);
  }
};