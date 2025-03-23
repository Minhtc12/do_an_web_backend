const { ObjectId } = require("mongodb");

class EmployeeService {
    constructor(client) {
        this.Employee = client.db().collection("NhanVien"); // Collection NhanVien
        this.BorrowingRecord = client.db().collection("THEODOIMUONSACH"); // Collection THEODOIMUONSACH
    }

    // Chuẩn hóa dữ liệu nhân viên
    extractEmployeeData(payload) {
        const employee = {
            MASNV: payload.MASNV,
            HoTenNV: payload.HoTenNV,
            Password: payload.Password,
            ChucVu: payload.ChucVu,
            DiaChi: payload.DiaChi,
            SoDienThoai: payload.SoDienThoai,
        };
        Object.keys(employee).forEach(
            (key) => employee[key] === undefined && delete employee[key]
        );
        return employee;
    }

    // Thêm nhân viên mới
    async create(payload) {
        const employee = this.extractEmployeeData(payload);

        try {
            const result = await this.Employee.insertOne(employee);
            return result.ops[0]; // Trả về nhân viên vừa thêm
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("MASNV đã tồn tại. Vui lòng sử dụng một mã khác.");
            }
            throw error;
        }
    }

    // Lấy danh sách tất cả nhân viên
    async find(filter) {
        const cursor = this.Employee.find(filter).project({ _id: 0 }); // Loại bỏ `_id` khi trả về
        return await cursor.toArray();
    }

    // Lấy thông tin nhân viên theo MASNV
    async findById(masnv) {
        return await this.Employee.findOne({ MASNV: masnv }, { projection: { _id: 0 } });
    }

    // Cập nhật thông tin nhân viên theo MASNV
    async update(masnv, payload) {
        const filter = { MASNV: masnv }; // Truy vấn theo MASNV
        const update = this.extractEmployeeData(payload);
        const result = await this.Employee.findOneAndUpdate(
            filter,
            { $set: update },
            { returnDocument: "after" }
        );

        if (!result.value) {
            throw new Error(`Không tìm thấy nhân viên với MASNV=${masnv}.`);
        }

        return result.value; // Trả về thông tin nhân viên đã cập nhật
    }

    // Xóa nhân viên theo MASNV
    async delete(masnv) {
        // Kiểm tra ràng buộc mượn sách trước khi xóa
        const linkedRecords = await this.BorrowingRecord.countDocuments({ MASNV: masnv });
        if (linkedRecords > 0) {
            throw new Error("Không thể xóa nhân viên vì còn bản ghi mượn sách liên quan.");
        }

        const result = await this.Employee.findOneAndDelete({ MASNV: masnv });

        if (!result.value) {
            throw new Error(`Không tìm thấy nhân viên với MASNV=${masnv}.`);
        }

        return result.value; // Trả về thông tin nhân viên đã xóa
    }

    // Xóa toàn bộ nhân viên
    async deleteAll() {
        const result = await this.Employee.deleteMany({});
        return result.deletedCount; // Trả về số lượng nhân viên đã xóa
    }

    // Kiểm tra thông tin nhân viên (Dành cho đăng nhập hoặc xác thực)
    async authenticate(masnv, password) {
        const employee = await this.Employee.findOne({ MASNV: masnv, Password: password });
        if (!employee) {
            throw new Error("Tên đăng nhập hoặc mật khẩu không đúng.");
        }
        return employee; // Trả về thông tin nhân viên nếu đăng nhập thành công
    }

    // Lấy thông tin nhân viên kèm các bản ghi mượn sách
    async getEmployeeWithBorrowingRecords(masnv) {
        const employee = await this.Employee.findOne({ MASNV: masnv }, { projection: { _id: 0 } });

        if (!employee) {
            throw new Error("Không tìm thấy nhân viên.");
        }

        const borrowingRecords = await this.BorrowingRecord.find({ MASNV: masnv }).toArray();

        return { ...employee, borrowingRecords };
    }
}

module.exports = EmployeeService;