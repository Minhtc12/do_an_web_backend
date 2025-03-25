const Employee = require("../models/employee.model");
const bcrypt = require("bcrypt");

class EmployeeService {
    // Thêm nhân viên mới
    async create(payload) {
        const employee = new Employee(payload);

        try {
            const savedEmployee = await employee.save();
            return savedEmployee;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("Email hoặc MSNV đã tồn tại. Vui lòng sử dụng một thông tin khác.");
            }
            throw error;
        }
    }



    // Lấy danh sách nhân viên (có thể lọc)
    async find(filter) {
        return await Employee.find(filter).select("-_id"); // Loại bỏ _id khi trả về
    }

    // Lấy thông tin nhân viên theo MSNV
    async findById(msnv) {
        const employee = await Employee.findOne({ MSNV: msnv }).select("-_id");
        if (!employee) {
            throw new Error(`Không tìm thấy nhân viên với MSNV=${msnv}.`);
        }
        return employee;
    }

    // Cập nhật thông tin nhân viên
    async update(msnv, payload) {
        const updatedEmployee = await Employee.findOneAndUpdate(
            { MSNV: msnv },
            { $set: payload },
            { new: true }
        );
        if (!updatedEmployee) {
            throw new Error(`Không tìm thấy nhân viên với MSNV=${msnv}.`);
        }
        return updatedEmployee;
    }

    // Xóa nhân viên
    async delete(msnv) {
        const deletedEmployee = await Employee.findOneAndDelete({ MSNV: msnv });
        if (!deletedEmployee) {
            throw new Error(`Không tìm thấy nhân viên với MSNV=${msnv}.`);
        }
        return deletedEmployee;
    }

    // Xác thực thông tin nhân viên (Đăng nhập bằng Email)
    async authenticate(email, password) {
        const employee = await Employee.findOne({ Email: email });
        if (!employee) {
            throw new Error("Email không tồn tại.");
        }

        // Kiểm tra mật khẩu
        const isPasswordValid = await bcrypt.compare(password, employee.Password);
        if (!isPasswordValid) {
            throw new Error("Mật khẩu không đúng.");
        }

        return employee; // Trả về thông tin nhân viên nếu đăng nhập thành công
    }


    // Kiểm tra vai trò (Chức vụ)
    async checkRole(msnv, requiredRole) {
        const employee = await Employee.findOne({ MSNV: msnv });
        if (!employee || employee.ChucVu !== requiredRole) {
            throw new Error("Bạn không có quyền thực hiện hành động này.");
        }
    }
    

}

module.exports = EmployeeService;