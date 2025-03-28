const BookService = require("../services/book.service");
const BorrowingRecord = require("../models/borrowing.model");
const Book = require("../models/book.model");

exports.create = async (req, res, next) => {
    try {
        const bookService = new BookService();
        const result = await bookService.create(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const bookService = new BookService();
        const books = await bookService.find(req.query);
        res.json(books);
    } catch (error) {
        next(error);
    }
};

exports.findById = async (req, res, next) => {
    try {
        const bookService = new BookService();
        const book = await bookService.findById(req.params.MASACH);
        res.json(book);
    } catch (error) {
        next(error);
    }
};

exports.update = async (req, res, next) => {
    try {
        const bookService = new BookService();
        const updatedBook = await bookService.update(req.params.MASACH, req.body);
        res.json(updatedBook);
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const bookService = new BookService();
        const deletedBook = await bookService.delete(req.params.MASACH);
        res.json(deletedBook);
    } catch (error) {
        next(error);
    }
};
// Tìm kiếm sách theo tên hoặc tác giả
exports.search = async (req, res, next) => {
    try {
        const query = req.query.q || ""; // Lấy query từ request
        const bookService = new BookService();
        const books = await bookService.search(query);
        res.json(books);
    } catch (error) {
        next(error);
    }
};
// Tìm sách theo nhà xuất bản
exports.findBooksByPublisher = async (req, res, next) => {
    try {
        const bookService = new BookService();
        const books = await bookService.findBooksByPublisher(req.params.MANXB);
        res.json(books);
    } catch (error) {
        next(error);
    }
};

exports.getAvailableBooks = async (req, res, next) => {
  try {
    console.log("Bắt đầu truy vấn sách có thể mượn...");
    const borrowedBooks = await BorrowingRecord.find({
      TrangThai: { $in: ["borrowed", "not-returned"] },
    }).select("MASACH");

    console.log("Danh sách sách đang mượn:", borrowedBooks);

    const borrowedBookIds = borrowedBooks.map((borrow) => borrow.MASACH);
    console.log("Mã sách đã được mượn:", borrowedBookIds);

    const availableBooks = await Book.find({
      MASACH: { $nin: borrowedBookIds },
    });

    console.log("Danh sách sách có thể mượn:", availableBooks);
    res.json(availableBooks);
  } catch (error) {
    console.error("Lỗi khi xử lý yêu cầu lấy sách có thể mượn:", error.message);
    res.status(500).json({ message: "Có lỗi xảy ra trên server." });
  }
};
