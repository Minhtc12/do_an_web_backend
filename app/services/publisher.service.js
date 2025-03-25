// const { ObjectId } = require("mongodb");

// class PublisherService {
//     constructor(client) {
//         this.Publisher = client.db().collection("NHAXUATBAN"); // Collection NHAXUATBAN
//         this.Book = client.db().collection("SACH");           // Collection SACH (nếu cần kiểm tra ràng buộc)
//     }

//     // Phương thức chuẩn hóa dữ liệu nhà xuất bản
//     extractPublisherData(payload) {
//         const publisher = {
//             MANXB: payload.MANXB,
//             TENNXB: payload.TENNXB,
//             DIACHI: payload.DIACHI,
//         };
//         Object.keys(publisher).forEach(
//             (key) => publisher[key] === undefined && delete publisher[key]
//         );
//         return publisher;
//     }

//     // Thêm mới nhà xuất bản
//     async create(payload) {
//         const publisher = this.extractPublisherData(payload);

//         try {
//             // Chèn tài liệu vào MongoDB
//             const result = await this.Publisher.insertOne(publisher);
//             return result; // Trả về tài liệu mới
//         } catch (error) {
//             // Kiểm tra nếu lỗi do trùng lặp MANXB
//             if (error.code === 11000) {
//                 throw new Error("MANXB đã tồn tại. Vui lòng sử dụng một mã khác.");
//             }
//             throw error; // Các lỗi khác
//         }
//     }

//     // Lấy danh sách nhà xuất bản
//     async find(filter) {
//         const cursor = this.Publisher.find(filter).project({ _id: 0 }); // Loại bỏ _id khi trả về
//         return await cursor.toArray();
//     }

//     // Lấy nhà xuất bản theo MANXB
//     async findById(manxb) {
//         return await this.Publisher.findOne({ MANXB: manxb }, { projection: { _id: 0 } });
//     }

//     // Cập nhật thông tin nhà xuất bản theo MANXB
//     async update(manxb, payload) {
//         const filter = { MANXB: manxb };
//         const update = this.extractPublisherData(payload);
//         const result = await this.Publisher.findOneAndUpdate(
//             filter,
//             { $set: update },
//             { returnDocument: "after" }
//         );

//         if (!result.value) {
//             throw new Error(`Không tìm thấy nhà xuất bản với MANXB=${manxb}.`);
//         }

//         return result.value; // Trả về tài liệu đã cập nhật
//     }

//     // Xóa nhà xuất bản theo MANXB
//     async delete(manxb) {
//         // (Tùy chọn) Kiểm tra sách liên kết trước khi xóa
//         const linkedBooks = await this.Book.countDocuments({ MANXB: manxb });
//         if (linkedBooks > 0) {
//             throw new Error("Không thể xóa nhà xuất bản vì có sách liên kết.");
//         }

//         const result = await this.Publisher.findOneAndDelete({ MANXB: manxb });

//         if (!result.value) {
//             throw new Error(`Không tìm thấy nhà xuất bản với MANXB=${manxb}.`);
//         }

//         return result.value; // Trả về tài liệu đã xóa
//     }
// }

// module.exports = PublisherService;
const Publisher = require("../models/publisher.model"); // Import mô hình nhà xuất bản
const Book = require("../models/book.model"); // Import mô hình liên kết với bảng SACH

class PublisherService {
    // Thêm mới nhà xuất bản
   async create(payload) {
        // Kiểm tra nếu MANXB đã tồn tại
        const existingPublisher = await Publisher.findOne({ MANXB: payload.MANXB });
        if (existingPublisher) {
            throw new Error("MANXB đã tồn tại. Vui lòng sử dụng mã khác.");
        }
        // Tạo mới nếu không trùng lặp
        const publisher = new Publisher(payload);
        return await publisher.save();
    }

    // Lấy danh sách tất cả nhà xuất bản
    async find(filter) {
        return await Publisher.find(filter); // Trả về danh sách tất cả hoặc có lọc (filter)
    }

    // Lấy thông tin nhà xuất bản theo MANXB
    async findById(manxb) {
        return await Publisher.findOne({ MANXB: manxb }); // Tìm theo MANXB
    }

    // Cập nhật thông tin nhà xuất bản theo MANXB
    async update(manxb, payload) {
        const updatedPublisher = await Publisher.findOneAndUpdate(
            { MANXB: manxb }, // Điều kiện
            { $set: payload }, // Cập nhật nội dung
            { new: true } // Trả về tài liệu sau khi cập nhật
        );
        if (!updatedPublisher) {
            throw new Error(`Không tìm thấy nhà xuất bản với MANXB=${manxb}.`);
        }
        return updatedPublisher;
    }

    // Xóa nhà xuất bản theo MANXB
    async delete(manxb) {
        // Kiểm tra nếu có sách liên kết với nhà xuất bản
        const relatedBooks = await Book.find({ MANXB: manxb });
        if (relatedBooks.length > 0) {
            throw new Error("Không thể xóa nhà xuất bản vì có sách liên kết.");
        }

        // Xóa nhà xuất bản nếu không có sách liên kết
        const deletedPublisher = await Publisher.findOneAndDelete({ MANXB: manxb });
        if (!deletedPublisher) {
            throw new Error(`Không tìm thấy nhà xuất bản với MANXB=${manxb}.`);
        }
        return deletedPublisher;
    }
}

module.exports = PublisherService;