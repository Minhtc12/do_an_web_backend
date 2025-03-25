const mongoose = require("mongoose");

const PublisherSchema = new mongoose.Schema({
    MANXB: { type: String, required: true, unique: true }, // Khóa chính
    TENNXB: { type: String, required: true },
    DIACHI: { type: String, required: true },
});

const Publisher = mongoose.model("Publisher", PublisherSchema, "NHAXUATBAN"); // Tên bảng là NHAXUATBAN
Publisher.init()
    .then(() => console.log("Indexes ensured successfully"))
    .catch((error) => console.error("Error ensuring indexes:", error.message));
module.exports = Publisher;