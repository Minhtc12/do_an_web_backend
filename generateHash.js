//truong hợp ko có tài khoản trong csdl thì thêm bằng mongo nhưng mà phải mã hóa mk trrc khi thêm
const bcrypt = require("bcrypt");

async function generateHash(password) {
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log(`Mật khẩu: ${password}`);
    console.log(`Hash: ${hashedPassword}`);
}

generateHash("examplePassword123"); // Thay "examplePassword123" bằng mật khẩu mà bạn muốn sử dụng