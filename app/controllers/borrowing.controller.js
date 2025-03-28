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
    // Khởi tạo service
    const borrowingService = new BorrowingService();

    // Gọi hàm xử lý logic trả sách từ service
    const result = await borrowingService.returnBook(MaMuon);

    // Trả về thông báo kết quả cho frontend
    res.json(result);
  } catch (error) {
    console.error("Lỗi khi xử lý trả sách tại controller:", error.message);
    res.status(500).json({ message: "Có lỗi xảy ra khi trả sách." });
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

const borrowingService = new BorrowingService();

exports.getPendingBooksByUser = async (req, res, next) => {
  const { MADOCGIA } = req.user;

  try {
    const pendingBooks = await borrowingService.getPendingBooksByUser(MADOCGIA);
    res.json(pendingBooks);
  } catch (error) {
    console.error("Lỗi tại controller getPendingBooksByUser:", error.message);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy danh sách sách chờ duyệt." });
  }
};

exports.getBorrowedBooksByUser = async (req, res, next) => {
  const { MADOCGIA } = req.user;

  try {
    const borrowedBooks = await borrowingService.getBorrowedBooksByUser(MADOCGIA);
    res.json(borrowedBooks);
  } catch (error) {
    console.error("Lỗi tại controller getBorrowedBooksByUser:", error.message);
    res.status(500).json({ message: "Có lỗi xảy ra khi lấy danh sách sách đã mượn." });
  }
};