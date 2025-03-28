const EmployeeService = require("../services/employee.service");
const jwt = require("jsonwebtoken");

// Thêm nhân viên mới
exports.create = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService();
        const result = await employeeService.create(req.body);
        res.json(result);
    } catch (error) {
        next(error);
    }
};

// Lấy danh sách nhân viên
exports.findAll = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService();
        const employees = await employeeService.find(req.query);
        res.json(employees);
    } catch (error) {
        next(error);
    }
};

// Lấy thông tin nhân viên theo MSNV
exports.findById = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService();
    // Lấy MSNV từ token (req.user)
    const employee = await employeeService.findById(req.user.MSNV);
    res.json(employee);
  } catch (error) {
    next(error);
  }
};
// Cập nhật thông tin nhân viên
exports.update = async (req, res, next) => {
  try {
    const employeeService = new EmployeeService();
    // Lấy MSNV từ token (req.user)
    const updatedEmployee = await employeeService.update(req.user.MSNV, req.body); 
    res.json({ message: "Employee updated successfully", employee: updatedEmployee });
  } catch (error) {
    next(error);
  }
};

// Xóa nhân viên
exports.delete = async (req, res, next) => {
    try {
        const employeeService = new EmployeeService();
        const deletedEmployee = await employeeService.delete(req.params.MSNV);
        res.json(deletedEmployee);
    } catch (error) {
        next(error);
    }
};
// Đăng nhập (Xác thực bằng Email)
exports.login = async (req, res, next) => {
  const { Email, Password } = req.body;

  try {
    const employeeService = new EmployeeService();
    const employee = await employeeService.authenticate(Email, Password);

    // Tạo token JWT
    const token = jwt.sign(
      { MSNV: employee.MSNV, Email: employee.Email, ChucVu: employee.ChucVu },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Trả về token và vai trò từ Chức vụ của nhân viên
    res.json({ message: "Đăng nhập thành công!", token, role: employee.ChucVu,MSNV: employee.MSNV, });
  } catch (error) {
    console.error("Lỗi trong login controller:", error.message);
    next(error);
  }
};
