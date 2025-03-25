const app = require("./app"); // Ứng dụng Express chính
require("dotenv").config();
const config = require("./app/config"); // File cấu hình
const connectDatabase = require("./app/utils/mongoose.util"); // Kết nối MongoDB bằng Mongoose

async function startServer() {
    try {
        // Kết nối cơ sở dữ liệu
        console.log("Connecting to MongoDB...");
        await connectDatabase(config.db.uri); // Gọi hàm kết nối từ mongoose.util.js
        console.log("Connected to MongoDB successfully!");

        // Khởi động server
        const PORT = config.app.port;
        app.listen(PORT, () => {
            console.log(`Server is running on http://localhost:${PORT}`);
        });
    } catch (error) {
        // Log lỗi kết nối cơ sở dữ liệu
        console.error("Cannot connect to the database!", error.message);
        process.exit(1); // Kết thúc ứng dụng nếu lỗi xảy ra
    }
}

startServer(); // Bắt đầu khởi động server